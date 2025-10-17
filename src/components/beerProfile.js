import React from "react";
import { Link } from "react-router-dom";
import LikeButton from "./likeButton";
import useBeerData from "../hooks/useBeerData";
import ImageWithFallback from "./shared/ImageWithFallback";

function BeerProfile({ match }) {
    const { beer, loading, error } = useBeerData(match.params.id);

    if (loading) {
        return <div className="beerProfileContainer">Loading...</div>;
    }

    if (error || !beer) {
        return <div className="beerProfileContainer">Error: {error || "Beer not found"}</div>;
    }

    return (
        <div className="beerProfileContainer">
            <div className="ingredientsContainer">
                <p className="ingredientsTitle">Ingredients</p>
                <div className="beerIngredients">
                    <div>
                        <h3>Hops</h3>
                        {beer.ingredients && beer.ingredients.hops && (
                            <div>
                                {beer.ingredients.hops.map((hop, index) => (
                                    <p key={index}>{hop.name}</p>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3>Malts</h3>
                        {beer.ingredients && beer.ingredients.malt && (
                            <div>
                                {beer.ingredients.malt.map((malt, index) => (
                                    <p key={index}>{malt.name}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="beerOverview">
                <ImageWithFallback
                    src={beer.image_url}
                    fallback="/beer_bottle.png"
                    className="beerProfPic"
                    alt={beer.name}
                />
                <p className="tagBeerProf">{beer.tagline}</p>
            </div>

            <div className="beerDescription">
                <p className="nameBeerProfBeer">{beer.name}</p>
                <div>
                    <p className="beerDescText">{beer.description}</p>
                </div>
                <div className="beerCharact">
                    <div className="beerAttibute">
                        <p>Alcohol %</p>
                        <p className="beerCharactScale">{beer.abv}</p>
                    </div>
                    <div className="beerAttibute">
                        <p>Bitterness Scale (0/100)</p>
                        <p className="beerCharactScale">{beer.ibu}</p>
                    </div>
                    <div className="beerAttibute">
                        <p>pH</p>
                        <p className="beerCharactScale">{beer.ph}</p>
                    </div>
                </div>
                <div className="foodPairing">
                    <div className="foodPairingInside">
                        <p className="tittleFoodPairing">Food Pairing</p>
                        <div className="foodPairingItemContainer">
                            {beer.food_pairing &&
                                beer.food_pairing.map((food, index) => (
                                    <a
                                        href={`https://duckduckgo.com/?q=${food.replace(
                                            / /g,
                                            "+"
                                        )}&t=osx&ia=recipes`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={index}
                                        className="foodPairingItem"
                                    >
                                        {food}
                                    </a>
                                ))}
                        </div>
                    </div>
                    <div className="beerButtonProf">
                        <LikeButton match={match.params.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BeerProfile;
