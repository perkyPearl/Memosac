import Post from "../Post";
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useUser();
  let i = 0;

  useEffect(() => {
    if (userInfo) {
      fetch('http://localhost:4000/posts', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userInfo.id }) // Send user ID in the request body
      })
        .then(response => response.json())
        .then(posts => setPosts(posts))
        .catch(err => console.error(err));
    }
  }, [userInfo]);

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