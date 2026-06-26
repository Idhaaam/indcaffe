package com.indcaffe.service;

import com.indcaffe.dto.ChatPartnerDTO;
import com.indcaffe.dto.MessageResponseDTO;
import com.indcaffe.dto.SendMessageRequestDTO;
import com.indcaffe.entity.Message;
import com.indcaffe.entity.User;
import com.indcaffe.exception.ResourceNotFoundException;
import com.indcaffe.repository.MessageRepository;
import com.indcaffe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getConversation(Long userId1, Long userId2) {
        if (userId1 <= 0 || userId2 <= 0) {
            throw new IllegalArgumentException("ID pengguna tidak valid");
        }
        
        // Memastikan kedua pengguna ada
        if (!userRepository.existsById(userId1) || !userRepository.existsById(userId2)) {
            throw new ResourceNotFoundException("Pengguna tidak ditemukan dalam sistem");
        }

        List<Message> messages = messageRepository.findConversation(userId1, userId2);
        
        return messages.stream()
                .map(this::mapToMessageResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponseDTO sendMessage(SendMessageRequestDTO request) {
        if (request.senderId().equals(request.receiverId())) {
            throw new IllegalArgumentException("Pengirim dan penerima tidak boleh sama");
        }

        User sender = userRepository.findById(request.senderId())
                .orElseThrow(() -> new ResourceNotFoundException("Pengirim dengan ID " + request.senderId() + " tidak ditemukan"));
                
        User receiver = userRepository.findById(request.receiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Penerima dengan ID " + request.receiverId() + " tidak ditemukan"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .text(request.text())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);

        return mapToMessageResponseDTO(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatPartnerDTO> getChatPartners(Long userId) {
        if (userId <= 0) {
            throw new IllegalArgumentException("ID pengguna tidak valid");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna dengan ID " + userId + " tidak ditemukan"));
                
        String userRole = user.getRole().toString();
        List<User> partners;

        // Aturan bisnis IndCaffe: CAFE chat dengan MITRA, begitu juga sebaliknya
        if ("CAFE".equals(userRole)) {
            partners = userRepository.findAll().stream()
                    .filter(u -> "MITRA".equals(u.getRole().toString()))
                    .collect(Collectors.toList());
        } else if ("MITRA".equals(userRole)) {
            partners = userRepository.findAll().stream()
                    .filter(u -> "CAFE".equals(u.getRole().toString()))
                    .collect(Collectors.toList());
        } else {
            // Jika role lain (ADMIN/MANAGER dll) kembalikan list kosong atau semua
            partners = List.of(); 
        }

        return partners.stream()
                .map(p -> new ChatPartnerDTO(p.getId(), p.getUsername(), p.getRole().toString()))
                .collect(Collectors.toList());
    }

    private MessageResponseDTO mapToMessageResponseDTO(Message message) {
        return new MessageResponseDTO(
                message.getId(),
                message.getSender().getId(),
                message.getReceiver().getId(),
                message.getText(),
                message.getTimestamp() != null ? message.getTimestamp().toString() : LocalDateTime.now().toString(),
                message.getSender().getRole().toString()
        );
    }
}
