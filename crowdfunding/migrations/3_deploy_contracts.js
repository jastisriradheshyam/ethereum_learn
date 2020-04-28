const CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer) {
    deployer.deploy(
        CrowdFundingWithDeadline,
        "Test campaign",
        1,
        200,
        "0x98F4526f348Ecb236F927cBBB671D696008A44BB" // Ganache network account address
    )
};