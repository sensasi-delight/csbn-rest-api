# Preq
1. nodejs & npm

## env.yaml
### Copy-paste file env.yaml.example
```bash
cp env.yaml.example env.yaml
```
### isi nilai variabel sesuai dengan peer/org yang dituju
```yaml
NETWORK_PATH: # (eg. /home/root/halal-network)
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
    - 'courier'
    - 'supp1'
    - 'supp2'
    - 'supp3'
    - 'cust1'
    - 'cust2'
    - 'cust3'
```

## build
```bash
npm run build
```
dilakukan untuk
1. install dependecy
1. membangun ulang 'wallet' [(apa itu wallet?)](https://hyperledger-fabric.readthedocs.io/en/release-2.3/developapps/wallet.html)

# Start
jalankan server REST API (swagger) dengan perintah:
```bash
npm start
```