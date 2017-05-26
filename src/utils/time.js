export const UTCToLocalTime = (timestamp) => {
	/* Take the offset of the current timezone in hours */
	const hoursTimeOffset = -((new Date()).getTimezoneOffset()/60)

	const convertedDate = new Date(0)
	convertedDate.setUTCSeconds(timestamp)
	/* adding the offset to the UTC timestamp */
	convertedDate.setHours(convertedDate.getHours() + hoursTimeOffset)
	return convertedDate.getTime()
}