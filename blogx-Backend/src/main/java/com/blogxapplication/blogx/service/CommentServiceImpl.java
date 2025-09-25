package com.blogxapplication.blogx.service;

import com.blogxapplication.blogx.dto.CommentRequestDto;
import com.blogxapplication.blogx.dto.CommentResponseDto;
import com.blogxapplication.blogx.dto.PostResponseDto;
import com.blogxapplication.blogx.entity.Comment;
import com.blogxapplication.blogx.entity.Post;
import com.blogxapplication.blogx.entity.User;
import com.blogxapplication.blogx.exception.UnauthorizedActionException;
import com.blogxapplication.blogx.repository.CommentRepository;
import com.blogxapplication.blogx.repository.PostRepository;
import com.blogxapplication.blogx.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentServiceImpl(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    // ✅ OLD: Still keep this (agar kahin userId ke sath use ho raha ho)
    @Transactional
    @Override
    public CommentResponseDto createComment(CommentRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Invalid user_id: " + dto.getUserId()));
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Invalid post_id: " + dto.getPostId()));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(dto.getContent());

        Comment saved = commentRepository.save(comment);
        return mapToDto(saved);
    }

    // ✅ NEW: JWT username based createComment
    @Override
    @Transactional
    public CommentResponseDto createComment(CommentRequestDto dto, String username) {
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found: " + dto.getPostId()));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(dto.getContent());

        // ✅ Parent comment check
        if (dto.getParentId() != null) {
            Comment parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found: " + dto.getParentId()));
            comment.setParent(parent);
        }

        Comment saved = commentRepository.save(comment);
        return mapToDto(saved);
    }


    @Override
    @Transactional
    public CommentResponseDto updateComment(Long commentId, CommentRequestDto dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        comment.setContent(dto.getContent());
        Comment updated = commentRepository.save(comment);
        return mapToDto(updated);
    }

    @Override
    public List<CommentResponseDto> getAllComments() {
        return commentRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<CommentResponseDto> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // ✅ owner check
        if (!comment.getUser().getName().equals(username)) {
            throw new UnauthorizedActionException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }


    @Override
    @Transactional
    public void deleteAllComments() {
        commentRepository.deleteAll();
    }

    @Override
    public PostResponseDto getPostByCommentId(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        Post post = comment.getPost();

        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setUsername(post.getUser().getName());
        return dto;
    }

    private CommentResponseDto mapToDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUser().getId());
        dto.setPostId(comment.getPost().getId());
        dto.setUsername(comment.getUser().getName());
        dto.setPostTitle(comment.getPost().getTitle());
        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);

        // ✅ nested replies map karo
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            dto.setReplies(comment.getReplies().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
