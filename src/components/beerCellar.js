import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { getCellar } from "./actions";
import LikeButton from "./likeButton";
import BeerGrid from "./shared/BeerGrid";

class BeerCellar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            beersData: [],
            loading: false
        };
    }

    componentDidMount() {
        this.props.dispatch(getCellar());
    }

    componentDidUpdate(prevProps) {
        if (prevProps.beers !== this.props.beers && this.props.beers) {
            this.fetchBeerData();
        }
    }

    fetchBeerData = async () => {
        if (!this.props.beers || this.props.beers.length === 0) {
            this.setState({ beersData: [] });
            return;
        }

        try {
            this.setState({ loading: true });
            
            const promises = this.props.beers.map(beer => 
                axios.get(`https://api.punkapi.com/v2/beers/${beer.beer_id}`)
            );
            
            const responses = await Promise.all(promises);
            const beersData = responses.map(response => response.data[0]);
            
            this.setState({ beersData, loading: false });
        } catch (error) {
            console.error("Error fetching beer data:", error);
            this.setState({ loading: false });
        }
    }

    render() {
        const { beersData, loading } = this.state;

        if (loading) {
            return (
                <div>
                    <p className="beerCellarTitle">Cellar Collection</p>
                    <p className="loadingMsg">Loading your cellar...</p>
                </div>
            );
        }

        return (
            <div>
                <p className="beerCellarTitle">Cellar Collection</p>
                <BeerGrid
                    beers={beersData}
                    showLikeButton={true}
                    likeButton={(beer) => (
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
                    )}
                    emptyMessage="No Hops Yet!"
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        beers: state.listBeers || []
    };
};

export default connect(mapStateToProps)(BeerCellar);
