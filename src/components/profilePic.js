import React from "react";
import { DEFAULT_HOP_IMAGE } from "../constants";

function ProfilePic({ imgurl, username, onToggle }) {
    return (
        <div>
            <img
                className="profilePic"
                src={imgurl ? imgurl : DEFAULT_HOP_IMAGE}
                alt={username}
                onClick={onToggle}
            />
        </div>
    );
}

export default ProfilePic;
