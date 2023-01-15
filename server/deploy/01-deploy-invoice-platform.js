const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const {storeImages} = require("../utils/uploadToPinata")

const IMAGES_LOCATION = "./images"

module.exports = async({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    let tokenUris = [
        'ipfs://QmZVusy75ueem2C7dwcv2htVziDFuXZ2rmp3qn7mrpbQxF',
        'ipfs://QmeBgDNBktQ4kBSEtcxuc8Dg4PVVJAcGpVPBKnLpDP1sDQ',
        'ipfs://QmWcwZud5HxJD1u2SuVuVijDHUPBbxBBkje46YW3o6QWiB'
    ];

    // upload images to pinata if not already uploaded
    if(process.env.UPLOAD_TO_PINATA == "true"){
        tokenUris = await handleImageUris();
    }

    const args = [
        ...tokenUris
    ];
    const waitBlockConfirmations = developmentChains.includes(network.name) || 1;
    log("-----------------------------------------------------------------")

    const invoicePlatform = await deploy("InvoicePlatform", {
        from: deployer,
        args: args,
        log : true,
        waitConfirmations: waitBlockConfirmations,
    })

    // verify contracts on etherscan
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(nftMarketplace.address, args)
    }
    log("-----------------------------------------------------------------")
}

const handleImageUris = async() => {
    imageUris = []
    const {responses, files} = await storeImages(IMAGES_LOCATION)
    for(const fileIndex in files){
        imageUris.push(`ipfs://${responses[fileIndex].IpfsHash}`)
    }
    console.log("Image URIs: ", imageUris)
    return imageUris;

} 

module.exports.tags = ["all", "platform"]