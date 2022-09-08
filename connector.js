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

const reach = async (req) => {
    const {channelName, orgName} = req.params;

    contract = await connect(channelName, orgName)
    const result = await contract.evaluateTransaction('reach')

    disconnect()

    return result.toString('utf8')
}



const readAsset = async (req, type) => {
	const {channelName, orgName, id} = req.params;

	const keys = makeAssetKeys(type, req.query.orgName || orgName, req.query.date, id)
	// const keys = [id]
	
    contract = await connect(channelName, orgName)
    const read = await contract.evaluateTransaction('readAsset', type, JSON.stringify(keys));

    disconnect()

    return JSON.parse(read.toString('utf8'))
}


const readAssets = async (req, type) => {
	const {channelName, orgName} = req.params;
	const {date} = req.query;

	const keys = makeAssetKeys(type, req.query.orgName || orgName, date)

    contract = await connect(channelName, orgName)
    const read = await contract.evaluateTransaction('readAssets', type, JSON.stringify(keys));

    disconnect()

    return JSON.parse(read.toString('utf8'))
}


const createAsset = async (req, type) => {
    const {channelName, orgName} = req.params;
    const { id, date } = req.body

	const keys = makeAssetKeys(type, orgName, date, id)
	// const keys = [id]

    const contract = await connect(channelName, orgName)
    await contract.submitTransaction('createOrUpdateAsset', 'create', type, JSON.stringify(keys), JSON.stringify(req.body))

    disconnect()
}


const updateAsset = async (req, type) => {
    const {id, channelName, orgName} = req.params
    const { date } = req.body

	const keys = makeAssetKeys(type, orgName, date, id)
	// const keys = [id]

    const contract = await connect(channelName, orgName)
    await contract.submitTransaction('createOrUpdateAsset', 'update', type, JSON.stringify(keys), JSON.stringify(req.body))

    disconnect()
}


const makeAssetKeys = (type, orgName, date, id=null) => {
	let keys = []

	if (['Product', 'Batch', 'Slaughterer'].indexOf(type) !== -1) {
		keys.push(orgName)
	}

	if (['Batch', 'Shipment', 'Invoice'].indexOf(type) !== -1) {
		keys = keys.concat(date.substr(2).split('-'))
	}

	if(id != null) keys.push(id)

	return keys
}




module.exports = {
    reach: reach,

    readAsset: readAsset,
    readAssets: readAssets,
    createAsset: createAsset,
    updateAsset: updateAsset
}