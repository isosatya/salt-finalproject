import React, { Component } from "react";

class Popup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="wrapperCont">
                {this.props.popup && (
                    <div className="overlay">
                        <div className="boxUploader">
                            <h3>Accept Cookies and Confirm Age</h3>
                            <div>
                                <input
                                    type="checkbox"
                                    name="checkbox1"
                                    onChange={this.props.handleChange}
                                />
                                <p>
                                    Please confirm that you accept our Cookies
                                    Policy
                                </p>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    name="checkbox2"
                                    onChange={this.props.handleChange}
                                />
                                <p>
                                    Please confirm that you are over the age of
                                    18
                                </p>
                            </div>
                            <button onClick={this.props.hidePopup}>
                                Accept
                            </button>
                            {this.props.warning && (
                                <p>
                                    You need to accept both requirements to
                                    continue
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Popup;
