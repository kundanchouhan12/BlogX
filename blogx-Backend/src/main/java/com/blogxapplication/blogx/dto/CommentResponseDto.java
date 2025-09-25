package com.blogxapplication.blogx.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CommentResponseDto {
    private Long id;
    private String content;
    private Long userId;
    private Long postId;
    private String username;
    private String postTitle;
    private Long parentId; // ✅ reply ke liye
    private List<CommentResponseDto> replies; // ✅ nested replies

}
