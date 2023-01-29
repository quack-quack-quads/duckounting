require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy");
require("solidity-coverage");
// require("hardhat-gas-reporter") 
require("hardhat-contract-sizer")
require("dotenv").config()
module.exports = {
  solidity: {
    compilers: [
          {
              version: "0.8.9",
              settings: {
                  optimizer: {
                    enabled: true,
                    runs: 200,
                  }
              }
          },
    ]
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    goerli: {
      url: process.env.ALCHEMY_TESTNET_LINK_GOERLI,
      accounts: [process.env.METAMASK_PRIVATE_KEY_FOR_TESTNET],
      chainId: 5,
      blockConfirmations: 5
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};