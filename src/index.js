import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import { router } from "./router.js";

const render = () => {
	ReactDOM.render(
		<Provider store={store}>
			{router}
		</Provider>,
		document.getElementById('app')
	)
}

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
	document.addEventListener("deviceready", render, false);
} else {
	render()
}
