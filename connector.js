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

async function readAsset(contract, type, id) {
    const read = await contract.evaluateTransaction('read' + type, id);
    let result = JSON.parse(read.toString('utf8'));

    if (type == 'Ship') {
        result.Products = JSON.parse(result.Products);
        result.Items = JSON.parse(result.Items);
    } else if (type == 'Product') {
        result.Ingredients = JSON.parse(result.Ingredients);
    }

    return result;
}

// async function readAllAssets(contract, type) {
//     const read = await contract.evaluateTransaction('getAllAssets', type, '[]');
//     let result = JSON.parse(read.toString('utf8'));

//     result.map((item, i) => {
//         result[i].Key = result[i].Key.replaceAll("\u0000", "");
//         if (type == 'Order') {
//             result[i].Record.ProductIds = JSON.parse(result[i].Record.ProductIds);
//         } else if (type == 'Product') {
//             result[i].Record.Ingredients = JSON.parse(result[i].Record.Ingredients);
//         }        
//     })


//     return result;
// }


const reach = async (req) => {
    contract = await connect(req.params.channelName, req.params.orgName)
    const result = await contract.evaluateTransaction('reach')

    disconnect()

    return result.toString('utf8')
}


const readProduct = async (req) => {
    contract = await connect(req.params.channelName, req.params.orgName)
    const result = await readAsset(contract, 'Product', req.params.id)
    disconnect()

    return result
}

// const readAllProducts = async (req) => {
//     contract = await connect(req.params.channelName, req.params.orgName)    
//     const result = await readAllAssets(contract, 'Product')

//     disconnect()

//     return result
// }

const createProduct = async (req) => {
    const contract = await connect(req.params.channelName, req.params.orgName)

    const {id, name, ingredients, halalCertificate, manufacturer} = req.body

    await contract.submitTransaction(
        'createProduct',
        id, name, JSON.stringify(ingredients), halalCertificate, manufacturer
    );

    const result = await readAsset(contract, 'Product', id)


    disconnect();
    return result;
}

const updateProduct = async (req) => {
    const contract = await connect(req.params.channelName, req.params.orgName)

    const {id, name, ingredients, halalCertificate, manufacturer} = req.body

    await contract.submitTransaction(
        'updateProduct',
        id, name, JSON.stringify(ingredients), halalCertificate, manufacturer
    );

    const result = await readAsset(contract, 'Product', id)


    disconnect();
    return result;
}


const readShip = async (req) => {
    contract = await connect(req.params.channelName, req.params.orgName)
    const result = await readAsset(contract, 'Ship', req.params.id)
    disconnect()

    return result
}

// const readAllOrders = async (req) => {
//     contract = await connect(req.params.channelName, req.params.orgName)    
//     const result = await readAllAssets(contract, 'Order')

//     disconnect()

//     return result
// }

const createShip = async (req) => {
    const contract = await connect(req.params.channelName, req.params.orgName)

    const {id, products, items, location} = req.body;

    await contract.submitTransaction('createShip',
        id, JSON.stringify(products), JSON.stringify(items), location
    );
    const result = await readAsset(contract, 'Ship', id)

    disconnect();
    return result;
}

const updateShip = async (req) => {
    const contract = await connect(req.params.channelName, req.params.orgName)

    const {id, products, items, location} = req.body;

    await contract.submitTransaction('updateShip',
        id, JSON.stringify(products), JSON.stringify(items), location
    );
    const result = await readAsset(contract, 'Ship', id)

    disconnect();
    return result;
}

const updateShipLocation = async (req) => {
    const contract = await connect(req.params.channelName, req.params.orgName)

    const {id, location} = req.body;

    await contract.submitTransaction('updateShipLocation', id, location);
    const result = await readAsset(contract, 'Ship', req.params.id)

    disconnect();
    return result;
}

module.exports = {
    reach: reach,

    readProduct: readProduct,
    // readAllProducts: readAllProducts,
    createProduct: createProduct,
    updateProduct: updateProduct,


    readShip: readShip,
    // readAllOrders: readAllOrders,
    createShip: createShip,
    updateShip: updateShip,


    updateShipLocation: updateShipLocation
}
