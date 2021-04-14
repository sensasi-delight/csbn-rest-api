const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const ENV = yaml.safeLoad(fs.readFileSync('env.yaml', 'utf8'));

const gateway = new Gateway();
const userName = 'swaggerApp';
const contractName = ENV.CHAINCODE_NAME;

const connect = async (channelName, orgName) => {
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('wallet');

    // Load connection profile; will be used to locate a gateway
    const connectionProfile = yaml.safeLoad(fs.readFileSync(ENV.NETWORK_PATH + '/organizations/peerOrganizations/' + orgName + '.' + ENV.NETWORK + '/connection-profile.yaml', 'utf8'));

    // Set connection options; identity and wallet
    const connectionOptions = {
        identity: userName + '-' + orgName,
        wallet: wallet,
        discovery: { enabled: true, asLocalhost: true }
    };

    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork(channelName);
    const contract = await network.getContract(contractName);

    return contract;
}

const disconnect = () => {
    gateway.disconnect();

    return false;
}

async function readAsset(contract, type, id, orgName=null) {
    let read = {};

    if (type == 'Shipment') {
        read = await contract.evaluateTransaction('readShipment', id);
    } else if (type == 'Product') {
        read = await contract.evaluateTransaction('readProduct', id, orgName);
    }

    let result = JSON.parse(read.toString('utf8'));

    if (type == 'Shipment') {
        result.productsState = JSON.parse(result.productsState);
        result.items = JSON.parse(result.items);
    } else if (type == 'Product') {
        result.ingredients = JSON.parse(result.ingredients);
    }

    return result;
}

const reach = async (req) => {
    const {channelName, orgName} = req.params;

    contract = await connect(channelName, orgName)
    const result = await contract.evaluateTransaction('reach')

    disconnect()

    return result.toString('utf8')
}


const readProduct = async (req) => {
    const {channelName, orgName, id} = req.params;

    contract = await connect(channelName, orgName)
    const result = await readAsset(contract, 'Product', id, orgName)
    disconnect()

    return result
}

const createProduct = async (req) => {
    const {channelName, orgName} = req.params;
    const {id, name, ingredients, halalCertificate, manufacturer} = req.body

    const contract = await connect(channelName, orgName)

    await contract.submitTransaction(
        'createProduct',
        id, name, JSON.stringify(ingredients), halalCertificate, manufacturer, orgName
    );

    const result = await readAsset(contract, 'Product', id, orgName)


    disconnect();
    return result;
}

const updateProduct = async (req) => {
    const {id, channelName, orgName} = req.params
    const {name, ingredients, halalCertificate, manufacturer} = req.body

    const contract = await connect(channelName, orgName)

    await contract.submitTransaction(
        'updateProduct',
        id, name, JSON.stringify(ingredients), halalCertificate, manufacturer, orgName
    );

    const result = await readAsset(contract, 'Product', id, orgName)


    disconnect();
    return result;
}


const readShipment = async (req) => {
    const {channelName, orgName, id} = req.params;

    contract = await connect(channelName, orgName)
    const result = await readAsset(contract, 'Shipment', id)
    disconnect()

    return result
}

const createShipment = async (req) => {
    const {channelName, orgName} = req.params;
    const {id, productsState, items, location} = req.body;

    const contract = await connect(channelName, orgName)

    await contract.submitTransaction('createShipment',
        id, JSON.stringify(productsState), JSON.stringify(items), location
    );
    const result = await readAsset(contract, 'Shipment', id)

    disconnect();
    return result;
}

const updateShipment = async (req) => {
    const {id, channelName, orgName} = req.params;
    const {productsState, items, location} = req.body;

    const contract = await connect(channelName, orgName)

    await contract.submitTransaction('updateShipment',
        id, JSON.stringify(productsState), JSON.stringify(items), location
    );
    const result = await readAsset(contract, 'Shipment', id)

    disconnect();
    return result;
}

const updateShipmentLocation = async (req) => {
    const {id, channelName, orgName} = req.params;
    const {location} = req.body;

    const contract = await connect(channelName, orgName)

    await contract.submitTransaction('updateShipmentLocation', id, location);
    const result = await readAsset(contract, 'Shipment', id)

    disconnect();
    return result;
}

module.exports = {
    reach: reach,

    readProduct: readProduct,
    // readAllProducts: readAllProducts,
    createProduct: createProduct,
    updateProduct: updateProduct,


    readShipment: readShipment,
    // readAllOrders: readAllOrders,
    createShipment: createShipment,
    updateShipment: updateShipment,


    updateShipmentLocation: updateShipmentLocation
}
