import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';

export default function Editor({ value, onChange }) {
  const quillRef = useRef(null);
  const [imageUploading, setImageUploading] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setImageUploading(true); 
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await uploadImage(formData); // Upload image API
          const imageUrl = response.data.url; // URL of the uploaded image

          const range = quillRef.current.getEditor().getSelection();
          quillRef.current.getEditor().insertEmbed(range.index, 'image', imageUrl);
        } catch (error) {
          console.error("Error uploading image: ", error);
        } finally {
          setImageUploading(false);
        }
      }
    };
  };

  const uploadImage = async (formData) => {
    const uploadUrl = 'https://your-server.com/upload-image';
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json();
  };

  return (
    <div className="content">
      <ReactQuill
        ref={quillRef}
        value={value}
        theme="snow"
        onChange={onChange}
        modules={modules}
      />
      {imageUploading && <div>Uploading Image...</div>}
    </div>
  );
}