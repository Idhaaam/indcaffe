package com.indcaffe.repository;

import com.indcaffe.entity.ForumReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {
    List<ForumReply> findByThreadId(Long threadId);
    long countByThreadId(Long threadId);
}
