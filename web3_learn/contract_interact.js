const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(
    new web3.providers.HttpProvider('http://localhost:8545')
);

const contractAddress = "0x590ea4e6cdab9e7e173e38fb3d285b956f974255";
const fromAddress = "0x788a3ac1581c04ecd0827ab0a4b18103b18a0aaa";

const abiStr = fs.readFileSync('voter_abi.json', 'utf8');
const abi = JSON.parse(abiStr);

const voter = new web3.eth.Contract(abi, contractAddress);

var sendTransaction = async function () {
    await voter.methods.addOption("coffee").send({ from: fromAddress });
    await voter.methods.addOption("tea").send({ from: fromAddress });
    await voter.methods.startVoting()
        .send({ from: fromAddress, gas: 600000 });
    await voter.methods['vote(uint256)'](0)
        .send({ from: fromAddress, gas: 600000 });
    const votes = await voter.methods.getVotes().call({ from: fromAddress });
    console.log(`Votes : ${votes}`);
};

sendTransaction()
    .then(() => {
        console.log("done")
    })
    .catch((e) => { console.log(e) });