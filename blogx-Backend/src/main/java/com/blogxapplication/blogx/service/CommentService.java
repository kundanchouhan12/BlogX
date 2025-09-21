package com.blogxapplication.blogx.service;
import com.blogxapplication.blogx.dto.CommentRequestDto;
import com.blogxapplication.blogx.dto.CommentResponseDto;
import com.blogxapplication.blogx.dto.PostResponseDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// CommentService.java
public interface CommentService {
    // ✅ OLD: Still keep this (agar kahin userId ke sath use ho raha ho)
    @Transactional
    CommentResponseDto createComment(CommentRequestDto dto);

    CommentResponseDto createComment(CommentRequestDto dto, String username); // ✅ add username param
    CommentResponseDto updateComment(Long commentId, CommentRequestDto dto);
    List<CommentResponseDto> getAllComments();
    List<CommentResponseDto> getCommentsByPost(Long postId);
//    void deleteComment(Long commentId);
    void deleteComment(Long commentId, String username);
    void deleteAllComments();
    PostResponseDto getPostByCommentId(Long commentId);
}

