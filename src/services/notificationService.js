import { notify } from 'react-notify-toast'
import { toastBrowserStyles } from '../utils/defaultGraphicsOptions'

notify.show = notify.createShowQueue()

/*
	Opens an alert message with OK button,
	to show a mesage
*/
export const fireNotification = ( { message, title, buttonText }, beepsCount, vibrationTime ) => {
	beepsCount = parseInt(beepsCount, 10) || 0
	vibrationTime = parseInt(vibrationTime, 10) || 0

	/* Calling beep and vibrate, if the params are passed */
	beepsCount && beep(beepsCount)
	vibrationTime && vibrate(vibrationTime)

	return new Promise ((resolve, reject) => {
		try {
			navigator.notification.alert(message, function () {
				resolve()
			}, title, buttonText)
		} catch (e) {
			/* Fallback to browser alert */
			alert(message)
			resolve()
		}
	})
}

/*
	Fires a beep notification on the device
*/
export const beep = (times) => {
	try {
		navigator.notification.beep(times)
	} catch (e) {
		console.error('Beep not supported.')
	}
}

/*
	Calls the device vibration for the specified amount of time
*/
export const vibrate = (time) => {
	try {
		navigator.notification.vibrate(time)
	} catch (e) {
		console.error('Vibration not supported.')
	}
}

/*
	Opens a toast message
*/
export const fireAToast = (message) => {
	try {
		window.plugins.toast.showLongBottom(message)
	} catch (e) {
		/* Fallback to browser toast message */
		notify.show(message, "custom", 7000, toastBrowserStyles)
	}
}

window.fireAToast = fireAToast