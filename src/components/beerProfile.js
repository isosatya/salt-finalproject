import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import ProfilePic from "./profilePic";
// import FriendButton from "./friendButton";

class BeerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let beerId = this.props.match.params.id;
        axios
            .get(`https://api.punkapi.com/v2/beers/1?ids=${beerId}`)
            .then(resp => {
                console.log("response from server", resp.data);
                this.setState(resp.data[0]);
            });

        // axios.get("/otheruser/" + this.props.match.params.id).then(resp => {
        // if (resp.data.error == 1) {
        //     alert("Please enter another Profile number for the search");
        //     this.props.history.push("/");
        // } else if (resp.data.error == 2) {
        //     alert("User not found!");
        //     this.props.history.push("/");
        // } else {
        //     this.setState(resp.data[0]);
        // }
        // });
    }

    render() {
        return (
            <div className="profileContainer">
                <h1>Beer Profile</h1>
                <img
                    className="profilePic"
                    src={this.state.img_url}
                    alt={this.state.name}
                />
                <p>{this.state.tagline}</p>
                <div>
                    <div>
                        <p>Alcohol %</p>
                        <p>{this.state.abv}</p>
                    </div>
                    <div>
                        <p>Bitterness Scale (0 to 100)</p>
                        <p>{this.state.ibu}</p>
                    </div>
                    <div>
                        <p>pH</p>
                        <p>{this.state.ph}</p>
                    </div>
                </div>
                <p>{this.state.name}</p>
                <div>
                    <p>{this.state.description}</p>
                    <div>
                        <p>Ingredients</p>
                        <div>
                            <p>Hops</p>
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
                            <p>Malts</p>
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
                <div>
                    <p>Food Pairing</p>
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
                                    <p>{food}</p>
                                </Link>
                            ))}
                    </div>
                </div>
                {/* <div className="profilePicContainer">
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        imgurl={this.state.imgurl}
                    />
                    <div className="nameProfPic">
                        {this.state.first} {this.state.last}
                    </div>
                </div>
                <div className="bioContainer">
                    <div className="bioText otherProfBio">
                        <p>{this.state.bio}</p>
                    </div>
                    <div>
                        <FriendButton match={this.props.match.params.id} />
                    </div>
                </div> */}
            </div>
        );
    }
}

export default BeerProfile;
