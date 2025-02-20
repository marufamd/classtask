package com.classtask.server.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.classtask.server.entity.User;
import com.classtask.server.repository.UserRepository;
import com.classtask.server.security.ServerUserDetails;

@Service
public class ServerUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public ServerUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ServerUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        return new ServerUserDetails(user);
    }
}

