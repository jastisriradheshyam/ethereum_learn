const Utils = artifacts.require("./Utils.sol");
const CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");
const TestCrowdFundingWithDeadline = artifacts.require("./TestCrowdFundingWithDeadline.sol");

module.exports = async function(deployer) {
    await deployer.deploy(Utils);
    deployer.link(Utils, CrowdFundingWithDeadline);
    deployer.link(Utils, TestCrowdFundingWithDeadline);
};