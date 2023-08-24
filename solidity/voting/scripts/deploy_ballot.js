const hre = require("hardhat");

async function main() {

    // const contract = await hre.ethers.getContractFactory("Ballot");
    // const ballot = await contract.deploy([1]);
    const [owner] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", owner.address);
    const ballot = await hre.ethers.deployContract("Ballot", [[1]]);

    await ballot.waitForDeployment();

    console.log("Ballot deployed to:", await ballot.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
