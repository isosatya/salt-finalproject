import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "axios";
import Profile from "./components/profile";
import OtherProfile from "./components/otherProfile";
import Uploader from "./components/uploader";
import FindPeople from "./components/findPeople";
import Header from "./components/header";
import FriendsList from "./components/friendsList";
import Chatting from "./components/chatting";

///////////// this one is for using HOOKS
// import { useState, useEffect } from "react";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { uploader: false };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.uploadPic = this.uploadPic.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios.get("/user").then(results => {
            this.setState(results.data[0]);
        });
    }

    toggleUploader() {
        this.state.uploader
            ? this.setState({ uploader: false })
            : this.setState({ uploader: true });
    }

    handleFileChange(e) {
        // assigning the file that was selected to this.file.state
        this.setState({ file: e.target.files[0] });
    }

    uploadPic() {
        // create the FormData object
        var formData = new FormData();
        // assign the file in this.state to the Form
        formData.append("file", this.state.file);
        // posting the new file to the backend
        axios
            .post("/upload", formData)
            .then(resp => {
                console.log("picture uploaded", resp.data);
                this.setState({
                    imgurl: resp.data,
                    file: null,
                    uploader: false
                });
            })
            .catch(function(err) {
                console.log("Error when uploading picture", err);
            });
    }

    handleChange(e) {
        this.setState({ bio: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post("/updatebio", { bio: this.state.bio });
    }

    render() {
        return (
            <div>
                {this.state.username && (
                    <div>
                        <BrowserRouter>
                            <div>
                                <Header
                                    username={this.state.username}
                                    imgurl={this.state.imgurl}
                                />
                                <Route
                                    exact
                                    path="/"
                                    render={() => (
                                        <Profile
                                            username={this.state.username}
                                            age={this.state.age}
                                            city={this.state.city}
                                            imgurl={this.state.imgurl}
                                            created_at={this.state.created_at}
                                            toggle={this.toggleUploader}
                                            handleChange={this.handleChange}
                                            handleSubmit={this.handleSubmit}
                                        />
                                    )}
                                />
                                {/* <Route
                                    path="/user/:id"
                                    render={props => (
                                        <OtherProfile
                                            key={props.match.url}
                                            match={props.match}
                                            history={props.history}
                                        />
                                    )}
                                /> */}
                                {/* <Route
                                    path="/users"
                                    render={props => <FindPeople />}
                                /> */}
                                {/* <Route
                                    path="/chat"
                                    render={props => <Chatting />}
                                /> */}
                                {/* <Route
                                    path="/friends"
                                    render={props => <FriendsList />}
                                /> */}
                            </div>
                        </BrowserRouter>
                        {this.state.uploader && (
                            <Uploader
                                toggle={this.toggleUploader}
                                upload={this.uploadPic}
                                file={this.handleFileChange}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default App;
