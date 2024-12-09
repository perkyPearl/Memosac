import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        console.log(postInfo);
        setPostInfo(postInfo);
      });
    });
  }, [id]);

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <div className="post-info">
        <div>
          <h1>{postInfo.title}</h1>
          <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
          <div className="author">by @{postInfo.author.username}</div>
        </div>
      </div>
      <div className="image">
        <img src={postInfo.cover} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
      
      {/* Display Tags */}
      {postInfo.tags && postInfo.tags.length > 0 && (
        <div className="tags">
          <h3>Tags:</h3>
          {postInfo.tags.map((tag, index) => (
            <Link to={`/tag/${tag}`} key={index} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
