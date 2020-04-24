# Truffle

## Installation
`npm i -g truffle`

## Init
`truffle init`

## Operations
- Compile:        `truffle compile`
- Migrate:        `truffle migrate`
- Test contracts: `truffle test`

- Re-deploy contracts : `truffle migrate --reset`
    - specific network
    - `truffle migrate --reset --network network_name`

## Truffle Config

### Networks

```js
module.exports = {
    networks: {
        live: { // network name
            host: "IP_OR_DOMAIN", // where the network node is hosted
            port: "PORT_NUMBER", // port that is exposed to connect by the network node
            network_id : NETWORK_ID_NUMBER, // "*" to match any network
            gas: 100000, // gas to spend to deploy the contract
            gasPrice: 100,
            from: "ACCOUNT_ADDRESS" // address with which contract is deployed
        }
    }
}
```

## Notes

- Problem with the naming of sol files with _ in them