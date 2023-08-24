// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.8.0;

interface IGuessNumber {
    function setPlayer(address payable player) external;
    function guess(uint16 number) external payable;
    function reveal(bytes32 nonce, uint16 number) external payable;
}
