require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const GOERLI_API_KEY = process.env.GOERLI_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  }
};
