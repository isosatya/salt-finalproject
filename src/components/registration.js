import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { functionDeclaration } from "@babel/types";

class Registration extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            age: 0,
            city: "",
            email: "",
            password: "",
            error: ""
        };
        this.cityRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.copyMatch = this.copyMatch.bind(this);
    }

    componentDidUpdate() {
        // console.log("this.state.city", this.state.city);
        // console.log("this.state.matches", this.state.matches);

        if (this.state.city) {
            let results = [];
            console.log("doing the search");

            axios
                .get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${
                        this.state.city
                    }.json?access_token=pk.eyJ1IjoiYW5kcmVzc2luZ2giLCJhIjoiY2p4OTBvYXc5MHF5eDN6bzFjcmptajJpcSJ9.5Tol6P4vdEEbHtgyOzZcQw&country=DE&types=region,place`
                )
                .then(response => {
                    if (response.data.features.length) {
                        for (
                            var i = 0;
                            i < response.data.features.length;
                            i++
                        ) {
                            results[i] = response.data.features[i].place_name;
                        }
                        this.setState({ matches: results, city: null });
                    }
                })
                .catch(err => {
                    console.log("error at the search get route", err);
                });
        }
    }

    handleChange(e) {
        // update the state based on change in input field
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        // no submission needed because axios does the job instead
        e.preventDefault();
        console.log("this.state", this.state);
        console.log("this.cityRef.current.value", this.cityRef.current.value);

        axios
            .post("/register", {
                username: this.state.username,
                age: this.state.age,
                city: this.cityRef.current.value,
                email: this.state.email,
                password: this.state.password
            })
            .then(results => {
                if (results.data.error == 23505) {
                    this.setState({
                        error: "e-Mail already registered!"
                    });
                } else if (results.data.error) {
                    this.setState({
                        error: "Something went wrong, please try again!"
                    });
                } else if (results.data.userId) {
                    location.href = "/";
                }
            })
            .catch(function(err) {
                console.log("Error for post route /register", err);
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="formBody">
                <div className="formElement">
                    <label className="label">Username</label>
                    <input
                        name="username"
                        required="required"
                        className="formField"
                        // value={this.state.username}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="formElement">
                    <label className="label">Age</label>
                    <input
                        name="age"
                        type="number"
                        min="18"
                        max="99"
                        required="required"
                        className="formField"
                        // value={this.state.age}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="formElement">
                    <label className="label">City</label>
                    <input
                        name="city"
                        required="required"
                        className="formField"
                        ref={this.cityRef}
                        onChange={this.handleChange}
                    />
                </div>
                {this.state.matches && this.cityRef.current.value && (
                    <div className="searchMatches">
                        {this.state.matches.map((match, index) => {
                            return (
                                <p
                                    key={index}
                                    onClick={() => {
                                        this.cityRef.current.value = match.slice(
                                            0,
                                            match.indexOf(",")
                                        );
                                        this.setState({
                                            matches: null,
                                            city: null
                                        });
                                        // console.log("this.state", this.state);
                                    }}
                                >
                                    {match}
                                </p>
                            );
                        })}
                    </div>
                )}

                <div className="formElement">
                    <label className="label">e-Mail</label>
                    <input
                        type="email"
                        name="email"
                        required="required"
                        className="formField"
                        // value={this.state.email}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="formElement">
                    <label className="label">Password</label>
                    <input
                        // type="password"
                        name="password"
                        required="required"
                        className="formField"
                        // value={this.state.password}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="buttonContainer">
                    <p className="errorMsg">{this.state.error}</p>
                    <button type="submit" className="submitButton">
                        Submit
                    </button>
                    <Link to="/login" className="loginLink">
                        Login!
                    </Link>
                </div>
            </form>
        );
    }
}

export default Registration;
