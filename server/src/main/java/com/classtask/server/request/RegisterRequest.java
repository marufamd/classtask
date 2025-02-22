package com.classtask.server.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String displayName;
    private String username;
    private String password;
    private String email;
}
