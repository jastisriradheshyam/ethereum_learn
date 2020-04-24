pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

contract Voter {
    struct OptionPos {
        uint pos;
        bool exists;
    }
    uint[] public votes;
    uint totalVotes;
    string[] public options;
    mapping (address => bool) hasVoted;
    mapping (string => OptionPos) posOfOption;
    constructor(string[] memory _options) public {
        options = _options;
        votes = new uint[](options.length);
        for (uint i = 0; i < options.length; i++) {
            OptionPos memory optionPos = OptionPos(i, true);
            string memory optionName = options[i];
            posOfOption[optionName] = optionPos;
        }
    }
    function vote(uint option) public {
        require(0 <= option && option < options.length, "Invalid options");
        require(!hasVoted[msg.sender],"Account has already voted");
        votes[option] = votes[option] + 1;
        hasVoted[msg.sender] = true;
    }

    function vote (string memory optionName) public {
        require(!hasVoted[msg.sender],"Account has already voted");
        OptionPos memory optionPos = posOfOption[optionName];
        require(optionPos.exists, "Option does not exists");
        votes[optionPos.pos] = votes[optionPos.pos] + 1;
        hasVoted[msg.sender] = true;
    }
    function getOptions() public view returns(string[] memory) {
        return options;
    }
    function getVotes() public view returns (uint[] memory) {
        return votes;
    }
}