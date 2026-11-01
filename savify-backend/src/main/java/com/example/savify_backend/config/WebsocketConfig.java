package com.example.savify_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable a simple in-memory broker to carry messages to subscribers on /topic destinations.
        registry.enableSimpleBroker("/topic");

        // Messages sent from clients whose destination starts with /app will be routed
        // to @MessageMapping-annotated methods in controllers.
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Clients connect to ws://localhost:8080/ws to initiate the WebSocket handshake.
        // SockJS is enabled as a fallback for browsers that don't support native WebSockets.
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173", "http://localhost:4173")
                .withSockJS();
    }
}
