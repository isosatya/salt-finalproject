import React, { Component } from "react";
import axios from "axios";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios.get("/otheruser/" + this.props.match.params.id).then(resp => {
            if (resp.data.error == 1) {
                alert("Please enter another Profile number for the search");
                this.props.history.push("/");
            } else if (resp.data.error == 2) {
                alert("User not found!");
                this.props.history.push("/");
            } else {
                this.setState(resp.data[0]);
            }
        });
    }

    render() {
        return (
            <div>
                <div>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        imgurl={this.state.imgurl}
                    />
                </div>
                <div>
                    {this.state.first} {this.state.last}
                </div>
                <div>
                    <p>{this.state.bio}</p>
                </div>
            </div>
        );
    }
}

export default OtherProfile;
