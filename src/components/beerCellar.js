import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "./axios";
import { getCellar } from "./actions";
import LikeButton from "./likeButton";
import { PUNK_API_BASE_URL, DEFAULT_BEER_IMAGE, BUTTON_UPDATE_DELAY } from "../constants";

class BeerCellar extends Component {
    componentDidMount() {
        // in function components: props.dispatch()
        this.props.dispatch(getCellar());

    }

    componentDidUpdate(prevprops) {
        if (prevprops != this.props) {
            let beersData = [];
            let promises = [];

            for (let i = 0; i < this.props.beers.length; i++) {
                let beerId = this.props.beers[i].beer_id;
                promises.push(
                    axios.get(`${PUNK_API_BASE_URL}/${beerId}`)
                );
            }
            Promise.all(promises).then(response => {
                for (let i = 0; i < response.length; i++) {
                    beersData.push(response[i].data[0]);
                }
                this.setState({ beersData });
            });
        }
    }

    render() {

        if (!this.state) {
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
                                                    : DEFAULT_BEER_IMAGE
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
                                        }, BUTTON_UPDATE_DELAY)
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

    return {
        beers: state.listBeers && state.listBeers
    };
};

export default connect(mapStateToProps)(BeerCellar);
