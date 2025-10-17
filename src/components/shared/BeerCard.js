import React from "react";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

/**
 * Reusable beer card component
 * @param {Object} props - Component props
 * @param {Object} props.beer - Beer data object
 * @param {boolean} props.showLikeButton - Whether to show the like button
 * @param {React.Component} props.likeButton - Like button component to render
 * @param {string} props.className - Additional CSS class name
 */
function BeerCard({ beer, showLikeButton = false, likeButton, className = "" }) {
    if (!beer) {
        return null;
    }

    return (
        <div className={`beerContainer ${className}`}>
            <Link to={`/beer/${beer.id}`}>
                <div className="beerPicAndName">
                    <ImageWithFallback
                        src={beer.image_url}
                        fallback="/beer_bottle.png"
                        alt={beer.name}
                        className="beerPic"
                    />
                    <div className="nameBeerPic">{beer.name}</div>
                    {beer.tagline && (
                        <p className="tagBeerPic">{beer.tagline}</p>
                    )}
                </div>
            </Link>
            {showLikeButton && likeButton && (
                <div className="friendsButtonContainer">
                    {likeButton}
                </div>
            )}
        </div>
    );
}

export default BeerCard;
