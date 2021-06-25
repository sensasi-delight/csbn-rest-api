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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

app.get('/', (req, res) => {
	res.redirect('/rest-api');
})

// helper section
function defaultErr(error, res) {
	return res.status(500).send({
		success: false,
		message: error.message
	});
}

function defaultSuccess(res, msg, obj) {
	return res.status(200).send({
		success: true,
		message: msg,
		data: obj
	});
}

async function defaultHandler(req, res, mode, type) {
	if (!isValid(req, res)) {
		return res
	}

	try {
		let result;

		switch(mode) {
			case 'create':
				result = await Connector.createAsset(req, type)
		    	break;
		    case 'read':
				result = await Connector.readAsset(req, type)
		    	break;
		  	case 'update':
				result = await Connector.updateAsset(req, type)
		}



		return defaultSuccess(res, mode + ' ' + type + ' is success', result)

	} catch (error) {
		return defaultErr(error, res)
	}
}

function isValid(req, res) {
	let msg = null
	let isValid = true

	const isExceptId = 
	req.route.path === '/reach/:channelName/:orgName' ||
	req.route.path === '/readProducts/:channelName/:orgName' ||
	req.route.path === '/readInvoices/:channelName/:orgName'

	
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
	defaultHandler(req, res, 'read', 'Product')
})

app.get("/readProducts/:channelName/:orgName", async (req, res) => {
	defaultHandler(req, res, 'read', 'Products')
})


app.post("/createProduct/:channelName/:orgName", async (req, res) => {
	defaultHandler(req, res, 'create', 'Product')  
});

app.put("/updateProduct/:channelName/:orgName/:id", async (req, res) => {
	defaultHandler(req, res, 'update', 'Product')
});


// Batch Section
app.get("/readBatch/:channelName/:orgName/:id", async (req, res) => {
	defaultHandler(req, res, 'read', 'Batch')
})

app.post("/createBatch/:channelName/:orgName", async (req, res) => {
	defaultHandler(req, res, 'create', 'Batch')  
});

app.put("/updateBatch/:channelName/:orgName/:id", async (req, res) => {
	defaultHandler(req, res, 'update', 'Batch')
});


// Invoice Section
app.get("/readInvoice/:channelName/:orgName/:id", async (req, res) => {
	defaultHandler(req, res, 'read', 'Invoice')
})

app.post("/createInvoice/:channelName/:orgName", async (req, res) => {
	defaultHandler(req, res, 'create', 'Invoice')  
});

app.put("/updateInvoice/:channelName/:orgName/:id", async (req, res) => {
	defaultHandler(req, res, 'update', 'Invoice')
});

app.get("/readInvoices/:channelName/:orgName", async (req, res) => {
	defaultHandler(req, res, 'read', 'Invoices')
});



//Shipment Section
app.get("/readShipment/:channelName/:orgName/:id", async (req, res) => {
	defaultHandler(req, res, 'read', 'Shipment')
})

app.post("/createShipment/:channelName/:orgName", async (req, res) => {
	defaultHandler(req, res, 'create', 'Shipment')
});

app.put("/updateShipment/:channelName/:orgName/:id", async (req, res) => {
	defaultHandler(req, res, 'update', 'Shipment')
});


app.use('/rest-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(ENV.SERVER_PORT, () => {
	console.log(`App is listening at port ${ENV.SERVER_PORT}`)
})