import React, { useState } from "react";
import BeerGrid from "./shared/BeerGrid";
import useBeerSearch from "../hooks/useBeerSearch";
import useRandomBeers from "../hooks/useRandomBeers";

function FindBeer() {
    const [search, setSearch] = useState("");
    const { results, loading: searchLoading, error: searchError } = useBeerSearch(search);
    const { beers: randomBeers, loading: randomLoading } = useRandomBeers(8);

    return (
        <div className="findBeerContainer">
            <div className="searchArea">
                <label className="searchLabel">Search Beers by Name</label>
                <input
                    onChange={e => setSearch(e.target.value)}
                    value={search}
                    className="searchFormField"
                    placeholder="Enter beer name..."
                />
                {searchError && <p className="errorMsg">{searchError}</p>}
                {searchLoading && <p className="loadingMsg">Searching...</p>}
            </div>
            
            <div className="searchResults">
                {results.length > 0 && (
                    <h1 className="beerCellarTitle beerCellarTitleSearch">
                        Your Search Results
                    </h1>
                )}
                <BeerGrid 
                    beers={results} 
                    emptyMessage={search ? "No beers found for your search" : ""}
                />
            </div>
            
            <div className="searchResults">
                {randomBeers.length > 0 && (
                    <h1 className="beerCellarTitle beerCellarTitleSearch">
                        Get Randomly Inspired...
                    </h1>
                )}
                {randomLoading ? (
                    <p className="loadingMsg">Loading random beers...</p>
                ) : (
                    <BeerGrid 
                        beers={randomBeers} 
                        emptyMessage="No random beers available"
                    />
                )}
            </div>
        </div>
    );
}

export default FindBeer;
