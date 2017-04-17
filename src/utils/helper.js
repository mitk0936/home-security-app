export const removeByKey = (myObj, deleteKey) => {
	return Object.keys(myObj)
		.filter(key => key !== deleteKey)
		.reduce((result, current) => {
			result[current] = myObj[current];
			return result;
	}, {});
}