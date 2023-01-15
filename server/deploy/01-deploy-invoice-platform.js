const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    const args = [
        "commonURI",
        "mediumURI",
        "rareURI",
    ];
    const waitBlockConfirmations = developmentChains.includes(network.name) || 1;
    log("-----------------------------------------------------------------")

    const invoicePlatform = await deploy("InvoicePlatform", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // verify contracts on etherscan
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(nftMarketplace.address, args)
    }
    log("-----------------------------------------------------------------")
}
module.exports.tags = ["all", "platform"]