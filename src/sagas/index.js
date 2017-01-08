import { fork } from "redux-saga/effects";

import { connect } from "./mqtt";
import { navigate, redirect } from "./routing";

export function* sagas() {
	yield [
		fork(connect),
		fork(navigate),
		fork(redirect)
	];
}
