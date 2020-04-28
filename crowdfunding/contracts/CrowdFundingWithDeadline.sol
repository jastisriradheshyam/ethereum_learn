pragma solidity ^0.5.16;

import "./Utils.sol";

contract CrowdFundingWithDeadline {
    using Utils for *;

    enum State {Ongoing, Failed, Succeeded, PaidOut}

    event CampaignFinished(
        address addr,
        uint totalCollected,
        bool succeeded
    );
    string public name;
    uint256 public targetAmount; // in weis
    uint256 public fundingDeadline; // in no. of sec from EPOCH
    address payable public beneficiary;
    State public state;
    mapping(address => uint256) public amounts;
    bool public collected;
    uint256 public totalCollected;

    modifier inState(State expectedState) {
        require(state == expectedState, "Invalid state");
        _;
    }

    constructor(
        string memory contractName,
        uint256 targetAmountEth,
        uint256 durationInMin,
        address payable beneficiaryAddress
    ) public {
        name = contractName;
        targetAmount = Utils.etherToWei(targetAmountEth);
        fundingDeadline = currentTime() + Utils.minutesToSeconds(durationInMin);
        beneficiary = beneficiaryAddress;
        state = State.Ongoing;
    }

    function contribute() public payable inState(State.Ongoing) {
        require(beforeDeadline(), "No contributions after the deadline");
        amounts[msg.sender] += msg.value;
        totalCollected += msg.value;

        if (totalCollected >= targetAmount) {
            collected = true;
        }
    }

    function finishCrowdFunding() public inState(State.Ongoing) {
        require(!beforeDeadline(), "cannot finish campaign before a deadline");
        if(!collected) {
            state = State.Failed;
        } else {
            state = State.Succeeded;
        }

        emit CampaignFinished(address(this), totalCollected, collected);
    }

    function collect() public inState(State.Succeeded) {
        if(beneficiary.send(totalCollected)){
            state = State.PaidOut;
        } else {
            state = State.Failed;
        }
    }

    function withdraw() public inState(State.Failed) {
        require(amounts[msg.sender] > 0, "Nothing was contributed");
        uint contributed = amounts[msg.sender];
        amounts[msg.sender] = 0;

        if(!msg.sender.send(contributed)) {
            amounts[msg.sender] = contributed;
        }
    }

    function currentTime() internal view returns (uint256) {
        return now;
    }

    function beforeDeadline() public view returns(bool) {
        return currentTime() < fundingDeadline;
    }
}
