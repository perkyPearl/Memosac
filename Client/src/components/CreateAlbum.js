import React,{useState} from "react";
import {useNavigate} from 'react-router-dom';
import {createAlbum} from "../apicalls";
import "../styles/Album.css";

const CreateAlbum = ({token, onAlbumCreated}) => {

    const[formData, setFormData] = useState({
        albumName:"",
        description:"",
        coverImage:null,
        images:[ ],
        tags: "",
        isPublic: true
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const{name, value, type, checked} = e.target;
        
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked:value,
        });
    };

   const handleFileChange = (e) => {
       setFormData([...e.target.files]); // Save all images
   };

     const handleCoverImageChange = (e) => {
         setFormData(e.target.files[0]); // Save the cover image separately
     };


    const [error, setError] = useState(null);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!formData.albumName) {
            setError("Please give a title to your Memosac");
            console.log("Album name is missing:", formData.albumName);
            return;
        }
        // const token = localStorage.getItem("token");
        // console.log("Token from localStorage:", token); // Log the token to check if it's null or valid
        if (!token) {
            setError("Authorization token is missing");
            return;
        }

        const data = new FormData();
        data.append("albumName", formData.albumName);
        console.log("Album Name:", formData.albumName);

        data.append(
            "description",
            formData.description || "No description provided"
        );
        data.append("tags", formData.tags || "No tags");
        data.append("isPublic", formData.isPublic);

        if (formData.coverImage) {
            data.append("coverImage", formData.coverImage);
        }

        formData.images.forEach((image) => {
            data.append("images", image);
        });

        // Log FormData before sending it
        for (let pair of data.entries()) {
            console.log(pair[0] + ": " + pair[1]); // This will log the key-value pairs
        }

        try {
            const result = await createAlbum(data, token);
            if (result.error) {
                setError(result.error);
            } else {
                alert(
                    "Hurray!! Your Keepsakes are successfully preserved in your Memosac🥳🥳"
                );
                onAlbumCreated();
                navigate("/albums");
            }
        } catch (err) {
            setError("Failed to preserve your keepsakes. Please try again");
        }
    };

    return (
        <form className="album-form" onSubmit={handleSubmit}>
            <h1>Assemble your Keepsakes</h1>
            <label>
                Tag Your Memosac:
                <input
                    type="text"
                    name="albumName"
                    value={formData.albumName}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Through the Years:
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </label>
            <label>
                Add a Memory Seal:
                <input
                    type="file"
                    name="coverImage"
                    onChange={handleCoverImageChange}
                    required
                />
            </label>
            <label>
                Memory Labels (comma-separated):
                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                />
            </label>
            <label className="checkbox-label">
                Public:
                <input
                    type="checkbox"
                    className="custom-checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                />
            </label>
            <label>
                Upload your Keepsakes:
                <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                />
            </label>
            <button className="submit-btn" type="submit">
                Preserve your Keepsakes
            </button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default CreateAlbum;