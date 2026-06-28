package com.indcaffe.controller;

import com.indcaffe.dto.forum.CreateReplyRequestDTO;
import com.indcaffe.dto.forum.CreateThreadRequestDTO;
import com.indcaffe.dto.forum.ReplyDTO;
import com.indcaffe.dto.forum.ThreadDetailDTO;
import com.indcaffe.dto.forum.ThreadSummaryDTO;
import com.indcaffe.service.ForumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;

    @GetMapping
    public ResponseEntity<List<ThreadSummaryDTO>> getAllThreads() {
        return ResponseEntity.ok(forumService.getAllThreads());
    }

    @PostMapping
    public ResponseEntity<ThreadSummaryDTO> createThread(@Valid @RequestBody CreateThreadRequestDTO request) {
        return new ResponseEntity<>(forumService.createThread(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreadDetailDTO> getThreadById(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.getThreadById(id));
    }

    @PostMapping("/{id}/replies")
    public ResponseEntity<ReplyDTO> addReply(@PathVariable Long id, @Valid @RequestBody CreateReplyRequestDTO request) {
        return new ResponseEntity<>(forumService.addReply(id, request), HttpStatus.CREATED);
    }
}
