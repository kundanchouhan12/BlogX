package com.blogxapplication.blogx.service;

import com.blogxapplication.blogx.dto.PostRequestDto;
import com.blogxapplication.blogx.dto.PostResponseDto;
import com.blogxapplication.blogx.entity.Post;
import com.blogxapplication.blogx.entity.User;
import com.blogxapplication.blogx.repository.PostRepository;
import com.blogxapplication.blogx.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;

    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository, ImageUploadService imageUploadService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.imageUploadService = imageUploadService;
    }

    // ✅ DTO mapping method
    private PostResponseDto mapToDto(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl()); // 👈 Cloudinary ka secure_url
        dto.setUsername(post.getUser().getName()); // 👈 creator ka naam
        return dto;
    }

    @Override
    public PostResponseDto createPost(PostRequestDto dto, MultipartFile image, String username) throws IOException {
        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());

        User user = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);

        // ✅ Cloudinary upload
        if (image != null && !image.isEmpty()) {
            Map uploadResult = imageUploadService.uploadImage(image);
            post.setImageUrl((String) uploadResult.get("secure_url"));
            post.setImagePublicId((String) uploadResult.get("public_id"));
        }

        Post saved = postRepository.save(post);
        return mapToDto(saved);
    }

    @Override
    public PostResponseDto updatePost(Long postId, PostRequestDto postRequestDto, MultipartFile image) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        if (!post.getUser().getName().equals(username)) {
            throw new RuntimeException("Unauthorized to update this post");
        }

        if (postRequestDto.getTitle() != null) post.setTitle(postRequestDto.getTitle());
        if (postRequestDto.getContent() != null) post.setContent(postRequestDto.getContent());

        // ✅ If new image uploaded, delete old one from Cloudinary
        if (image != null && !image.isEmpty()) {
            if (post.getImagePublicId() != null) {
                imageUploadService.deleteImage(post.getImagePublicId());
            }
            Map uploadResult = imageUploadService.uploadImage(image);
            post.setImageUrl((String) uploadResult.get("secure_url"));
            post.setImagePublicId((String) uploadResult.get("public_id"));
        }

        return mapToDto(postRepository.save(post));
    }

    @Override
    public PostResponseDto getPostById(Long postId) {
        return mapToDto(postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found")));
    }

    @Override
    public List<PostResponseDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deletePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getName().equals(username)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        // ✅ Delete image from Cloudinary
        if (post.getImagePublicId() != null) {
            try {
                imageUploadService.deleteImage(post.getImagePublicId());
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete image from Cloudinary", e);
            }
        }

        postRepository.delete(post);
    }
    @Override
    public void deleteAllPosts() {
        postRepository.deleteAll();
    }
}
