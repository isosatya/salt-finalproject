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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        // update the state based on change in input field
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name == "city") {
            console.log("about to make city search");
        }
    }

    handleSubmit(e) {
        // no submission needed because axios does the job instead
        e.preventDefault();
        console.log("this.state", this.state);

        axios
            .post("/register", {
                username: this.state.username,
                age: this.state.age,
                city: this.state.city,
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
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="formElement">
                    <label className="label">Age</label>
                    <input
                        name="age"
                        type="number"
                        min="18"
                        required="required"
                        className="formField"
                        value={this.state.age}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="formElement">
                    <label className="label">City</label>
                    <input
                        name="city"
                        required="required"
                        className="formField"
                        value={this.state.city}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="formElement">
                    <label className="label">e-Mail</label>
                    <input
                        type="email"
                        name="email"
                        required="required"
                        className="formField"
                        value={this.state.email}
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
                        value={this.state.password}
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
