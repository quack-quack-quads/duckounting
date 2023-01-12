const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
? describe.skip
: describe("InvoicePlatform Unit Tests", () => {
    let invoicePlatform, invoicePlatformContract;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user =  accounts[1];

        // deploy all contract - using scripts in the deploy folder
        await deployments.fixture("all")

        // get the deployed contract
        invoicePlatformContract = await ethers.getContract("InvoicePlatform")

        // connect to the deployed contract
        invoicePlatform = await invoicePlatformContract.connect(deployer)
    })

    describe("check if the contract is deployed properly", () => [
        it("constructor", async () => {
            const name = await invoicePlatform.name();
            assert.equal(name, "Invoice Platform", "name is not correct")
        })
    ])
})