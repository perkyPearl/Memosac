import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AllTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/tags")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

  return (
    <div>
      <h2>All Tags</h2>
      <ul>
        {tags.map((tag, index) => (
          <li key={index}>
            <Link to={`/tag/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}