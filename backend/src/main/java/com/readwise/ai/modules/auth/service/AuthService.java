package com.readwise.ai.modules.auth.service;

import com.readwise.ai.modules.auth.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(TokenRefreshRequest request);
    UserDto getCurrentUser(String email);
}
