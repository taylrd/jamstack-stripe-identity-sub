const fetch = require('node-fetch');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
	const { user } = JSON.parse(event.body);

	//Create a Stripe customer object
	const customer = await stripe.customers.create({ email: user.email });

	await stripe.subscriptions.create({
		customer : customer.id,
		items    : [ { price: 'price_1HGOFyIcj9StUsGylelAOwcw' } ]
	});

	const netlifyID = user.id;
	const stripeID = customer.id;

	//Create a customer record in Fauna
	const response = await fetch('https://graphql.fauna.com/graphql', {
		method  : 'Post',
		headers : {
			Authorization : `Bearer ${process.env.FAUNA_SERVER_KEY}`
		},
		body    : JSON.stringify({
			query     : `
        mutation ($netlifyID: ID! $stripeID: ID!) {
          createUser(data: { netlifyID: $netlifyID, stripeID: $stripeID}) {
            netlifyID
            stripeID
          }
        }
      `,
			variables : {
				netlifyID,
				stripeID
			}
		})
	})
		.then((res) => res.json())
		.catch((err) => console.error(JSON.stringify(err, null, 2)));

	console.log({ response });

	return {
		statusCode : 200,
		body       : JSON.stringify({ app_metadata: { roles: [ 'sub:free' ] } })
	};
};
