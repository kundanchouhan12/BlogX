package com.blogxapplication.blogx.controller;

import com.blogxapplication.blogx.dto.PostRequestDto;
import com.blogxapplication.blogx.dto.PostResponseDto;
import com.blogxapplication.blogx.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // ✅ frontend se call allow
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // ✅ Create Post with image (Cloudinary upload)
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<PostResponseDto> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Principal principal) throws IOException {

        PostRequestDto dto = new PostRequestDto();
        dto.setTitle(title);
        dto.setContent(content);

        PostResponseDto created = postService.createPost(dto, image, principal.getName());
        return ResponseEntity.ok(created);
    }

    // ✅ Get All Posts
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // ✅ Get Post by ID
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // ✅ Update Post (Cloudinary me re-upload)
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<PostResponseDto> updatePost(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        PostRequestDto dto = new PostRequestDto();
        dto.setTitle(title);
        dto.setContent(content);
        PostResponseDto updated = postService.updatePost(id, dto, image);
        return ResponseEntity.ok(updated);
    }

    // ✅ Delete Post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Principal principal) {
        postService.deletePost(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // ✅ Delete All Posts
    @DeleteMapping
    public ResponseEntity<Void> deleteAllPosts() {
        postService.deleteAllPosts();
        return ResponseEntity.noContent().build();
    }
}
