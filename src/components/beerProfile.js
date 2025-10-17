import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import LikeButton from "./likeButton";
import { PUNK_API_BASE_URL, DEFAULT_BEER_IMAGE } from "../constants";
import { filterBeerIngredients } from "../utils/ingredients";

class BeerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let beerId = this.props.match.params.id;

        axios.get(`${PUNK_API_BASE_URL}/${beerId}`).then(resp => {
            let data = resp.data[0];
            const filteredData = filterBeerIngredients(data);
            this.setState(filteredData);
        });
    }

    render() {
        return (
            <div className="beerProfileContainer">
                <div className="ingredientsContainer">
                    <p className="ingredientsTitle">Ingredients</p>
                    <div className="beerIngredients">
                        <div>
                            <h3>Hops</h3>
                            {this.state.ingredients && (
                                <div>
                                    {this.state.ingredients.hops.map(
                                        (hop, index) => (
                                            <p key={index}>{hop.name}</p>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3>Malts</h3>
                            {this.state.ingredients && (
                                <div>
                                    {this.state.ingredients.malt.map(
                                        (malt, index) => (
                                            <p key={index}>{malt.name}</p>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="beerOverview">
                    <img
                        src={
                            this.state.image_url
                                ? this.state.image_url
                                : DEFAULT_BEER_IMAGE
                        }
                        className="beerProfPic"
                        alt={this.state.name}
                    />
                    <p className="tagBeerProf">{this.state.tagline}</p>
                </div>

                <div className="beerDescription">
                    <p className="nameBeerProfBeer">{this.state.name}</p>
                    <div>
                        <p className="beerDescText">{this.state.description}</p>
                    </div>
                    <div className="beerCharact">
                        <div className="beerAttibute">
                            <p>Alcohol %</p>
                            <p className="beerCharactScale">{this.state.abv}</p>
                        </div>
                        <div className="beerAttibute">
                            <p>Bitterness Scale (0/100)</p>
                            <p className="beerCharactScale">{this.state.ibu}</p>
                        </div>
                        <div className="beerAttibute">
                            <p>pH</p>
                            <p className="beerCharactScale">{this.state.ph}</p>
                        </div>
                    </div>
                    <div className="foodPairing">
                        <div className="foodPairingInside">
                            <p className="tittleFoodPairing">Food Pairing</p>
                            <div className="foodPairingItemContainer">
                                {this.state.food_pairing &&
                                    this.state.food_pairing.map(
                                        (food, index) => (
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
                                        )
                                    )}
                            </div>
                        </div>
                        <div className="beerButtonProf">
                            <LikeButton match={this.props.match.params.id} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BeerProfile;
