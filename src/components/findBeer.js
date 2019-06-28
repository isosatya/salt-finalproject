import React, { Component } from "react";
import { useState, useEffect } from "react";
import axios from "./axios";
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
                let beersData = [];
                let promises = [];
                console.log("running when init == 0");

                for (let i = 0; i < 8; i++) {
                    promises.push(
                        axios.get(`https://api.punkapi.com/v2/beers/random`)
                    );
                }
                Promise.all(promises).then(response => {
                    for (let i = 0; i < response.length; i++) {
                        beersData.push(response[i].data[0]);
                    }

                    setRandom(beersData);
                    setInit(1);
                });
            } else {
                setError("");
                console.log("running when init == 1");
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
        <div className="findBeerContainer">
            <div className="searchArea">
                <label className="searchLabel">Search Beers by Name</label>
                <input
                    onChange={e => setSearch(e.target.value)}
                    defaultValue={search}
                    className="searchFormField"
                />
                {error && <p className="errorMsg">{error}</p>}
            </div>
            <div className="searchResults">
                {!!results.length && (
                    <h1 className="beerCellarTitle beerCellarTitleSearch">
                        Your Search Results
                    </h1>
                )}
                <div className="beerCellar">
                    {results &&
                        results.map(beer => (
                            <div key={beer.id} className="beerContainer">
                                <div>
                                    <Link to={`/beer/${beer.id}`}>
                                        <div>
                                            <div className="beerPicAndName">
                                                <img
                                                    className="beerPic"
                                                    src={
                                                        beer.image_url
                                                            ? beer.image_url
                                                            : "./beer_bottle.png"
                                                    }
                                                    alt={beer.name}
                                                />
                                                <p className="nameBeerPic">
                                                    {beer.name}
                                                </p>
                                                <p className="tagBeerPic">
                                                    {beer.tagline}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="searchResults">
                {/* <h1 className="beerCellarTitle">Get Randomly Inspired...</h1> */}
                {!!random.length && (
                    <h1 className="beerCellarTitle beerCellarTitleSearch">
                        Get Randomly Inspired...
                    </h1>
                )}
                <div className="beerCellar">
                    {random &&
                        random.map(beer => (
                            <div key={beer.id} className="beerContainer">
                                <div>
                                    <Link to={`/beer/${beer.id}`}>
                                        <div>
                                            <div className="beerPicAndName">
                                                <img
                                                    className="beerPic"
                                                    src={
                                                        beer.image_url
                                                            ? beer.image_url
                                                            : "./beer_bottle.png"
                                                    }
                                                    alt={beer.name}
                                                />
                                                <p className="nameBeerPic">
                                                    {beer.name}
                                                </p>
                                                <p className="tagBeerPic">
                                                    {beer.tagline}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default FindBeer;
