package com.indcaffe.service;

import com.indcaffe.dto.ChatPartnerDTO;
import com.indcaffe.dto.MessageResponseDTO;
import com.indcaffe.dto.SendMessageRequestDTO;

import java.util.List;

public interface ChatService {
    List<MessageResponseDTO> getConversation(Long userId1, Long userId2);
    MessageResponseDTO sendMessage(SendMessageRequestDTO request);
    List<ChatPartnerDTO> getChatPartners(Long userId);
}
