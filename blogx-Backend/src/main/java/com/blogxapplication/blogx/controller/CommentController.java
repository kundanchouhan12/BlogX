package com.blogxapplication.blogx.controller;

import com.blogxapplication.blogx.dto.CommentRequestDto;
import com.blogxapplication.blogx.dto.CommentResponseDto;
import com.blogxapplication.blogx.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    // ✅ GET all comments - PUBLIC
    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    // ✅ GET comments by post ID - PUBLIC
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    // 🔒 CREATE comment - LOGIN REQUIRED
    // ✅ Create comment using JWT username
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponseDto> createComment(
            @RequestBody CommentRequestDto dto,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User authUser // Spring Security
    ) {
        String username = authUser.getUsername();
        return ResponseEntity.ok(commentService.createComment(dto, username));
    }


    // 🔒 UPDATE comment by ID - LOGIN REQUIRED
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable("id") Long id,
            @RequestBody CommentRequestDto dto
    ) {
        return ResponseEntity.ok(commentService.updateComment(id, dto));
    }

    // 🔒 DELETE comment by ID - LOGIN REQUIRED
//    @DeleteMapping("/{id}")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<Void> deleteComment(@PathVariable("id") Long id) {
//        commentService.deleteComment(id);
//        return ResponseEntity.noContent().build();
//    }
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User authUser
    ) {
        commentService.deleteComment(id, authUser.getUsername());
        return ResponseEntity.ok("Comment deleted successfully");
    }

    // 🔒 DELETE all comments - LOGIN REQUIRED
    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAllComments() {
        commentService.deleteAllComments();
        return ResponseEntity.noContent().build();
    }
}
