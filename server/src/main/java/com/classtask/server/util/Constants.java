package com.classtask.server.util;

public class Constants {
    enum LogType {
        LOG,
        WARN,
        ERROR
    }

    public static int VERIFICATION_EXPIRY_TIME = 24 * 3600;

    public static String JWT_TOKEN_HEADER = "Authorization";

    public static String JWT_TOKEN_PREFIX = "Bearer ";
}
