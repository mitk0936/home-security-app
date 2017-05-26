import { createStore, applyMiddleware, compose } from "redux"
import { browserHistory } from "react-router"
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux"
import createSagaMiddleware from "redux-saga"
import freeze from "redux-freeze"
import { reducers } from "./reducers/index"
import { sagas } from "./middleware/main"

// add the middlewares
let middlewares = []

// add the router middleware
middlewares.push(routerMiddleware(browserHistory))

// add the saga middleware
const sagaMiddleware = createSagaMiddleware()
middlewares.push(sagaMiddleware)

// add the freeze dev middleware
if (process.env.NODE_ENV !== 'production') {
	middlewares.push(freeze)
}

// apply the middleware
let middleware = applyMiddleware(...middlewares)

// add the redux dev tools
if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
	middleware = compose(middleware, window.devToolsExtension())
}

let localStoredUserData = {}

try {
	localStoredUserData = JSON.parse(window.localStorage.userCachedData)
} catch (e) {
	console.warn('Cannot get cached data from local storage.')
}

// create the store
const store = createStore(reducers, {
	userCachedData: {
		username: localStoredUserData.username || '',
		broker: localStoredUserData.broker || '',
		port: localStoredUserData.port || ''
	}
}, middleware)

const history = syncHistoryWithStore(browserHistory, store)
sagaMiddleware.run(sagas)

export { store, history }
