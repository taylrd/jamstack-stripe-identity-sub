exports.handlers = async (event) => {
	const { user } = JSON.parse(event.body);
	console.log(JSON.stringify(user, null, 2));

	return JSON.stringify({
		app_metadata : { role: [ 'sub:free' ] }
	});
};
