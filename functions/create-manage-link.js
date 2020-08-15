const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require('./utils/fauna');

exports.handler = async (event, context) => {
	const { user } = context.clientContext;

	const query = `
    query ($netlifyID: ID!) {
      getUserByNetlifyID(netlifyID: "$netlifyID") {
        stripeID
        netlifyID
      }
  `;

	const variables = { netlifyID: user.id };

	const result = await faunaFetch({ query, variable });

	return {
		statusCode : 200,
		body       : JSON.stringify(result)
	};
};
