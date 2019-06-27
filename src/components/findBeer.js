import React, { Component } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProfilePic from "./profilePic";
import { Link } from "react-router-dom";

function FindBeer() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [random, setRandom] = useState([]);
    const [error, setError] = useState("");
    const [init, setInit] = useState(0);

    useEffect(() => {
        (async () => {
            if (init == 0) {
                // var x = Math.floor(Math.random() * 10);

                // if ([9, 8, 7].indexOf(x) > -1) {
                //     x = Math.floor(Math.random() * 10);
                // }

                // let results = await axios.get(
                //     `https://api.punkapi.com/v2/beers?brewed_after=01_201${x}&per_page=8`
                // );
                // console.log("response from request", results.data);

                let beersData = [];
                let promises = [];

                for (let i = 0; i < 8; i++) {
                    promises.push(
                        axios.get(`https://api.punkapi.com/v2/beers/random`)
                    );
                }
                Promise.all(promises).then(response => {
                    for (let i = 0; i < response.length; i++) {
                        // console.log("response[i].data[0]", response[i].data[0]);
                        beersData.push(response[i].data[0]);
                    }
                    console.log("beersData", beersData);
                    setRandom(beersData);
                    console.log("random after setRandom", random);
                });

                // setRandom(results.data);
                // setInit(1);
            } else {
                setError("");
                let matches = await axios.get(
                    `https://api.punkapi.com/v2/beers?beer_name=${search}&per_page=16`
                );
                // console.log("matches.data", matches.data);

                if (!matches.data.length) {
                    setError(
                        "Sorry Mate... didn´t find the variety you lookin' for!"
                    );
                }
                setTimeout(() => {
                    setResults(matches.data);
                }, 1000);
            }
        })();
    }, [search]);

    return (
        <div className="findPeopleContainer">
            <div className="searchArea">
                <label className="searchLabel">Search Users by Name</label>
                <input
                    onChange={e => setSearch(e.target.value)}
                    defaultValue={search}
                    className="searchFormField"
                />
                {error && <p className="errorMsg">{error}</p>}
            </div>
            <div className="searchResults">
                {!!results.length && <h1>Your Search Results</h1>}
                {results &&
                    results.map(beer => (
                        <React.Fragment key={beer.id}>
                            <div>
                                {/* <Link to={`/beers/${beer.id}`}> */}
                                <div>
                                    <div className="searchProfilePicContainer">
                                        <img
                                            className="profilePic"
                                            src={
                                                beer.image_url
                                                    ? beer.image_url
                                                    : "./beer_bottle.png"
                                            }
                                            alt={beer.name}
                                        />
                                        <p className="searchNameProfPic">
                                            {beer.name}
                                        </p>
                                        <p className="searchNameProfPic">
                                            {beer.tagline}
                                        </p>
                                    </div>
                                </div>
                                {/* </Link> */}
                            </div>
                        </React.Fragment>
                    ))}
            </div>
            <div className="searchResults">
                <h1>Get Randomly Inspired</h1>
                {random &&
                    random.map(beer => (
                        <React.Fragment key={beer.id}>
                            <div>
                                <Link to={`/beer/${beer.id}`}>
                                    <div>
                                        <div className="searchProfilePicContainer">
                                            <img
                                                className="profilePic"
                                                src={
                                                    beer.image_url
                                                        ? beer.image_url
                                                        : "./beer_bottle.png"
                                                }
                                                alt={beer.name}
                                            />
                                            <p className="searchNameProfPic">
                                                {beer.name}
                                            </p>
                                            <p className="searchNameProfPic">
                                                {beer.tagline}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </React.Fragment>
                    ))}
            </div>
        </div>
    );
}

export default FindBeer;
