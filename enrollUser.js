/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const ENV = yaml.safeLoad(fs.readFileSync('env.yaml', 'utf8'));
const admin = ENV.ADMIN_USER;
const adminpw = ENV.ADMIN_PW;
const ORGS = ENV.ORGS;

const username = 'swaggerApp';

async function main(orgName) {
    try {
        const mspId = ucfirst(orgName) + 'MSP';
        // load the network configuration
        const connectionProfile = yaml.safeLoad(fs.readFileSync(ENV.NETWORK_PATH + '/organizations/peerOrganizations/' + orgName + '.' + ENV.NETWORK + '/connection-profile.yaml', 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = connectionProfile.certificateAuthorities['ca.' + orgName + '.' + ENV.NETWORK];
        const caTLSCACerts = caInfo.tlsCACerts.pem;

        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const userExists = await wallet.get(username);
        if (userExists) {
            console.log(`An identity for the client user "${username}" already exists in the wallet`);
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: admin, enrollmentSecret: adminpw });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: mspId,
            type: 'X.509',
        };
        await wallet.put(username + '-' + orgName, x509Identity);
        console.log(`Successfully enrolled client user "${username}-${orgName}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll client user "${username}": ${error}`);
        process.exit(1);
    }
}

function ucfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

ORGS.map(main)