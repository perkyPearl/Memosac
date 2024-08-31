import { API } from './backend';

export const uploadData = (data)=>{
    const formData = new FormData();
    formData.append("image", data);
    
    return fetch(`${API}/add/image`,{
        method:"POST",
        headers:{
            Accept:"application/json",
        },
        body:data,
    }).then(response=>response.json())
    .catch(err=>console.log(err));
};

export const getImages = () =>{
    return fetch(`${API}/images`,{
        method:"GET",
    }).then(response=>response.json())
    .catch(err=>console.log(err));
}

export const getImageUrl=(ImageId)=>{
    const url = ImageId
        ? `${API}/image/${ImageId}`
        : "https://delprincipefamilytree.com/wp-content/uploads/2012/07/bigstock-Family-Heirlooms-8652979.jpg";
    return url;
}