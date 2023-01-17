const {ethers, network} = require("hardhat");
const fs = require('fs');
const FRONT_END_ADDRESSES_FILE = "../client/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../client/constants/abi.json";

module.exports = async () => {
    console.log("Inside update-frontend.js",process.env.UPDATE_FRONT_END);
    if(process.env.UPDATE_FRONT_END)
    {
        console.log("Updating front end...")
        await updateContractAddress();
        await updateABI();
    }
}
const updateContractAddress = async () => {
    const invoicePlatform = await ethers.getContract("InvoicePlatform");
    const chainId = network.config.chainId.toString();
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE,"utf8"));
    if(chainId in currentAddresses){
        if(!currentAddresses[chainId].includes(invoicePlatform.address)){
            currentAddresses[chainId].push(invoicePlatform.address);
        }
    }
    else{
        currentAddresses[chainId] = [invoicePlatform.address];
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}
const updateABI = async () => {
    const invoicePlatform = await ethers.getContract("InvoicePlatform");
    // ! interface directly gives us the ABI and we format it to be a JSON string
    fs.writeFileSync(FRONT_END_ABI_FILE,invoicePlatform.interface.format(ethers.utils.FormatTypes.json));
}
module.exports.tags = ["all","frontend","main"]