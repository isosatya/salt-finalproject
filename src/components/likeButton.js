import React from "react";
import { useState, useEffect } from "react";
import axios from "./axios";
import { BUTTON_UPDATE_DELAY } from "../constants";

function LikeButton(match) {
    const [button, setButton] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            axios.post("/search_liked_beer/" + match.match).then(results => {
                if (results.data.status == 1) {
                    setTimeout(() => {
                        setButton("Add Beer to Cellar");
                    }, BUTTON_UPDATE_DELAY);
                }
                if (results.data.status == 2) {
                    setTimeout(() => {
                        setButton("Remove from Cellar");
                    }, BUTTON_UPDATE_DELAY);
                }
            });
        })();
    }, [button]);

    function likeBeer() {
        if (button === "Add Beer to Cellar") {
            axios.post("/like_beer/" + match.match).then(results => {
                if (results.data.success) {
                    setButton("");
                } else {
                    setError(true);
                }
            });
        }
        if (button === "Remove from Cellar") {
            axios.post("/dislike_beer/" + match.match).then(results => {
                if (results.data.success) {
                    setButton("");
                }
            });
        }
    }

    return (
        <div>
            {error && <p>Something went wrong!</p>}
            <div>
                <button className="addBeerButton" onClick={likeBeer}>
                    {button}
                </button>
            </div>
        </div>
    );
}

export default LikeButton;
