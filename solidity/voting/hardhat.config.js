require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 5,
      accounts: ["6186ceb039fe1c4685844dcbde5333693fd9e90252ae69242ec70bc5a70c4e01"]
    }
  },
  etherscan: {
    apiKey: "69HWMSCRTUJSUE478RC4WWRXG5A32TGYHC"
  }
};
