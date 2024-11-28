import React, {useEffect, useState} from "react";
import CreateAlbum from '../components/CreateAlbum';
import "../styles/Album.css";

const AlbumDashboard = () => {
    const [token, setToken] = useState(null);
    const[isTokenLoaded, setIsTokenLoaded] = useState(false);
    console.log("Token from localStorage:", token);

    useEffect(()=>{
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        setIsTokenLoaded(true);
    },[]);

    const handleAlbumCreated = () => {
        console.log("Your keepsakes are successfully preserved in Memosac");
        alert("New Memosac Successfully Preserved")
    };

    if (!isTokenLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
            }}>
            <h1 className="maintitle">Preserve Your Cherished Memories</h1>
            <p className="maintitlepara">
                "What will your Memosac be called?" Start creating your album
                and keep your memories alive!
            </p>
            {token ? (
                <CreateAlbum
                    token={token}
                    onAlbumCreated={handleAlbumCreated}
                />
            ) : (
                <p>Please log in to create an album</p>
            )}
        </div>
    );
}
export  default AlbumDashboard;