import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
///////////////////////// For the Socket events to work
import { socket } from "./socket";
import PrivChatting from "./privChatting";

//////////////////////////////////

class Chatting extends Component {
    constructor() {
        super();
        this.state = { chat: "" };
        this.chattext = React.createRef();
        this.chatwindow = React.createRef();
        this.chatwindow2 = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.submitChat = this.submitChat.bind(this);
    }
    componentDidMount() {
        if (this.chatwindow.current) {
            this.chatwindow.current.scrollTop =
                this.chatwindow.current.scrollHeight -
                this.chatwindow.current.clientHeight;
        }
    }

    componentDidUpdate() {
        if (this.chatwindow.current) {
            this.chatwindow.current.scrollTop =
                this.chatwindow.current.scrollHeight -
                this.chatwindow.current.clientHeight;
        }
    }

    handleChange(e) {
        this.setState({ chat: e.target.value });
    }

    submitChat() {
        if (this.chattext.current.value != "") {
            socket.emit("chatMessage", this.state.chat);
            this.chattext.current.value = "";
        }
    }

    render() {
        if (!this.props.chats) {
            return null;
        }

        return (
            <div className="chatsContainer">
                <div
                    className="onlineUsers"
                    // onClick={e => console.log("e.target user", e.target)}
                >
                    {this.props.cities && (
                        <div>
                            <button
                                className="addFriendButton"
                                onClick={() => {
                                    socket.emit("refreshChats");
                                }}
                            >
                                All cities
                            </button>
                            {this.props.cities.map((city, index) => (
                                <button
                                    className="addFriendButton"
                                    key={index}
                                    onClick={() => {
                                        socket.emit("chatByCity", city.city);
                                    }}
                                >
                                    {city.city}
                                </button>
                            ))}
                        </div>
                    )}
                    <h1 className="onlineTitle">Mobsters Online</h1>
                    {this.props.users && (
                        <div>
                            {this.props.users.map(user => (
                                <div
                                    key={user.id}
                                    className="onlineUser"
                                    onClick={() => {
                                        socket.emit("privateChatUser", user.id);
                                    }}
                                >
                                    <div className="dot">
                                        <img
                                            className="onlineProfilePic"
                                            src={
                                                user.imgurl
                                                    ? user.imgurl
                                                    : "./hop.png"
                                            }
                                            alt={user.username}
                                        />
                                    </div>
                                    <div>
                                        <p className="onlineName">
                                            {user.username}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="chatWindow" ref={this.chatwindow}>
                    {this.props.chats && (
                        <div className="chatWindow2">
                            {this.props.chats.map(chat => (
                                <div key={chat.id}>
                                    <div className="chatPicName">
                                        <Link to={`/user/${chat.userid}`}>
                                            <img
                                                className="chatProfilePic"
                                                src={
                                                    chat.imgurl
                                                        ? chat.imgurl
                                                        : "./uglydog.jpg"
                                                }
                                                alt={chat.username}
                                            />
                                        </Link>
                                        <p className="chatName">
                                            {chat.username}
                                        </p>
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
                    <div className="chatInput">
                        <textarea
                            rows="3"
                            cols="25"
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
                <div className="privChats" ref={this.chatwindow2}>
                    <PrivChatting />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        chats: state.chats,
        users: state.onlineusers,
        cities: state.listCities
    };
};

export default connect(mapStateToProps)(Chatting);
