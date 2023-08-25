// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IGuessNumber.sol";

contract GuessNumber is Ownable, IGuessNumber {

    address[2] public players;
    uint16[2] public guessings;
    bool public concluded = false;
    bytes32 private nonceHash;
    bytes32 private nonceNumHash;
    uint256 public hostDeposit;

    receive() external payable {}

    constructor(bytes32 nonceHash_, bytes32 nonceNumHash_) payable {
        require(msg.value > 0, "GuessNumber: host deposit must be greater than 0");
        nonceHash = nonceHash_;
        nonceNumHash = nonceNumHash_;
        hostDeposit = msg.value;
    }

    function setPlayer(address payable player) external onlyOwner {
        uint16 index = players[0] == address(0) ? 0 : 1;
        require(players[index] == address(0), "GuessNumber: can't add more players");
        players[index] = player;
        guessings[index] = 1000;
    }

    function guess(uint16 number) payable external {
        require(!concluded, "GuessNumber: game already concluded");
        require(msg.sender == players[0] || msg.sender == players[1], "GuessNumber: sender must be a player");
        require(number >= 0 && number < 1000, "GuessNumber: number must be between 0 and 999");
        require(msg.value == hostDeposit, "GuessNumber: must send host deposit");
        for (uint16 i = 0; i < players.length; i++) {
            if (msg.sender == players[i]) {
                require(guessings[i] == 1000, "GuessNumber: player already guessed");
                require(guessings[1-i] != number, "GuessNumber: number already guessed by another player");
                guessings[i] = number;
            }
        }
    }

    function reveal(bytes32 nonce, uint16 number) payable external onlyOwner {
        require(!concluded, "GuessNumber: game already concluded");
        require(guessings[0] < 1000 && guessings[1] < 1000, "GuessNumber: both players must guess first");
        require(keccak256(abi.encodePacked(nonce)) == nonceHash, "GuessNumber: invalid nonce");
        require(keccak256(abi.encodePacked(nonce, number)) == nonceNumHash, "GuessNumber: invalid number");
        address winner = address(0);
        uint16 minDelta = 1000;
        if (number >= 0 && number < 1000) {
            for (uint16 i = 0; i < guessings.length; i++) {
                uint16 delta = absMinus(guessings[i], number);
                if (delta < minDelta) {
                    minDelta = delta;
                    winner = players[i];
                } else if (delta == minDelta) {
                    winner = address(0);
                }
            }
        }

        if (winner != address(0)) {
            payable(winner).transfer(address(this).balance);
        } else {
            uint256 amount = address(this).balance / 2;
            payable(players[0]).transfer(amount);
            payable(players[1]).transfer(amount);
        }
    }

    function absMinus(uint16 a, uint16 b) private pure returns (uint16) {
        return a > b ? a - b : b - a;
    }
}
