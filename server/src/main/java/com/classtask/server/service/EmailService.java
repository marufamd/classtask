package com.classtask.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class EmailService {
    private final Resend resend;
    private final String fromEmail;

    public EmailService(@Value("${resend.api.key}") String apiKey,
            @Value("${classtask.email.address}") String fromEmail) {
        this.resend = new Resend(apiKey);
        this.fromEmail = fromEmail;
    }

    public CreateEmailResponse sendEmail(String to, String subject, String text) throws ResendException {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(String.format("ClassTask <%s>", fromEmail))
                .to(to)
                .subject(subject)
                .html(text)
                .build();

        return resend.emails().send(params);
    }
}
