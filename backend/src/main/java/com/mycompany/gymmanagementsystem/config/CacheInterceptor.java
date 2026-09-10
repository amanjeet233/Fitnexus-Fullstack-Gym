package com.mycompany.gymmanagementsystem.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class CacheInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String method = request.getMethod();
        String path = request.getRequestURI();

        // Only cache GET requests for read-only endpoints
        if ("GET".equals(method) && path.startsWith("/api/")) {
            // Cache static data for 60 seconds, allow stale-while-revalidate for 5 minutes
            response.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
            response.setHeader("X-Content-Type-Options", "nosniff");
        } else {
            // No cache for POST/PUT/DELETE
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");
        }

        return true;
    }
}

