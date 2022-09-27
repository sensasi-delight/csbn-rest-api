# Chicken Slaughterer Blockchain Network: REST API Server

## Pre-requisite
1. nodejs ^v15.8.0
2. npm ^v6.14.8

## Installation

### 1. klon repositori ke mesin server
```bash
git clone sensasi-delight/csbn-rest-api
```

### 2. Copy-paste file env.yaml.example
```bash
cp env.yaml.example env.yaml
```
### 3. Isi nilai variabel pada file `env.yaml` sesuai dengan peer/org yang dituju
```yaml
NETWORK_PATH: # (eg. /home/root/halal-network)
NETWORK: 
CHAINCODE_NAME:
ADMIN_USER:
ADMIN_PW:
SERVER_PORT:
CHANNELS:
    - 'channel0'
    - 'channel1'
    - 'channel2'
    - 'channel3'
    - 'channel4'

ORGS:
    - 'supp1'
    - 'supp2'
    - 'supp3'
    - 'cust1'
    - 'cust2'
    - 'cust3'
    - 'courier'

SSL_KEY_FILE: 
SSL_CERT_FILE: 
SSL_CA_FILE: 
```

### 4. build
```bash
npm run build
```
dilakukan untuk
1. install dependecy
1. membangun ulang 'wallet' [(apa itu wallet?)](https://hyperledger-fabric.readthedocs.io/en/release-2.3/developapps/wallet.html)

## Menjalankan server
jalankan server REST API dan swagger dengan perintah:
```bash
npm start
```