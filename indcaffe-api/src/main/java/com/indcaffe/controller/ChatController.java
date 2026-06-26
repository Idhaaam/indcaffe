package com.indcaffe.controller;

import com.indcaffe.dto.ChatPartnerDTO;
import com.indcaffe.dto.MessageResponseDTO;
import com.indcaffe.dto.SendMessageRequestDTO;
import com.indcaffe.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<List<MessageResponseDTO>> getConversation(
            @PathVariable Long userId1, 
            @PathVariable Long userId2) {
        
        List<MessageResponseDTO> response = chatService.getConversation(userId1, userId2);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @Valid @RequestBody SendMessageRequestDTO request) {
        
        MessageResponseDTO response = chatService.sendMessage(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/partners/{userId}")
    public ResponseEntity<List<ChatPartnerDTO>> getChatPartners(@PathVariable Long userId) {
        
        List<ChatPartnerDTO> response = chatService.getChatPartners(userId);
        return ResponseEntity.ok(response);
    }
}
