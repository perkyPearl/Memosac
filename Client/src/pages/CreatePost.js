import React from 'react';
import 'react-quill/dist/quill.snow.css';
import {useState,useContext} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor";
import { UserContext } from '../UserContext';
import axios from 'axios';

export default function CreatePost() {
  const { userInfo } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const[tags, setTags]=useState('');
  const [redirect, setRedirect] = useState(false);
  const [enhancing, setEnhancing] = useState(false); 
  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('tags',tags);
    data.set('file', files[0]);
    data.set('author', userInfo.id);

    const response = await fetch('http://localhost:4000/create', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  // async function enhanceContentWithAI() {
  //   setEnhancing(true);
  //   try {
  //     const response = await axios.post('http://localhost:4000/enhance', {
  //       title,
  //       summary,
  //       content
  //     });

  //     setContent(response.data.enhancedContent);
  //   } catch (error) {
  //     console.error("Error enhancing content:", error);
  //   } finally {
  //     setEnhancing(false);
  //   }
  // }

  if (redirect) {
    return <Navigate to={'/home'} />;
  }

  return (
    <form className="post-form" onSubmit={createNewPost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} required />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} required />
      <input
            type="text"
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
                  />

      <input type="file"
             onChange={ev => setFiles(ev.target.files)} required />
      
      <Editor value={content} onChange={setContent} />

      <button style={{marginTop:'5px'}}>Create post</button>

      {/* <button type="button" 
              style={{marginTop:'10px'}} 
              onClick={enhanceContentWithAI}
              disabled={enhancing}>
        {enhancing ? "Enhancing..." : "Enhance with AI"}
      </button> */}
    </form>
  );
}
