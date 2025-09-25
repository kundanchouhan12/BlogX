package com.blogxapplication.blogx.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    private Long userId;
    private Long postId;
    private String content;
    private Long parentId; // ✅ reply ke liye optional
}
