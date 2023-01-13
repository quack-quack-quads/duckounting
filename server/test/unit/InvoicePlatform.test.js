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
        invoicePlatform = invoicePlatformContract.connect(deployer)
    })

    describe("check if the contract is deployed properly", () => {
        it("constructor", async () => {
            const invoiceIdCount = await invoicePlatform.getInvoiceIdCount();
            assert.equal(invoiceIdCount, 0, "invoiceIdCount should be 0")            
        })
    })

    describe("createInvoice", () => {
        it("should create an invoice", async () => {
            let invoiceIdCountBefore = await invoicePlatform.getInvoiceIdCount();
            assert.equal(invoiceIdCountBefore, 0, "invoiceIdCount should be 0")

            let args = [
                1, // paymentMode
                1000, // amountMonthly
                12, // monthsToPay
                false, // status
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await invoicePlatform.addInvoice(...args);
            let invoiceIdCountAfter = await invoicePlatform.getInvoiceIdCount();
            assert.equal(invoiceIdCountAfter, 1, "invoiceIdCount should be 1")

            // check if the invoice is created properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoices = await invoicePlatform.getInvoices(...args);
            const sellerInvoice = sellerInvoices[0]
            assert.equal(sellerInvoice.paymentMode, 1, "paymentMode should be 1")
            assert.equal(sellerInvoice.amountMonthly, 1000, "amountMonthly should be 1000")
            assert.equal(sellerInvoice.monthsToPay, 12, "monthsToPay should be 12")
            assert.equal(sellerInvoice.status, false, "status should be false")
            assert.equal(sellerInvoice.sellerPAN, "sellerPAN", "sellerPAN should be sellerPAN")
            assert.equal(sellerInvoice.buyerPAN, "buyerPAN", "buyerPAN should be buyerPAN")
            assert.equal(sellerInvoice.date, "date", "date should be date")
            assert.equal(sellerInvoice.url, "url", "url should be url")

            // check if the invoice is created properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoices = await invoicePlatform.getInvoices(...args);
            const buyerInvoice = buyerInvoices[0]
            assert.equal(buyerInvoice.paymentMode, 1, "paymentMode should be 1")
            assert.equal(buyerInvoice.amountMonthly, 1000, "amountMonthly should be 1000")
            assert.equal(buyerInvoice.monthsToPay, 12, "monthsToPay should be 12")
            assert.equal(buyerInvoice.status, false, "status should be false")
            assert.equal(buyerInvoice.sellerPAN, "sellerPAN", "sellerPAN should be sellerPAN")
            assert.equal(buyerInvoice.buyerPAN, "buyerPAN", "buyerPAN should be buyerPAN")
            assert.equal(buyerInvoice.date, "date", "date should be date")
            assert.equal(buyerInvoice.url, "url", "url should be url")
        })
    })

    describe("pay", () => {
        it("should pay an invoice for a recurring invoice", async () => {
            let args = [
                1, // paymentMode
                1000, // amountMonthly
                4, // monthsToPay
                false, // status
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await invoicePlatform.addInvoice(...args);

            // since we know that the invoice is properly created, we can directly call the pay function
            const deployerAddress = await deployer.getAddress();

            // expect the transaction to fail since the invoice with the given id does not exist
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                100 // invoiceId
            ]
            await expect(invoicePlatform.pay(...args)).to.be.revertedWith("InvoiceNotExist")
            
            // expect the transaction to fail since not enough funds are sent
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId
            ]
            await expect(invoicePlatform.pay(...args)).to.be.revertedWith("NotEnoughETHSend")

            // now the transaction should pass when the correct amount of funds are sent
            await invoicePlatform.pay(...args, {
                value: ethers.utils.parseEther("1000")
            })

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesBefore = await invoicePlatform.getInvoices(...args);
            const sellerInvoiceBefore = sellerInvoicesBefore[0]
            assert.equal(sellerInvoiceBefore.monthsToPay, 3, "monthsToPay should be 3") // since we paid for 1 month
            assert.equal(sellerInvoiceBefore.status, false, "status should be false") // since not all months are paid
            
            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesBefore = await invoicePlatform.getInvoices(...args);
            const buyerInvoiceBefore = buyerInvoicesBefore[0]
            assert.equal(buyerInvoiceBefore.monthsToPay, 3, "monthsToPay should be 3") // since we paid for 1 month
            assert.equal(buyerInvoiceBefore.status, false, "status should be false") // since not all months are paid
                  
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId
            ]
            // let's pay for the remaining months
            for (let index = 0; index < 3; index++) {
                await invoicePlatform.pay(...args, {
                    value: ethers.utils.parseEther("1000")
                })
            }

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesAfter = await invoicePlatform.getInvoices(...args);
            const sellerInvoiceAfter = sellerInvoicesAfter[0]
            assert.equal(sellerInvoiceAfter.monthsToPay, 0, "monthsToPay should be 0") // since we paid for all months
            assert.equal(sellerInvoiceAfter.status, true, "status should be true") // since all months are paid

            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesAfter = await invoicePlatform.getInvoices(...args);
            const buyerInvoiceAfter = buyerInvoicesAfter[0]
            assert.equal(buyerInvoiceAfter.monthsToPay, 0, "monthsToPay should be 0") // since we paid for all months
            assert.equal(buyerInvoiceAfter.status, true, "status should be true") // since all months are paid
        })


        it("should pay an invoice for a onetime invoice", async() => {
            let args = [
                0, // paymentMode
                1000, // amountMonthly
                1, // monthsToPay
                false, // status
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await invoicePlatform.addInvoice(...args);

            const deployerAddress = await deployer.getAddress();

            // we can skip the basic not exists test as they are the same for any mode
            // now the transaction should pass when the correct amount of funds are sent
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId
            ]
            await invoicePlatform.pay(...args, {
                value: ethers.utils.parseEther("1000")
            })

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesBefore = await invoicePlatform.getInvoices(...args);
            const sellerInvoiceBefore = sellerInvoicesBefore[0]
            assert.equal(sellerInvoiceBefore.monthsToPay, 0, "monthsToPay should be 0") // since we paid for 1 month
            assert.equal(sellerInvoiceBefore.status, true, "status should be true") // since all months are paid

            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesBefore = await invoicePlatform.getInvoices(...args);
            const buyerInvoiceBefore = buyerInvoicesBefore[0]
            assert.equal(buyerInvoiceBefore.monthsToPay, 0, "monthsToPay should be 0") // since we paid for 1 month
            assert.equal(buyerInvoiceBefore.status, true, "status should be true") // since all months are paid
        })

        it("should confirm an invoice for a offline cash invoice", async () => {
            let args = [
                2, // paymentMode
                1000, // amountMonthly
                0, // monthsToPay
                true, // status
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]

            await invoicePlatform.addInvoice(...args);
            
            const deployerAddress = await deployer.getAddress();

            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId
            ]
            // since payment is already done - offline, we don't transfer any payments
            await invoicePlatform.pay(...args);

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesBefore = await invoicePlatform.getInvoices(...args);
            const sellerInvoiceBefore = sellerInvoicesBefore[0]
            assert.equal(sellerInvoiceBefore.monthsToPay, 0, "monthsToPay should be 0") // since we paid already
            assert.equal(sellerInvoiceBefore.status, true, "status should be true") // since all months are paid

            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesBefore = await invoicePlatform.getInvoices(...args);
            const buyerInvoiceBefore = buyerInvoicesBefore[0]
            assert.equal(buyerInvoiceBefore.monthsToPay, 0, "monthsToPay should be 0") // since we paid already
            assert.equal(buyerInvoiceBefore.status, true, "status should be true") // since all months are paid
        })


    })
})