import { API } from "./backend";
import { toast } from 'react-toastify';  // Import toast

export const uploadData = async (formData) => {
    try {
        const response = await fetch("http://localhost:4000/api/add/images", {
            method: "POST",
            body: formData, // No need to set headers explicitly
        });

        return response.json();
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to upload" };
    }
};

export const getImages = () => {
    return fetch(`${API}/images`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `Error fetching images: ${response.statusText}`
                );
            }
            return response.json();
        })
        .catch((err) => console.error("Error fetching images:", err));
};

export const getImageUrl = (ImageId) => {
    const url = ImageId
        ? `${API}/images/${ImageId}`
        : "https://example.com/default-image.jpg";
    return url;
};

export const deleteImage = (ImageId) => {
    return fetch(`${API}/images/${ImageId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error deleting image: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => console.log("Image deleted successfully:", data))
        .catch((err) => console.error("Error deleting image:", err));
};

// export const createAlbum = async (albumData/*, token*/) => {
//     try {
//         // if (!token) {
//         //     throw new Error("Authorization token is missing");
//         // }
//         // const headers = {
//         //     Authorization: `Bearer ${token}`,
//         // };

//         const formData = new FormData();
//         for (const key in albumData) {
//             if (albumData[key] !== undefined && albumData[key] !== null) {
//                 formData.append(key, albumData[key]);
//             }
//         }

//         for (let pair of formData.entries()) {
//             console.log(`${pair[0]}:${pair[1]}`);
//         }

//         const response = await fetch(`${API}albums/create`, {
//             method: "POST",
//             // headers,
//             body: formData,
//         });
//         if (!response.ok) {
//             const errorData = await response.json();

//             if (errorData.error === "jwt expired") {
//                 // Handle token expiration, prompt login or refresh token
//                 // localStorage.removeItem("token");
//                 toast.error("Session expired. Please log in again.");
//                 // Redirect to login or attempt to refresh the token
//                 window.location.href = "/login"; // You can replace "/login" with your login route
//             }
//             throw new Error(errorData.message || "Failed to create album");
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("Error preserving your keepsakes: ", error);
//         return {
//             error:
//                 error.message || "Failed to preserve your keepsakes",
//         };
//     }
// };