import React, { Component } from "react";

function Welcome_logo() {
    return (
        <div>
            <div className="mainLogo">
                <p className="textLogo" id="paw">
                    Hoppy
                </p>
                <img src="/beer_logo.png" id="pawLogo" />
                <p className="textLogo" id="gang">
                    Town
                </p>
            </div>
        </div>
    );
}

export default Welcome_logo;
