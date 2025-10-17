import React from "react";
import { Link } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "../constants";

function Header({ imgurl, username }) {
    return (
        <div className="headerContainer">
            <div className="headerLogo">
                <p className="textHeaderLogo" id="paw">
                    Hoppy
                </p>
                <img src="/hop.png" id="hopHeaderLogo" />
                <p className="textHeaderLogo" id="gang">
                    Town
                </p>
            </div>
            <div className="menuContainer">
                <Link to={`/`}>
                    <p className="menuHeader">Profile</p>
                </Link>
                <Link to={`/beers`}>
                    <p className="menuHeader">Search Beers</p>
                </Link>
                <Link to={`/chat`}>
                    <p className="menuHeader">Chat</p>
                </Link>
            </div>
            <div className="headerPicContainer">
                <div>
                    <p className="headerMessage">Welcome,</p>
                    <p className="headerMessage">{username}</p>
                </div>
                <img
                    className="headerPic"
                    src={imgurl ? imgurl : DEFAULT_PROFILE_IMAGE}
                    alt={username}
                />
            </div>
        </div>
    );
}

export default Header;
