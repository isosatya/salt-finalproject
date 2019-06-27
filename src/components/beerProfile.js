import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LikeButton from "./likeButton";
// import ProfilePic from "./profilePic";

class BeerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let beerId = this.props.match.params.id;
        console.log("beerId", beerId);

        axios.get(`https://api.punkapi.com/v2/beers/${beerId}`).then(resp => {
            let data = resp.data[0];

            // --------------------Filtering repeated ingredients
            let arrayHops = data.ingredients.hops;
            var obj = {};
            for (var i = 0, len = arrayHops.length; i < len; i++)
                obj[arrayHops[i]["name"]] = arrayHops[i];
            arrayHops = new Array();
            for (var key in obj) arrayHops.push(obj[key]);

            let arrayMalts = data.ingredients.malt;
            var obj2 = {};
            for (i = 0, len = arrayMalts.length; i < len; i++)
                obj2[arrayMalts[i]["name"]] = arrayMalts[i];
            arrayMalts = new Array();
            for (key in obj2) arrayMalts.push(obj2[key]);
            // ---------------------------------------------

            data.ingredients.hops = arrayHops;
            data.ingredients.malt = arrayMalts;

            this.setState(data);
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
                                : "/beer_bottle.png"
                        }
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
                        <p className="tittleFoodPairing">Food Pairing</p>
                        <div>
                            {this.state.food_pairing &&
                                this.state.food_pairing.map((food, index) => (
                                    <Link
                                        to={`https://duckduckgo.com/?q=${food.replace(
                                            / /g,
                                            "+"
                                        )}&t=osx&ia=recipes`}
                                        key={index}
                                    >
                                        <p className="foodPairingItem">
                                            {food}
                                        </p>
                                    </Link>
                                ))}
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
