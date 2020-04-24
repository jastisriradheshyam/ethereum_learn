"use strict";

// ========== Module Requires [ start ] ==========
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
// ========== Module Requires [ end ] ==========

class DeployLib {

    /**
     * Deploy Library
     * @param {Object} options 
     * @param {Object} options.logger logger object (default console) 
     * @param {String} options.filePath contract file path (default null) 
     * @param {String} options.sender sender address (default null) 
     * @param {String} options.clientURL client URL (default "http://localhost:8545")
     * @param {String} options.contractName contract name (default null) 
     */
    constructor(options) {

        // logger setup
        this._logger = console;
        if (options.logger) {
            this._logger = options.logger;
        }

        // contract file path
        this._filePath = !!options.filePath ? options.filePath : null;

        // sender address
        this._sender = !!options.sender ? options.sender : null;

        // client http URL
        this._clientURL = !!options.clientURL ?
            options.clientURL : "http://localhost:8545";

        // contract name
        this._contractName = !!options.contractName ?
            options.contractName : null;

        this._web3 = null;
        this._contract = null;
    }

    set filePath(_filePath) {
        if (!_filePath) {
            throw "File path is either null or undefined or blank";
        }
        this._filePath = _filePath;
    }

    set sender(_sender) {
        if (!_sender) {
            throw "sender address is either null or undefined or blank";
        }
        this._sender = _sender;
    }

    set contractName(_contractName) {
        if (!_contractName) {
            throw "contract name is either null or undefined or blank";
        }
        this._contractName = _contractName;
    }

    set clientURL(_clientURL) {
        if (!_clientURL) {
            throw "client URL is either null or undefined or blank";
        }
        this._clientURL = _clientURL;
    }

    /**
     * set web3 object
     */
    _setWeb3() {
        const web3 = new Web3();
        web3.setProvider(
            new Web3.providers.HttpProvider(
                this._clientURL
            )
        );
        this._web3 = web3;
    }

    /**
     * compile the contract
     */
    _compileContract() {
        const compilerInput = {
            [this._contractName]: {
                content: fs.readFileSync(this._filePath, 'utf8')
            }
        };

        this._logger.info('Compiling the contract');

        // 1 in argument means optimise the bytecode
        const compiledContract = JSON.parse(solc.compile(JSON.stringify({
            language: "Solidity",
            sources: compilerInput,
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        })));
        const contract = compiledContract.contracts[this._contractName]
        [this._contractName];

        // console.log(compiledContract.contracts[this._contractName]
        //     [this._contractName].evm)
        const abi = contract.abi;
        fs.writeFileSync(`${this._contractName.toLowerCase()}_abi.json`, JSON.stringify(abi));

        this._contract = contract;
    }

    /**
     * check the constraints before deploy
     */
    _check() {
        if (!this._filePath) {
            throw "File path is not set";
        }
        if (!this._sender) {
            throw "sender address is not set";
        }
        if (!this._contractName) {
            throw "contract name is not set";
        }
    }

    /**
     * deploy the contract
     */
    async deploy() {
        this._check();
        this._compileContract();
        this._setWeb3();
        const contract = new this._web3.eth.Contract(this._contract.abi);
        const bytecode = '0x' + this._contract.evm.bytecode.object;
        console.log(bytecode)
        const gasEstimate = await this._web3.eth.estimateGas({
            data: bytecode
        });


        this._logger.info('Deploying the contract');

        const contractInstance = await contract.deploy({
            data: bytecode
        })
            .send({
                from: this._sender,
                gas: gasEstimate
            })
            .on('transactionHash', (transactionHash) => {
                this._logger.info(`Transaction hash : ${transactionHash}`);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this._logger.info(`Confirmation number: ${confirmationNumber}`)
            });

        this._logger.info(`Contract address: ${contractInstance.options.address}`);
    }
};

module.exports = DeployLib;