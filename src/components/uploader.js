import React, { Component } from "react";

class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="overlay">
                <div className="boxUploader">
                    <p id="closeUploader" onClick={this.props.onToggle}>
                        X
                    </p>
                    <h3>Fancy changing your profile picture?</h3>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={this.props.onFileChange}
                    />
                    <button onClick={this.props.onUpload}>Upload</button>
                </div>
            </div>
        );
    }
}

export default Uploader;
