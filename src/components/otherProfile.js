import React, { Component } from "react";
import axios from "axios";
import ProfilePic from "./profilePic";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.log("this.props.match.params.id", this.props.match.params.id);

        axios.get("/otheruser/" + this.props.match.params.id).then(resp => {
            // console.log("response for getUserAndCellar", resp.data);

            this.setState(resp.data);
        });
    }

    componentDidUpdate(prevprops) {
        // console.log(
        //     "component did update this.state values",
        //     Object.values(this.state)
        // );

        let stateArray = Object.values(this.state);

        if (prevprops != this.state) {
            let beersData = [];
            let promises = [];

            for (let i = 0; i < stateArray.length; i++) {
                console.log("stateArray.length", stateArray.length);

                let beerId = stateArray[i].beer_id;
                console.log("beerId", beerId);

                promises.push(
                    axios.get(`https://api.punkapi.com/v2/beers/${beerId}`)
                );
            }
            Promise.all(promises).then(response => {
                // console.log("logging data after promise all", response);
                for (let i = 0; i < response.length; i++) {
                    beersData.push(response[i].data[0]);
                }
                console.log("beerData", beersData);
                this.setState({ beersData });
            });
        }
    }

    render() {
        // console.log("this.state at render", this.state);

        return (
            <React.Fragment>
                {Object.keys(this.state).length && (
                    <div className="profileContainer">
                        {/* <div className="profilePicContainer">
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
                        </div> */}
                    </div>
                )}
                {Object.keys(this.state).length && (
                    <div className="profileContainer" />
                )}
            </React.Fragment>
        );
    }
}

export default OtherProfile;
