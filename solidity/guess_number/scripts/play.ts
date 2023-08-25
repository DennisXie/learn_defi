import { ethers } from "ethers";
import { GuessNumber__factory } from "../typechain-types";

var contractAddress: string = "";
var hostAddress: string = "";
var hostPrivateKey: string = "";
var player0Address: string = "";
var player0PrivateKey: string = "";
var player1Address: string = ""
var player1PrivateKey: string = "";
let provider = ethers.getDefaultProvider("http://localhost:8545");

async function ether_add_player() {
    const player0 = player0Address;
    const player1 = player1Address;
    let host = new ethers.Wallet(hostPrivateKey, provider);

    console.log("create contract");
    const contract = GuessNumber__factory.connect(contractAddress, host);

    console.log("add player0");
    const txn0 = await contract.setPlayer(player0, {gasLimit: 670_000});
    const result = await txn0.wait();
    console.log(result);
    console.log("add player1");
    const txn1 = await contract.setPlayer(player1, {gasLimit: 670_000});
    const result1 = await txn1.wait();
    console.log(result1);
    await show();
}

async function guessNumber(playerPrivateKey: string, num: number) {
    let player = new ethers.Wallet(playerPrivateKey, provider);

    const contract = GuessNumber__factory.connect(contractAddress, player);
    const txn = await contract.guess(num, {gasLimit: 670_000, value: ethers.parseEther("2")});
    const result = await txn.wait();
    console.log(result);
    await show();
}

async function reveal() {
    let host = new ethers.Wallet(hostPrivateKey, provider);

    const contract = GuessNumber__factory.connect(contractAddress, host);
    const txn = await contract.reveal(ethers.encodeBytes32String("HELLO"), 15, {gasLimit: 670_000});
    const result = await txn.wait();
    console.log(result);
}

async function show() {
    let contractBalance = await provider.getBalance(contractAddress);
    let hostBalance = await provider.getBalance(hostAddress);
    let player0Balance = await provider.getBalance(player0Address);
    let player1Balance = await provider.getBalance(player1Address);
    console.log("contract balance: ", ethers.formatEther(contractBalance));
    console.log("host balance: ", ethers.formatEther(hostBalance));
    console.log("player0 balance: ", ethers.formatEther(player0Balance));
    console.log("player1 balance: ", ethers.formatEther(player1Balance));
}


async function main() {
    contractAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
    hostAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    hostPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    player0Address = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
    player0PrivateKey = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";
    player1Address = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
    player1PrivateKey = "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";
    await ether_add_player();
    console.log("player0 guess");
    await guessNumber(player0PrivateKey, 1);
    console.log("player1 guess");
    await guessNumber(player1PrivateKey, 10);
    console.log("now reveal");
    await reveal();
    await show();
}


main().catch(err => console.log(err));
