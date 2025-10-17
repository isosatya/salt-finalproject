import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./components/axios";
import Profile from "./components/profile";
import BeerProfile from "./components/beerProfile";
import Uploader from "./components/uploader";
import FindBeer from "./components/findBeer";
import Header from "./components/header";
import OtherProfile from "./components/otherProfile";
import Chatting from "./components/chatting";

// Main application component that handles routing and user state
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

    // Fetch user data when component mounts
    componentDidMount() {
        axios.get("/user").then(results => {
            this.setState(results.data[0]);
        });
    }

    // Toggle the profile picture uploader modal
    toggleUploader() {
        this.state.uploader
            ? this.setState({ uploader: false })
            : this.setState({ uploader: true });
    }

    // Handle file selection for profile picture upload
    handleFileChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    // Upload selected profile picture to server
    uploadPic() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        
        axios
            .post("/upload", formData)
            .then(resp => {
                this.setState({
                    imgurl: resp.data,
                    file: null,
                    uploader: false
                });
            })
            .catch(function(err) {
            });
    }

    // Handle bio text input changes
    handleChange(e) {
        this.setState({ bio: e.target.value });
    }

    // Submit bio update to server
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
                                            onToggleUploader={this.toggleUploader}
                                            onChange={this.handleChange}
                                            onSubmit={this.handleSubmit}
                                        />
                                    )}
                                />
                                <Route
                                    path="/beer/:id"
                                    render={props => (
                                        <BeerProfile
                                            // key={props.match.url}
                                            match={props.match}
                                            // history={props.history}
                                        />
                                    )}
                                />
                                <Route
                                    path="/beers"
                                    render={props => <FindBeer />}
                                />
                                <Route
                                    path="/user/:id"
                                    render={props => (
                                        <OtherProfile
                                            key={props.match.url}
                                            match={props.match}
                                            history={props.history}
                                        />
                                    )}
                                />
                                <Route
                                    path="/chat"
                                    render={props => <Chatting />}
                                />
                            </div>
                        </BrowserRouter>
                        {this.state.uploader && (
                            <Uploader
                                onToggle={this.toggleUploader}
                                onUpload={this.uploadPic}
                                onFileChange={this.handleFileChange}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default App;
