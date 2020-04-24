# Ethereum Learn

## Compiler

### Installation
- https://github.com/ethereum/solidity/releases
- `curl -OL https://github.com/ethereum/solidity/releases/download/v0.6.6/solc-static-linux`
- `sudo mv solc-static-linux /opt/softwares`
- `sudo ln -s /opt/softwares/solc-static-linux /usr/bin/solc`

### Running
```
solc --combined-json=abi,bin,metadata --output-dir . filename1.sol filename2.sol ...
```

## JSON output

`cat combined.json | jq`

```json
{
    "contracts":{
        "contractFileName.sol:ContractName":{
            "abi": "...",
            "bin": "...",
            "metadata": "...",
        }
    },
    "version": "0.6.6+commit.6c089d02.Linux.g++"
}
```

- abi : Application binary interface
- bin : binary bytecode
- metadata : metadata for the compilation results
- version : The compiler version used to compile the source code.

`cat combined.json | jq -r '.contracts."contractFileName.sol:ContractName".abi' | jq`

```json
[
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_approvers",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "_minApprovers",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

## Ethereum Client
> Here we're using Geth

### Installation
- https://github.com/ethereum/go-ethereum/releases
- https://geth.ethereum.org/downloads/
- https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.9.13-cbc4ac26.tar.gz
- `curl -OL https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.9.13-cbc4ac26.tar.gz`
- `tar xvf geth-linux-amd64-1.9.13-cbc4ac26.tar.gz`
- `sudo mv geth-linux-amd64-1.9.13-cbc4ac26/geth /opt/softwares/`
- `sudo ln -s /opt/softwares/geth /usr/bin/geth`

### Running
```
geth \
  --rinkeby \ # Connect to the Rineby Network
  --rpc \ ## Enable JSON-RPC
  --syncmode=light ## "Light" - faster sync mode
```
- PORT : 8545

- Specific RPC objects to be accessible
```
geth --rinkeby --rpc \
--rpcapi="eth,net,web3,personal,txpool" \
--syncmode=light
```

- For insecure api access add `--allow-insecure-unlock`

### Common Commands
- `geth accounts` : Manage geth accounts
- `geth init` : Create a new genesis block with new chain
- `geth help` : help
- `geth attach` : Interactive Javascript session

### References
- https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options

### Geth Attach
- Javascript Objects
    - `eth` : Expose web3.js interface
    - `txpool` : Information about transaction pool
        - Don't work on Light client
    - `personal` : Manage accounts
    - `miner` : Controls mining new blocks
        - Don't work on Light client
    - `debug` : Used for Geth debugging
        - Don't work on Light client
    - `admin` : control the client node
        - Don't work on Light client
    - `net` : provide with peers and network info
 
#### Execution
- Run the geth with blockchain sync
- Then `geth attach http://localhost:8545`
- Then REPL will start
- use above commands like
    - `admin.peers`
    - `txpool.status`
    - `personal.listAccounts`
    - `personal.newAccount("password")` : create new account
    - `personal.unlockAccount("0x....","password",300)`
        - 300 is number of seconds this account will be unlocked
    - `eth.getBalance("address_in_the_wallet")`
    - and so on.