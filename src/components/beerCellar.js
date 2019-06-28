import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "./axios";
import { getCellar } from "./actions";
import LikeButton from "./likeButton";
import { acceptFriendReq } from "./actions";
import { rejectFriendReq } from "./actions";
import { cancelFriendship } from "./actions";

class BeerCellar extends Component {
    componentDidMount() {
        // in function components: props.dispatch()
        this.props.dispatch(getCellar());

        // console.log("this.props at component did mount", this.props.beers);
    }

    componentDidUpdate(prevprops) {
        // console.log("this.props at component did update", this.props.beers);
        if (prevprops != this.props) {
            let beersData = [];
            let promises = [];

            for (let i = 0; i < this.props.beers.length; i++) {
                let beerId = this.props.beers[i].beer_id;
                promises.push(
                    axios.get(`https://api.punkapi.com/v2/beers/${beerId}`)
                );
            }
            Promise.all(promises).then(response => {
                // console.log("logging data after promise all", response);
                for (let i = 0; i < response.length; i++) {
                    beersData.push(response[i].data[0]);
                }
                // console.log("beerData", beerData);
                this.setState({ beersData });
            });
        }
    }

    render() {
        // console.log("this.props at beerCellar component", this.props.beers);
        console.log("this.state at render", this.state);

        if (!this.state) {
            console.log("this.state is empty");
            return null;
        }

        return (
            <div>
                <p className="beerCellarTitle">Cellar Collection</p>

                {this.state.beersData ? (
                    <div className="beerCellar">
                        {this.state.beersData.map(beer => (
                            <div key={beer.id} className="beerContainer">
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
                                <div
                                    className="friendsButtonContainer"
                                    onClick={() =>
                                        setTimeout(() => {
                                            this.props.dispatch(getCellar());
                                        }, 300)
                                    }
                                >
                                    <LikeButton match={beer.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h1 className="noBeersMsg">No Hops Yet!</h1>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    // console.log("state in map.StateToProps in friendsList component:", state);

    return {
        // call this property however you want --> thats the name the props will receive for this component
        // listAnimals is coming from the REDUCER file
        beers: state.listBeers && state.listBeers
    };
};

export default connect(mapStateToProps)(BeerCellar);
