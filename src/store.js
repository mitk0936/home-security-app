import { createStore, applyMiddleware, compose } from "redux"
import { browserHistory } from "react-router"
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux"
import createSagaMiddleware from "redux-saga"
import freeze from "redux-freeze"
import { reducers } from "./reducers/index"
import { sagas } from "./middleware/index"

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


let userCachedData

try {
	userCachedData = JSON.parse(window.localStorage.userCachedData)
} catch (e) {
	userCachedData = {}
}

// create the store
const store = createStore(reducers, {
	userCachedData: {
		username: userCachedData.username || '',
		broker: userCachedData.broker || '',
		port: userCachedData.port || ''
	}
}, middleware)

const history = syncHistoryWithStore(browserHistory, store)
sagaMiddleware.run(sagas)

export { store, history }
