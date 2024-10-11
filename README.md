# REST API Server for Chicken Slaughtering Blockchain Network

This repository is a supplement resource for a research entitled "[Pengembangan Sistem Telusur Berbasis Blockchain pada Rumah Potong Ayan Halal](https://repository.its.ac.id/97209/)" (Development of Blockchain-Based Traceability System for Halal Slaughterhouse).

Other resources:

- Front-end App: [GitHub](https://github.com/sensasi-delight/csts) or [DOI](https://doi.org/10.5281/zenodo.7392664)
- Hyperledger Network: [GitHub](https://github.com/sensasi-delight/csbn-network) or [DOI](https://doi.org/10.5281/zenodo.7401750)
- Caliper Benchmark: [GitHub](https://github.com/sensasi-delight/csbn-caliper-benchmarks) or [DOI](https://doi.org/10.5281/zenodo.7401754)

## Abstract

Until today, the Muslim community in Indonesia still trusts the halal status of products that are circulated by the Indonesian Council of Ulama's Food, Medicine and Cosmetics Assessment Agency (LPPOM MUI). The halal logo on the packaging of the products they buy provides a sense of inner peace for Muslims in Indonesia. One product that is circulated in Indonesia is fresh chicken meat produced by a chicken slaughterhouse. To obtain a halal certificate from the LPPOM MUI, the slaughterhouse must implement Islamic law in the processing of the product. The slaughterhouse must apply the HAS 23000 standard in the production process of the product. At the production stage in the slaughterhouse, there are four critical points of halal, which means that a small mistake that occurs in the process can change the halal status of the item. Therefore, the critical points of halal must be strictly monitored to ensure that all items produced remain halal from start to finish in the process. However, the LPPOM MUI's monitoring of production is only done periodically. This creates a gap in supervision between periods of monitoring. This causes the halal status of items produced when they are not monitored to be unable to be validated as halal, given that neglect of procedures at critical points of halal is still possible. A system is needed that can record all information about the production process of each item. The system must have a high level of data integrity because it is related to accountability to state and religious law. Trends in research in the field of database technology show that high data integrity can be achieved with blockchain technology. Data stored on the blockchain is permanent, which means it cannot be deleted or changed. This research is conducted to realize a blockchain-based traceability system that can trace the production process of halal items by the slaughterhouse. Using the Design Science Research method approach, first a literature study is conducted to understand the problems and determine solutions. Then the system is designed and developed using Hyperledger Fabric and related software. The built system is then evaluated for its performance based on traceability capabilities and transaction speed. This research tries to articulate a blockchain solution to solve the traceability problem of halal items based on the HAS 23000 standard. The implementation of a blockchain-based traceability system could be a new way for tighter control of halal products.

## Prerequisite

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

## Corresponding author

[adamakbar.id@gmail.com](mailto:adamakbar.id@gmail.com?subject=[GiHub]%20CSTS)
