package com.indcaffe.service;

import com.indcaffe.dto.forum.CreateReplyRequestDTO;
import com.indcaffe.dto.forum.CreateThreadRequestDTO;
import com.indcaffe.dto.forum.ReplyDTO;
import com.indcaffe.dto.forum.ThreadDetailDTO;
import com.indcaffe.dto.forum.ThreadSummaryDTO;

import java.util.List;

public interface ForumService {
    List<ThreadSummaryDTO> getAllThreads();
    ThreadDetailDTO getThreadById(Long id);
    ThreadSummaryDTO createThread(CreateThreadRequestDTO request);
    ReplyDTO addReply(Long threadId, CreateReplyRequestDTO request);
}
