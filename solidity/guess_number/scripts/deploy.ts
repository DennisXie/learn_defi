import hre from "hardhat";
import web3 from "web3";

async function main() {
    let nonce = "HELLO";
    const nonceHash = web3.utils.soliditySha3(nonce) || "";
    let number = 15;
    const nonceNumberHash = web3.utils.soliditySha3(nonce, number) || "";
    console.log("nonceHash: ", nonceHash, nonceHash.length);
    const GuessNumber = await hre.ethers.getContractFactory("GuessNumber");
    const guessNumber = await GuessNumber.deploy(nonceHash, nonceNumberHash, {
        value: hre.ethers.parseEther("1"),
    });
    
    await guessNumber.waitForDeployment();

    console.log("GuessNumber deployed to:", await guessNumber.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
