import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import Welcome_logo from "./welcome_logo";
import Registration from "./registration";
import Login from "./login";
import Popup from "./popup";

class Wrapper extends Component {
    constructor() {
        super();
        this.state = { popup: false };
        this.handleChange = this.handleChange.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ popup: true });
        }, 1000);
    }

    handleChange(e) {
        this.state[e.target.name]
            ? this.setState({ [e.target.name]: false })
            : this.setState({ [e.target.name]: true });
    }

    hidePopup() {
        if (this.state.checkbox1 && this.state.checkbox2) {
            this.setState({ popup: false });
        } else {
            this.setState({ warning: true });
        }
    }

    render() {
        return (
            <div className="wrapperCont">
                <div className="wrapperLogo">
                    <Welcome_logo />
                </div>
                <div className="registLoginMasks">
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                        </div>
                    </HashRouter>
                </div>
                {/* <Popup
                    popup={this.state.popup}
                    warning={this.state.warning}
                    handleChange={this.handleChange}
                    hidePopup={this.hidePopup}
                /> */}
            </div>
        );
    }
}

export default Wrapper;
