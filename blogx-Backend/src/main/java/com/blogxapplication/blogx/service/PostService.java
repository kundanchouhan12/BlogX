package com.blogxapplication.blogx.service;

import com.blogxapplication.blogx.dto.PostRequestDto;
import com.blogxapplication.blogx.dto.PostResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PostService {
    PostResponseDto createPost(PostRequestDto postRequestDto, MultipartFile image, String username) throws IOException;
    PostResponseDto updatePost(Long postId, PostRequestDto postRequestDto, MultipartFile image) throws IOException;
    PostResponseDto getPostById(Long postId);
    List<PostResponseDto> getAllPosts();
    void deletePost(Long postId, String username);
    void deleteAllPosts();
}
