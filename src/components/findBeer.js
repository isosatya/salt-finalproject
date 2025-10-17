import React from "react";
import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { PUNK_API_BASE_URL, DEFAULT_BEER_IMAGE, RANDOM_BEERS_COUNT, SEARCH_RESULTS_PER_PAGE } from "../constants";

// Component for searching and discovering beers using the Punk API
function FindBeer() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [random, setRandom] = useState([]);
    const [error, setError] = useState("");
    const [init, setInit] = useState(0);

    // Handle beer search and random beer loading
    useEffect(() => {
        (async () => {
            // Load random beers on initial mount
            if (init == 0) {
                let beersData = [];
                let promises = [];

                for (let i = 0; i < RANDOM_BEERS_COUNT; i++) {
                    promises.push(
                        axios.get(`${PUNK_API_BASE_URL}/random`)
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
                // Search for beers by name
                setError("");
                let matches = await axios.get(
                    `${PUNK_API_BASE_URL}?beer_name=${search}&per_page=${SEARCH_RESULTS_PER_PAGE}`
                );

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
                                                            : DEFAULT_BEER_IMAGE
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
                                                            : DEFAULT_BEER_IMAGE
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
