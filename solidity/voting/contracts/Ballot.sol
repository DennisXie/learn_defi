// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract Ballot {
    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    struct Proposal {
        uint name;
        uint voteCount;
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    constructor(uint[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for (uint i=0; i<proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter) public {
        require(msg.sender == chairperson, "Only chairperson can give right to vote.");
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight==0, "The voter already has right to vote.");
        voters[voter].weight += 1;
    }

    function delegateRigthTo(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(sender.weight>0, "You have no right to vote.");

        Voter storage receiver = voters[getFinalReceiver(to)];

        sender.voted = true;
        sender.delegate = to;

        if (receiver.voted) {
            proposals[receiver.vote].voteCount += sender.weight;
        } else {
            receiver.weight += sender.weight;
        }
    }

    function getFinalReceiver(address to) private view returns (address finalReceiver){
        require(to != msg.sender, "Self-delegation is disallowed.");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }
        finalReceiver = to;
    }

    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight>0, "You have no right to vote");
        require(!sender.voted, "You already voted.");

        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint winningProposalId) {
        uint winningVoteCount = 0;
        for (uint i=0; i<proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
    }

    function winnerName() public view returns (uint winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
