package com.blogxapplication.blogx.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    // Title max 500 chars
    @Column(nullable = false, length = 500)
    private String title;

    // Content can be very long
    @Column(length = 5000, nullable = false)
    private String content;

    private String imageUrl;

    private String imagePublicId; // 👈 delete ke liye use hoga

    private String category;
}
