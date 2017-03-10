import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import { store, history } from './store.js'
import { routerUpdate } from './actions'

import config from './config'

import App from './containers/App'
import Login from './containers/Login'
import DevicesList from './containers/DevicesList'

const onRouteEnter = (path, replace) => {
	const userLogged = store.getState().user.logged

	switch (path.location.pathname) {
		case config.paths.login: 	return ( userLogged && replace(config.paths.devices) )
		case config.paths.devices: 	return ( !userLogged && replace(config.paths.login) )
		default: 					return ( replace(config.paths.login) )
	}
}

const router = (
	<Router history={ history }>
		<Route path={ config.paths.login } component={ App } >
			<IndexRoute
				component={ Login }
				onEnter={ onRouteEnter } />
			<Route
				path={ config.paths.devices }
				component={ DevicesList }
				onEnter={ onRouteEnter } />
			<Route
				path='*'
				component={ null }
				onEnter={ onRouteEnter } />
		</Route>
	</Router>
)

export { router }