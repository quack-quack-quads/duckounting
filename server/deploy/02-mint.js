const { network, ethers } = require("hardhat")
const {developmentChains} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const invoicePlatform = await ethers.getContract("InvoicePlatform", deployer)
    console.log(`Executing InvoicePlatform.registerPerson() on ${chainId}`)
    await invoicePlatform.registerPerson(
        "Rohit PAN", "Rohit Shah"
    );            
    console.log(`InvoicePlatform.registerPerson() executed successfully on ${chainId}`)
    console.log(`Minted 1 NFT for sellerPAN and sellerName: ${
        await invoicePlatform.tokenURI(1)
    }`);


}
module.exports.tags = ["mint", "all"]

