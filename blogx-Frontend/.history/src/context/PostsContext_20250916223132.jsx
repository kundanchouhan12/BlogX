// src/components/CreatePostForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';

const CreatePostForm = () => {
  const { token } = useAuth();
  const { addPost } = usePosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Make the API call to create the post on the backend
      const res = await axios.post(
        'http://localhost:8080/api/posts',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The backend should respond with the newly created post, including its ID
      const newPost = res.data;

      // 2. Add the new post to the local state using the addPost function
      addPost(newPost); 

      // 3. Clear the form
      setTitle('');
      setContent('');
      
      console.log('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePostForm;