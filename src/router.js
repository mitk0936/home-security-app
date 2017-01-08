import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { store, history } from './store.js';
import { routerUpdate } from './actions'

import config from './config'

import App from './components/App';
import Login from './components/Login';
import DevicesList from './components/DevicesList';

const onRouterUpdate = () => store.dispatch(routerUpdate(history.getCurrentLocation()))

const router = (
	<Router history={ history } onUpdate={ onRouterUpdate }>
		<Route path={ config.paths.login } component={ App } >
			<IndexRoute component={ Login } />
			<Route path={ config.paths.devices } component={ DevicesList } />
			<Route path='*' component={ null } />
		</Route>
	</Router>
)

export { router };
