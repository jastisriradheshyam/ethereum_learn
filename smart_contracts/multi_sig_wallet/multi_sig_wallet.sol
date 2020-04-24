pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

contract MultiSigWallet {
    uint minApprovers;
    address payable beneficiary;
    address payable owner;
    mapping (address => bool) approvedBy;
    mapping (address => bool) isApprover;
    uint approvalsNum;
    constructor(
        address[] memory _approvers,
        uint _minApprovers,
        address payable _beneficiary
    ) public payable {
        require(_minApprovers <= _approvers.length,
        "Required number of approvers should be less than number of approvers");
        minApprovers = _minApprovers;
        beneficiary = _beneficiary;
        owner = msg.sender;
        for(uint i = 0; i < _approvers.length; i++) {
            address approver = _approvers[i];
            isApprover[approver] = true;
        }
    }
    function approve() public {
        require(isApprover[msg.sender],"Not an approver");
        if(!approvedBy[msg.sender]) {
            approvalsNum++;
            approvedBy[msg.sender] = true;
        }
        if (approvalsNum == minApprovers) {
            beneficiary.transfer(address(this).balance);
            selfdestruct(owner);
        }
    }
    function reject() public {
        require(isApprover[msg.sender],"Not an approver");
        selfdestruct(owner);
    }
}