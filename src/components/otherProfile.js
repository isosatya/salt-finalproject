import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import LikeButton from "./likeButton";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    componentDidMount() {
        axios.get("/otheruser/" + this.props.match.params.id).then(resp => {
            console.log("resp.dat at user search", resp.data);

            this.setState(resp.data);
        });
    }

    componentDidUpdate(prevprops) {
        let stateArray = Object.values(this.state);

        // use this condition so it componentDidUpdate doesnt get into an infinte loop
        // using the count condition. so the if only runs once
        if (prevprops != this.props.match.params.id && this.state.count != 1) {
            let beersData = [];
            let promises = [];

            for (let i = 0; i < stateArray.length - 1; i++) {
                let beerId = stateArray[i].beer_id;

                promises.push(
                    axios.get(`https://api.punkapi.com/v2/beers/${beerId}`)
                );
            }

            Promise.all(promises).then(response => {
                // console.log("logging data after promise all", response);
                for (let i = 0; i < response.length; i++) {
                    beersData.push(response[i].data[0]);
                }
                this.setState({ beersData, count: 1 });
            });
        }
    }

    render() {
        console.log("this.state", this.state);

        return (
            <div className="profileContainer">
                {Object.keys(this.state).length >= 2 && (
                    <div>
                        <div className="profilePicContainer otherProf">
                            <img
                                className="profilePic"
                                src={
                                    this.state[0].imgurl
                                        ? this.state[0].imgurl
                                        : "./hop.png"
                                }
                                alt={this.props.username}
                            />
                            <div className="nameProfPic nameProf">
                                {this.state[0].username}
                            </div>
                            <div className="nameProfPic">
                                {this.state[0].age}
                            </div>
                            <div className="nameProfPic">
                                {this.state[0].city}
                            </div>
                        </div>
                    </div>
                )}
                <div className="beerCellarContainer">
                    <p className="beerCellarTitle">Cellar Collection</p>
                    {this.state.count ? (
                        <div className="beerCellar">
                            {this.state.beersData.map(beer => (
                                <div key={beer.id} className="beerContainer">
                                    <div className="friendsListProfContainer">
                                        <Link to={`/beer/${beer.id}`}>
                                            <div className="beerPicAndName">
                                                <img
                                                    className="beerPic"
                                                    src={
                                                        beer.image_url
                                                            ? beer.image_url
                                                            : "/beer_bottle.png"
                                                    }
                                                    alt={beer.name}
                                                />
                                                <div className="nameBeerPic">
                                                    {beer.name}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <LikeButton match={beer.id} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h1 className="noBeersMsg">No Hops Yet!</h1>
                    )}
                </div>
            </div>
        );
    }
}

export default OtherProfile;
