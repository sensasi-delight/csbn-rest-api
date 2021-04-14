const express = require('express'),
bodyParser = require('body-parser'),
swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json'),
Connector = require('./connector'),
app = express(),
fs = require('fs'),
yaml = require('js-yaml')


// read ENV file
let fileContents = fs.readFileSync('./env.yaml', 'utf8');
let ENV = yaml.safeLoad(fileContents);

console.log(ENV);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.redirect('/rest-api');
})

// helper section
function defaultErr(error, res) {
	// console.log(error);

	return res.status(500).send({
		success: "false",
		message: error.message
	});
}

function defaultSuccess(res, msg, obj) {
	return res.status(201).send({
		success: "true",
		message: msg,
		obj
	});
}

function isValid(req, res) {
	let msg = null
	let isValid = true

	const isExceptId = req.route.path === '/readAllProducts/:channelName/:orgName' ||
	req.route.path === '/readAllOrders/:channelName/:orgName' ||
	req.route.path === '/reach/:channelName/:orgName'

	if (!isExceptId && !req.params.id && !req.body.id) {
		msg = "id is required"
	}

	if (!req.params.channelName || !req.params.orgName) {
		msg = "please fills all form"
	} else if(ENV.CHANNELS.indexOf(req.params.channelName) === -1) {
		msg = "channel is unregistered"
	} else if(ENV.ORGS.indexOf(req.params.orgName) === -1) {
		msg = "org is unregistered"
	}

	if (msg) {
		isValid = false;

		res.status(400).send({
			success: "false",
			message: msg
		})
	}

	return isValid
}

// Tool Section
app.get("/reach/:channelName/:orgName", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const result = await Connector.reach(req)
		return defaultSuccess(res, 'reach test successfully', result)
	} catch (error) {
		return defaultErr(error, res)
	}

})


// Product Section
app.get("/readProduct/:channelName/:orgName/:id", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const asset = await Connector.readProduct(req)
		return defaultSuccess(res, 'product readed successfully', asset)
	} catch (error) {
		return defaultErr(error, res)
	}

})


app.post("/createProduct/:channelName/:orgName", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const asset = await Connector.createProduct(req);
		defaultSuccess(res, 'product created successfully', asset)
	} catch (error) {
		defaultErr(error, res)
	}  
});

app.put("/updateProduct/:channelName/:orgName/:id", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const asset = await Connector.updateProduct(req);
		defaultSuccess(res, 'product updated successfully', asset)
	} catch (error) {
		defaultErr(error, res)
	}  
});


//Order Section
app.get("/readShipment/:channelName/:orgName/:id", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const asset = await Connector.readShipment(req)
		return defaultSuccess(res, 'shipment readed successfully', asset)
	} catch (error) {
		return defaultErr(error, res)
	}

})

app.post("/createShipment/:channelName/:orgName", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const asset = await Connector.createShipment(req)
		defaultSuccess(res, 'shipment created successfully', asset)
	} catch (error) {
		defaultErr(error, res)
	}

});

app.put("/updateShipment/:channelName/:orgName/:id", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const asset = await Connector.updateShipment(req);
		defaultSuccess(res, 'shipment updated successfully', asset)
	} catch (error) {
		defaultErr(error, res)
	}
});

app.put("/updateShipmentLocation/:channelName/:orgName/:id", async (req, res) => {

	if (!isValid(req, res)) {
		return res
	}

	try {
		const asset = await Connector.updateShipmentLocation(req)
		defaultSuccess(res, 'shipment location updated successfully', asset)
	} catch (error) {
		defaultErr(error, res)
	}
});


app.use('/rest-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(ENV.SERVER_PORT, () => {
	console.log(`App is listening at port ${ENV.SERVER_PORT}`)
})