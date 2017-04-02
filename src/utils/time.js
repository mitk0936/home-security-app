export const UTCToLocalTime = function (d) {
	var timeOffset = -((new Date()).getTimezoneOffset()/60);
	d.setHours(d.getHours() + timeOffset);
	return d;
}