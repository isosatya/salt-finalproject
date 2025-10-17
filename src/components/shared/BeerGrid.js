import React from "react";
import BeerCard from "./BeerCard";

/**
 * Grid component for displaying multiple beers
 * @param {Object} props - Component props
 * @param {Array} props.beers - Array of beer objects
 * @param {boolean} props.showLikeButton - Whether to show like buttons
 * @param {React.Component} props.likeButton - Like button component
 * @param {string} props.className - Additional CSS class name
 * @param {string} props.emptyMessage - Message to show when no beers
 */
function BeerGrid({ 
    beers = [], 
    showLikeButton = false, 
    likeButton, 
    className = "beerCellar",
    emptyMessage = "No beers found"
}) {
    if (!beers || beers.length === 0) {
        return (
            <div className={className}>
                <h1 className="noBeersMsg">{emptyMessage}</h1>
            </div>
        );
    }

    return (
        <div className={className}>
            {beers.map(beer => (
                <BeerCard
                    key={beer.id}
                    beer={beer}
                    showLikeButton={showLikeButton}
                    likeButton={likeButton}
                />
            ))}
        </div>
    );
}

export default BeerGrid;
