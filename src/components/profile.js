import React, { Component } from "react";
// import { HashRouter, Route } from "react-router-dom";
import axios from "./axios";
import {
    Transition,
    CSSTransition,
    TransitionGroup
} from "react-transition-group";
import ProfilePic from "./profilePic";
import BeerCellar from "./beerCellar";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appearChat: true
        };
        this.logout = this.logout.bind(this);
        this.delete = this.delete.bind(this);
    }

    logout() {
        axios.get("/logout").then(() => {
            location.reload();
        });
    }

    delete() {
        axios.get("/delete").then(() => {
            console.log("user deleted");
            location.reload();
        });
    }

    render() {
        return (
            <div className="profileContainer">
                <div>
                    <div className="profilePicContainer">
                        <ProfilePic
                            username={this.props.username}
                            imgurl={this.props.imgurl}
                            toggle={this.props.toggle}
                        />
                        <div className="nameProfPic nameProf">
                            {this.props.username}
                        </div>
                        <div className="nameProfPic">{this.props.age}</div>
                        <div className="nameProfPic">{this.props.city}</div>
                    </div>

                    <div className="deleteLogContainer">
                        <button onClick={this.delete} id="deleteProfButton">
                            Delete Profile
                        </button>
                        <button onClick={this.logout} id="logoutProfButton">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="beerCellarContainer">
                    <BeerCellar />
                </div>
            </div>
        );
    }
}

export default Profile;
