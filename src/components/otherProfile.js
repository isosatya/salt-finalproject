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
        console.log("this.state at render", this.state);
        console.log("this.props at render", this.props);

        return (
            <React.Fragment>
                {Object.keys(this.state).length == 2 && (
                    <div className="profileContainer">
                        <div className="profilePicContainer">
                            <img
                                className="profilePic"
                                src={
                                    this.state[0].imgurl
                                        ? this.state[0].imgurl
                                        : "./hop.png"
                                }
                                alt={this.props.username}
                            />
                            <div className="nameProfPic">
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
                {this.state.count && (
                    <div className="beerCellarContainer">
                        {this.state.beersData.map(beer => (
                            <div key={beer.id}>
                                <div className="friendsListProfContainer">
                                    <Link to={`/beer/${beer.id}`}>
                                        <div className="profilePicContainer">
                                            <img
                                                className="profilePic"
                                                src={
                                                    beer.image_url
                                                        ? beer.image_url
                                                        : "./uglydog.jpg"
                                                }
                                                alt={beer.name}
                                            />
                                            <div className="nameProfPic">
                                                {beer.name}
                                            </div>
                                        </div>
                                    </Link>

                                    <LikeButton match={beer.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default OtherProfile;
