package com.blogxapplication.blogx.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseDto {
    private Long id;
    private String content;
    private Long userId;
    private Long postId;
    private String username;
    private String postTitle;
}
