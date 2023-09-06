import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import store from "./store/store";
import { Provider} from "react-redux";

import App from './App';
import * as serviceWorker from './serviceWorker';

import './App.css'
import 'decentraland-ui/lib/styles.css'
import 'decentraland-ui/lib/dark-theme.css'
const history = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
