const isRunningCordova = document.URL.indexOf( 'http://' ) === -1;

export const fireNotification = ( { message, title, buttonText }, beepsCount, vibrationTime ) => {
	beepsCount = parseInt(beepsCount, 10) || 0
	vibrationTime = parseInt(vibrationTime, 10) || 0

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

export const beep = (times) => {
	try {
		navigator.notification.beep(times)
	} catch (e) { console.error('Beep not supported.') }
}

export const vibrate = (time) => {
	try {
		navigator.notification.vibrate(time)
	} catch (e) { console.error('Vibration not supported.') }
}