import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '../Post';
import { useUser } from '../UserContext';
import '../styles/index.css'; 

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { userInfo } = useUser();
  const { tag } = useParams();
  const navigate = useNavigate();
  let i = 0;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = 'http://localhost:4000/posts';
        let options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userInfo.id })
        };

        if (tag) {
          url = `http://localhost:4000/tag/${tag}`;
          options = {
            method: 'GET',
            credentials: 'include'
          };
        }

        const response = await fetch(url, options);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    if (userInfo) {
      fetchPosts();
    }
  }, [userInfo, tag]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="index-page">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <Post key={i++} {...post} />
        ))
      ) : (
        <div className="no-posts-container">
          <h3 className="no-posts-text">No posts available</h3>
          <span className="no-posts-subtext">Posts shared or created will be shown here.</span>
        </div>
      )}
      <button className="floating-button" onClick={() => navigate('/create')}>
        +
      </button>
    </div>
  );
}