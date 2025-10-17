import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Wrapper from "./components/wrapperWelcome";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./components/reducers";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import { initSocket } from "./components/socket";


let Elem;

if (location.pathname == "/welcome") {
    Elem = <Wrapper />;
} else {
    initSocket(store);
    Elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(Elem, document.querySelector("main"));
