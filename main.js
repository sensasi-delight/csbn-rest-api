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
  console.log(error);

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

// app.get("/readAllProducts/:channelName/:orgName", async (req, res) => {

//   if (!isValid(req, res)) {
//     return res
//   }

//   try {
//     const products = await Connector.readAllProducts(req)
//     defaultSuccess(res, 'products readed successfully', products)
//   } catch (error) {
//     defaultErr(error, res)
//   }

// })

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

app.put("/updateProduct/:channelName/:orgName", async (req, res) => {

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
app.get("/readShip/:channelName/:orgName/:id", async (req, res) => {

  if (!isValid(req, res)) {
    return res
  }

  try {
    const asset = await Connector.readShip(req)
    return defaultSuccess(res, 'shipment readed successfully', asset)
  } catch (error) {
    return defaultErr(error, res)
  }

})

// app.get("/readAllOrders/:channelName/:orgName", async (req, res) => {

//   if (!isValid(req, res)) {
//     return res
//   }

//   try {
//     const orders = await Connector.readAllOrders(req)
//     defaultSuccess(res, 'orders readed successfully', orders)
//   } catch (error) {
//     defaultErr(error, res)
//   }

// })

app.post("/createShip/:channelName/:orgName", async (req, res) => {

  if (!isValid(req, res)) {
    return res
  }

  try {
    const asset = await Connector.createShip(req)
    defaultSuccess(res, 'shipment created successfully', asset)
  } catch (error) {
    defaultErr(error, res)
  }

});

app.put("/updateShip/:channelName/:orgName/:id", async (req, res) => {

  if (!isValid(req, res)) {
    return res
  }

  try {
    const asset = await Connector.updateShip(req);
    defaultSuccess(res, 'shipment updated successfully', asset)
  } catch (error) {
    defaultErr(error, res)
  }
});

app.put("/updateShipLocation/:channelName/:orgName/:id", async (req, res) => {

  if (!isValid(req, res)) {
    return res
  }

  try {
    const asset = await Connector.updateShipLocation(req)
    defaultSuccess(res, 'shipment location updated successfully', asset)
  } catch (error) {
    defaultErr(error, res)
  }
});


app.use('/rest-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(ENV.SERVER_PORT, () => {
  console.log(`App is listening at http://localhost:${ENV.SERVER_PORT}`)
})