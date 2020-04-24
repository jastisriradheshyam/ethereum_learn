pragma solidity ^0.5.16;

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
    bool votingStarted;
    function addOption(string memory option) public {
        require(!votingStarted, "voting already started");
        options.push(option);
    }
    function startVoting() public {
        require(!votingStarted,"voting already started");
        votes = new uint[](options.length);
        for (uint i = 0; i < options.length; i++) {
            OptionPos memory option = OptionPos(i,true);
            posOfOption[options[i]] = option;
        }
        votingStarted = true;
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
    function getOptionsAtPos(uint position) public view returns(string memory) {
        return options[position];
    }
    function getVotes() public view returns (uint[] memory) {
        return votes;
    }
}