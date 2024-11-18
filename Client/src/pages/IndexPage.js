import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  let i = 0;

  useEffect(() => {
    fetch('http://localhost:4000/posts')
      .then(response => response.json())
      .then(posts => setPosts(posts))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="index-page">
      {posts.length > 0 ? (
        posts.map(post => (
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