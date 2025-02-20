package com.classtask.server.util;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.classtask.server.util.Constants.LogType;

@Component
public class Logger {
    private final String webhookUrl;

    public Logger(@Value("${classtask.webhook.url}") String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    private int rateLimitRemaining = 5;
    private long rateLimitReset = 0;

    public void log(String text) {
        print(text, LogType.LOG);
    }

    public void warn(String text) {
        print(text, LogType.WARN);
    }

    public void error(String text) {
        print(text, LogType.ERROR);
    }

    public void error(Exception text) {
        print(getStackTrace(text), LogType.ERROR);
    }

    private void print(String text, LogType logType) {
        consoleLog(text, logType);
        webhookLog(text, logType);
    }

    public String getStackTrace(Throwable throwable) {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        throwable.printStackTrace(printWriter);
        return stringWriter.toString();
    }

    private void sendRequest(JSONObject payload) {
        try {
            synchronized (Logger.class) {
                long currentTime = System.currentTimeMillis();
                if (currentTime < rateLimitReset && rateLimitRemaining <= 0) {
                    long waitTime = rateLimitReset - currentTime;
                    TimeUnit.MILLISECONDS.sleep(waitTime);
                }
            }

            URL url = new URI(webhookUrl).toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            try (OutputStream outputStream = connection.getOutputStream()) {
                outputStream.write(payload.toString().getBytes());
                outputStream.flush();
            }

            int responseCode = connection.getResponseCode();
            if (responseCode != 204) {
                consoleLog(String.format("Failed to send webhook. HTTP Code %d\n%s", responseCode, connection.getResponseMessage()), LogType.ERROR);
            }

            synchronized (Logger.class) {
                String limitHeader = connection.getHeaderField("X-RateLimit-Limit");
                String remainingHeader = connection.getHeaderField("X-RateLimit-Remaining");
                String resetHeader = connection.getHeaderField("X-RateLimit-Reset");

                if (limitHeader != null) {
                    rateLimitRemaining = Integer.parseInt(remainingHeader);
                    rateLimitReset = Long.parseLong(resetHeader) * 1000;
                }
            }

            connection.disconnect();
        } catch (Exception error) {
            consoleLog(getStackTrace(error), LogType.ERROR);
        }
    }

    public void consoleLog(String text, LogType logType) {
        String colorCode = switch (logType) {
            case LOG -> "\033[1;32m";
            case WARN -> "\033[1;33m";
            case ERROR -> "\033[1;31m";
        };

        String resetCode = "\033[0m";
        String timestamp = "[" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "]";

        System.out.println(colorCode + timestamp + " " + text + resetCode);
    }

    private void webhookLog(String text, LogType logType) {
        String title;
        int color;

        switch (logType) {
            case LogType.WARN:
                title = "Warn";
                color = 14458880;
                break;
            case LogType.ERROR:
                title = "Error";
                color = 14429952;
                break;
            case LogType.LOG:
            default:
                title = "Log";
                color = 56374;
                break;
        }

        long unixTimestamp = Instant.now().getEpochSecond();
        String content = "<t:" + unixTimestamp + ":f>";

        ArrayList<JSONObject> embeds = new ArrayList<>();

        String[] texts = splitMessage(text);

        for (String str : texts) {
            JSONObject embed = new JSONObject();

            embed.put("title", title);
            embed.put("color", color);
            embed.put("description", "```bash\n" + str + "```");

            embeds.add(embed);
        }

        for (int i = 0; i < embeds.size(); i++) {
            JSONObject payload = new JSONObject();
            payload.put("content", content);
            payload.put("embeds", embeds.subList(i, i + 1));

            sendRequest(payload);
        }
    }

    private String[] splitMessage(String input) {
        int maxLength = 3500;

        if (input == null || input.length() <= maxLength) {
            return new String[] { input };
        }

        ArrayList<String> parts = new ArrayList<>();

        for (int i = 0; i < input.length(); i += maxLength) {
            int end = Math.min(i + maxLength, input.length());
            parts.add(input.substring(i, end));
        }

        return parts.toArray(new String[0]);
    }
}
