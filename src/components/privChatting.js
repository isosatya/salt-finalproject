import React, { Component } from "react";
import { connect } from "react-redux";
///////////////////////// For the Socket events to work
import { socket } from "./socket";

//////////////////////////////////

class PrivChatting extends Component {
    constructor() {
        super();
        this.state = { chat: "" };
        this.chattext = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.submitChat = this.submitChat.bind(this);
    }

    handleChange(e) {
        this.setState({ chat: e.target.value });
        // console.log("this.state.chat", this.state.chat);
    }

    submitChat() {
        if (this.chattext.current.value != "") {
            socket.emit("privateChatMessage", this.state.chat);
            this.chattext.current.value = "";
        }
    }

    render() {
        // console.log("this.props at render", this.props.priv_chats);

        if (!this.props.priv_chats) {
            // console.log("private this.props.priv_chats is null");

            return (
                <div>
                    <p className="noChatMsg">Private Chats</p>
                </div>
            );
        }

        // console.log("this.props at private chatting", this.props);

        return (
            <div className="privChatWindow">
                {this.props.priv_chats && (
                    <div>
                        {this.props.priv_chats.map(chat => (
                            <div key={chat.id} className="privChatCont">
                                <div className="chatPicName">
                                    <img
                                        className="chatProfilePic"
                                        src={
                                            chat.imgurl
                                                ? chat.imgurl
                                                : "./uglydog.jpg"
                                        }
                                        alt={chat.username}
                                    />
                                    <p className="chatName">{chat.username}</p>
                                </div>
                                <div>
                                    <p className="chatText">{chat.text}</p>
                                    <p className="chatDate">
                                        {chat.created_at}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {this.props.priv_chats.length == 0 && (
                    <div>
                        <p className="noChatMsg">No Chats Yet...</p>
                    </div>
                )}

                <div className="chatInput">
                    <textarea
                        rows="3"
                        cols="25"
                        defaultValue={this.props.chat}
                        ref={this.chattext}
                        onChange={e => this.handleChange(e)}
                        className="chatTextArea"
                    />
                    <div>
                        <button
                            onClick={this.submitChat}
                            className="chatSendButton"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        priv_chats: state.priv_chats
    };
};

export default connect(mapStateToProps)(PrivChatting);
