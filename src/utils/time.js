const timeOffset = -((new Date()).getTimezoneOffset()/60)

export const UTCToLocalTime = (timestamp) => {
	const d = new Date(0)
	d.setUTCSeconds(timestamp)
	d.setHours(d.getHours() + timeOffset)
	return d.getTime()
}