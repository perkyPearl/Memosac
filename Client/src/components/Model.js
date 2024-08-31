import React from "react";
import { getImageUrl } from "../apicalls";
import {motion} from 'framer-motion';
const Model = ({ selectedImg, setSelectedImg }) => {
    const handleClose = (e) => {
        if (e.target.classList.contains("model")) {
            setSelectedImg("");
        }
    };

    return (
        selectedImg && (
            <motion.div
            initial={{x:'-100vw'}}
            animate={{x:0}} 
            transition={{type:'spring',stiffness:400}}
            className="model" onClick={handleClose}>
                <motion.img
                initial={{opacity:.5}}
                animate={{opacity:1}} src={getImageUrl(selectedImg)} alt="Enlarged view" />
            </motion.div>
        )
    );
};

export default Model;
