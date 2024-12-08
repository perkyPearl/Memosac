import React, { useEffect, useState } from 'react';
import Post from '../Post';
import { useUser } from '../UserContext';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { userInfo } = useUser();
  let i = 0;

  useEffect(() => {
    if (userInfo) {
      fetch('http://localhost:4000/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userInfo.id })
      })
        .then(response => response.json())
        .then(posts => setPosts(posts))
        .catch(err => console.error(err));
    }
  }, [userInfo]);

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
    </div>
  );
}