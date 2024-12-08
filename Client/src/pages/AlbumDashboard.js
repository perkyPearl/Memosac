import React, {useState} from "react";
import CreateAlbum from '../components/CreateAlbum';
import "../styles/Album.css";
import { ToastContainer, toast } from 'react-toastify';
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from 'react-router-dom';  // Import useNavigate

// toast.configure();

const AlbumDashboard = () => {
    // const [token, setToken] = useState(null);
    // const [isTokenLoaded, setIsTokenLoaded] = useState(false);
    // const [error, setError] = useState(null); // Error state to display error messages
    // const [albums, setAlbums] = useState([]);
    // const navigate = useNavigate(); // Get navigate function

    // console.log("Token from localStorage:", token);

    // useEffect(() => {
    //     const storedToken = localStorage.getItem("token");
    //     console.log("Stored Token:", storedToken);
    //     setToken(storedToken);
    //     setIsTokenLoaded(true);
    // }, []);

    const handleAlbumCreated = () => {
        console.log("Your keepsakes are successfully preserved in Memosac");
        toast.success("New Memosac Successfully Preserved");
    };

    // const handleAlbumError = (errorMsg) => {
    //     setError(errorMsg); // Set the error message if album creation fails
    // };
    // if (!isTokenLoaded) {
    //     return <p>Loading...</p>;
    // }

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
            }}>
            <h1 className="maintitle"> Preserve Your Cherished Memories </h1>
            <p className="maintitlepara">
                "What will your Memosac be called?" Start creating your album and keep your memories alive!
            </p>
    
                <CreateAlbum
                    // token={token}
                    onAlbumCreated={handleAlbumCreated}
                />
           
        </div>
    );
}
export  default AlbumDashboard;