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
    let keys = [id]

    contract = await connect(channelName, orgName)

    let read = await contract.evaluateTransaction('readAsset', type, JSON.stringify(keys));

    disconnect()

    let result = JSON.parse(read.toString('utf8'));

    return result;
}




const createAsset = async (req, type) => {

    const {channelName, orgName} = req.params;
    const {id} = req.body

    let keys = [id]

    const contract = await connect(channelName, orgName)

    await contract.submitTransaction('createOrUpdateAsset', 'create', type, JSON.stringify(keys), JSON.stringify(req.body))

    disconnect()
}

const updateAsset = async (req, type) => {

    const {id, channelName, orgName} = req.params

    let keys = [id]

    const contract = await connect(channelName, orgName)

    await contract.submitTransaction('createOrUpdateAsset', 'update', type, JSON.stringify(keys), JSON.stringify(req.body))

    disconnect()
}




module.exports = {
    reach: reach,

    readAsset: readAsset,
    createAsset: createAsset,
    updateAsset: updateAsset
}