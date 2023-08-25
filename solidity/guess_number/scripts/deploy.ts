import hre, { ethers } from "hardhat";
import web3 from "web3";

async function main() {
    let coin: string = "1";
    let nonce = "HELLO";
    const nonceHash = ethers.solidityPackedKeccak256(["bytes32"],[ethers.encodeBytes32String(nonce)]);
    let number = 15;
    const nonceNumberHash = ethers.solidityPackedKeccak256(["bytes32", "uint16"], [ethers.encodeBytes32String(nonce), number]);
    console.log("nonceHash: ", nonceHash, nonceHash.length);
    const GuessNumber = await hre.ethers.getContractFactory("GuessNumber");
    const guessNumber = await GuessNumber.deploy(nonceHash, nonceNumberHash, {
        value: hre.ethers.parseEther(coin),
    });
    
    await guessNumber.waitForDeployment();

    console.log("GuessNumber deployed to:", await guessNumber.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
