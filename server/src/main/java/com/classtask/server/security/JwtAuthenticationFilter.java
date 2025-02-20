package com.classtask.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.classtask.server.repository.UserRepository;
import com.classtask.server.service.JwtService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    private UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String token = jwtService.resolveToken(request);

        if (token == null) {
            chain.doFilter(request, response);
            return;
        }

        try {
            String username = jwtService.validateToken(token);

            if (jwtService.isTokenRevoked(token)) {
                throw new Exception("Token is revoked");
            }

            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(userRepository.findByUsername(username), null,
                            AuthorityUtils.createAuthorityList("USER")));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("message", e.getMessage());

            response.getWriter().write(jsonResponse.toString());
            return;
        }

        chain.doFilter(request, response);
    }
}
