"use strict";

const DeployLib = require('./deploy');
const Voter = new DeployLib({
    filePath: '../smart_contracts/voter/voter_without_exp_features.sol',
    sender: '0x788a3ac1581c04ecd0827ab0a4b18103b18a0aaa',
    clientURL: 'http://localhost:8545',
    contractName: 'Voter'
});

Voter.deploy()
    .catch(err => console.error(err));

// 0x590ea4e6cdab9e7e173e38fb3d285b956f974255