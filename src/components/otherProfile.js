import React, { Component } from "react";
import axios from "./axios";
import LikeButton from "./likeButton";
import BeerGrid from "./shared/BeerGrid";
import ImageWithFallback from "./shared/ImageWithFallback";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userData: null,
            beersData: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchUserData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.fetchUserData();
        }
    }

    fetchUserData = async () => {
        try {
            this.setState({ loading: true, error: null });
            
            const response = await axios.get("/otheruser/" + this.props.match.params.id);
            const userData = response.data;
            
            this.setState({ userData });
            
            // Extract beer IDs and fetch beer data
            const beerIds = userData
                .filter(item => item.beer_id)
                .map(item => item.beer_id);
            
            if (beerIds.length > 0) {
                await this.fetchBeerData(beerIds);
            } else {
                this.setState({ beersData: [], loading: false });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            this.setState({ error: "Failed to load user profile", loading: false });
        }
    }

    fetchBeerData = async (beerIds) => {
        try {
            const promises = beerIds.map(beerId =>
                axios.get(`https://api.punkapi.com/v2/beers/${beerId}`)
            );
            
            const responses = await Promise.all(promises);
            const beersData = responses.map(response => response.data[0]);
            
            this.setState({ beersData, loading: false });
        } catch (error) {
            console.error("Error fetching beer data:", error);
            this.setState({ error: "Failed to load beer data", loading: false });
        }
    }

    render() {
        const { userData, beersData, loading, error } = this.state;

        if (loading) {
            return <div className="profileContainer">Loading profile...</div>;
        }

        if (error) {
            return <div className="profileContainer">Error: {error}</div>;
        }

        if (!userData || userData.length === 0) {
            return <div className="profileContainer">User not found</div>;
        }

        const user = userData[0];

        return (
            <div className="profileContainer">
                <div className="profilePicContainer otherProf">
                    <ImageWithFallback
                        src={user.imgurl}
                        fallback="./hop.png"
                        className="profilePic"
                        alt={user.username}
                    />
                    <div className="nameProfPic nameProf">
                        {user.username}
                    </div>
                    <div className="nameProfPic">
                        {user.age}
                    </div>
                    <div className="nameProfPic">
                        {user.city}
                    </div>
                </div>
                
                <div className="beerCellarContainer">
                    <p className="beerCellarTitle">Cellar Collection</p>
                    <BeerGrid
                        beers={beersData}
                        showLikeButton={true}
                        likeButton={(beer) => <LikeButton match={beer.id} />}
                        emptyMessage="No Hops Yet!"
                    />
                </div>
            </div>
        );
    }
}

export default OtherProfile;
