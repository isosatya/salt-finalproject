import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { receiveFriends } from "./actions";
import { acceptFriendReq } from "./actions";
import { rejectFriendReq } from "./actions";
import { cancelFriendship } from "./actions";

class BeerCellar extends Component {
    componentDidMount() {
        // in function components: props.dispatch()
        this.props.dispatch(receiveFriends());
    }

    render() {
        // console.log(
        //     "this.props.friends in friendsList component",
        //     this.props.friends
        // );

        if (!this.props.friends) {
            console.log("this.props.friends is empty");

            return null;
        }

        return (
            <div>
                <p className="titleFriendsList">Pending Buddies</p>
                <div className="friendsPageContainer">
                    {this.props.wannabes.map(wannabe => (
                        <div key={wannabe.id}>
                            <div className="friendsListProfContainer">
                                <Link to={`/user/${wannabe.id}`}>
                                    <div className="profilePicContainer">
                                        <img
                                            className="profilePic"
                                            src={
                                                wannabe.imgurl
                                                    ? wannabe.imgurl
                                                    : "./uglydog.jpg"
                                            }
                                            alt={
                                                wannabe.first +
                                                " " +
                                                wannabe.last
                                            }
                                        />
                                        <div className="nameProfPic">
                                            {wannabe.first} {wannabe.last}
                                        </div>
                                    </div>
                                </Link>
                                <div className="friendsButtonContainer">
                                    <button
                                        className="addFriendButton friendsPageButton"
                                        onClick={e =>
                                            this.props.dispatch(
                                                rejectFriendReq(wannabe.id)
                                            )
                                        }
                                    >
                                        Reject Friend Request
                                    </button>
                                    <button
                                        className="addFriendButton friendsPageButton"
                                        onClick={e =>
                                            this.props.dispatch(
                                                acceptFriendReq(wannabe.id)
                                            )
                                        }
                                    >
                                        Accept Friend Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    // console.log("state in map.StateToProps in friendsList component:", state);

    return {
        // call this property however you want --> thats the name the props will receive for this component
        // listAnimals is coming from the REDUCER file
        friends:
            state.listFriends &&
            state.listFriends.filter(friend => friend.accepted === true),

        wannabes:
            state.listFriends &&
            state.listFriends.filter(wannabe => wannabe.accepted === false)
    };
};

export default connect(mapStateToProps)(BeerCellar);
