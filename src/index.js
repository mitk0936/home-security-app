import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import { router } from "./router.js";

/*
	A function to render the whole application,
	via ReactDOM.render
*/
const render = () => {
	ReactDOM.render(
		<Provider store={store}>
			{ router }
		</Provider>,
		document.getElementById('app')
	)
}

/* Detects if the application is runnging inside Cordova */
const isRunningCordova = document.URL.indexOf( 'http' ) === -1;

if (isRunningCordova) {
	/* waiting for the deviceready event inside Cordova App */
	document.addEventListener("deviceready", render, false);
} else {
	render()
}
