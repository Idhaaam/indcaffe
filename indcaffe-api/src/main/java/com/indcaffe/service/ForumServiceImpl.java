package com.indcaffe.service;

import com.indcaffe.dto.forum.*;
import com.indcaffe.entity.ForumReply;
import com.indcaffe.entity.ForumThread;
import com.indcaffe.entity.User;
import com.indcaffe.repository.ForumReplyRepository;
import com.indcaffe.repository.ForumThreadRepository;
import com.indcaffe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForumServiceImpl implements ForumService {

    private final ForumThreadRepository threadRepository;
    private final ForumReplyRepository replyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ThreadSummaryDTO> getAllThreads() {
        return threadRepository.findAll().stream().map(thread -> {
            long replyCount = replyRepository.countByThreadId(thread.getId());
            return ThreadSummaryDTO.builder()
                    .id(thread.getId())
                    .title(thread.getTitle())
                    .category(thread.getCategory())
                    .authorName(thread.getAuthor().getUsername())
                    .createdAt(thread.getCreatedAt())
                    .replyCount(replyCount)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ThreadDetailDTO getThreadById(Long id) {
        ForumThread thread = threadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        List<ReplyDTO> replies = replyRepository.findByThreadId(id).stream().map(reply -> 
            ReplyDTO.builder()
                    .id(reply.getId())
                    .authorName(reply.getAuthor().getUsername())
                    .content(reply.getContent())
                    .createdAt(reply.getCreatedAt())
                    .build()
        ).collect(Collectors.toList());

        return ThreadDetailDTO.builder()
                .id(thread.getId())
                .title(thread.getTitle())
                .content(thread.getContent())
                .category(thread.getCategory())
                .authorName(thread.getAuthor().getUsername())
                .createdAt(thread.getCreatedAt())
                .replies(replies)
                .build();
    }

    @Override
    @Transactional
    public ThreadSummaryDTO createThread(CreateThreadRequestDTO request) {
        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ForumThread thread = ForumThread.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .author(author)
                .build();

        thread = threadRepository.save(thread);

        return ThreadSummaryDTO.builder()
                .id(thread.getId())
                .title(thread.getTitle())
                .category(thread.getCategory())
                .authorName(author.getUsername())
                .createdAt(thread.getCreatedAt())
                .replyCount(0)
                .build();
    }

    @Override
    @Transactional
    public ReplyDTO addReply(Long threadId, CreateReplyRequestDTO request) {
        ForumThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ForumReply reply = ForumReply.builder()
                .thread(thread)
                .author(author)
                .content(request.getContent())
                .build();

        reply = replyRepository.save(reply);

        return ReplyDTO.builder()
                .id(reply.getId())
                .authorName(author.getUsername())
                .content(reply.getContent())
                .createdAt(reply.getCreatedAt())
                .build();
    }
}
