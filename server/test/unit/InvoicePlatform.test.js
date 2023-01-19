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
        deployerAddress = await deployer.getAddress();
        userAddress = await user.getAddress();

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

            // should fail if sellerPAN or buyerPAN is empty
            let args = [
                1, // paymentMode
                1000, // amountMonthly
                12, // monthsToPay
                false, // status
                userAddress, // receipent
                "", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await expect(invoicePlatform.addInvoice(...args)).to.be.revertedWith("InvalidTx")

            args = [
                1, // paymentMode
                1000, // amountMonthly
                12, // monthsToPay
                false, // status
                userAddress, // receipent
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
            assert.equal(sellerInvoice.recipient, userAddress, "recipient address should match")
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
            assert.equal(buyerInvoice.recipient, userAddress, "recipient address should match")
            assert.equal(buyerInvoice.sellerPAN, "sellerPAN", "sellerPAN should be sellerPAN")
            assert.equal(buyerInvoice.buyerPAN, "buyerPAN", "buyerPAN should be buyerPAN")
            assert.equal(buyerInvoice.date, "date", "date should be date")
            assert.equal(buyerInvoice.url, "url", "url should be url")
        })
        it("should emit event AddInvoice", async () => {
            let args = [
                1, // paymentMode
                1000, // amountMonthly
                12, // monthsToPay
                false, // status
                userAddress, // receipent
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            const addInvoiceTx = await invoicePlatform.addInvoice(...args);
            const addInvoiceReceipt = await addInvoiceTx.wait();
            expect(addInvoiceReceipt.events[0].event).to.equal("AddInvoice")
        })
    })

    describe("pay", () => {
        it("should pay an invoice for a recurring invoice", async () => {
            let args = [
                1, // paymentMode
                1000, // amountMonthly
                4, // monthsToPay
                false, // status
                userAddress, // receipent
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await invoicePlatform.addInvoice(...args);

            // since we know that the invoice is properly created, we can directly call the pay function

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

            // should fail if anyone other than user pays
            await expect(invoicePlatform.pay(...args)).to.be.revertedWith("WrongBuyer");

            const userConnectedInvoicePlatform = await invoicePlatformContract.connect(user);
            await expect(userConnectedInvoicePlatform.pay(...args)).to.be.revertedWith("NotEnoughETH")

            // now the transaction should pass when the correct amount of funds are sent
            await userConnectedInvoicePlatform.pay(...args, {
                value: ethers.utils.parseEther("1000")
            })

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesBefore = await userConnectedInvoicePlatform.getInvoices(...args);
            const sellerInvoiceBefore = sellerInvoicesBefore[0]
            assert.equal(sellerInvoiceBefore.monthsToPay, 3, "monthsToPay should be 3") // since we paid for 1 month
            assert.equal(sellerInvoiceBefore.status, false, "status should be false") // since not all months are paid
            
            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesBefore = await userConnectedInvoicePlatform.getInvoices(...args);
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
                await userConnectedInvoicePlatform.pay(...args, {
                    value: ethers.utils.parseEther("1000")
                })
            }

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesAfter = await userConnectedInvoicePlatform.getInvoices(...args);
            const sellerInvoiceAfter = sellerInvoicesAfter[0]
            assert.equal(sellerInvoiceAfter.monthsToPay, 0, "monthsToPay should be 0") // since we paid for all months
            assert.equal(sellerInvoiceAfter.status, true, "status should be true") // since all months are paid

            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesAfter = await userConnectedInvoicePlatform.getInvoices(...args);
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
                userAddress, // recipient
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await invoicePlatform.addInvoice(...args);

            // we can skip the basic not exists test as they are the same for any mode
            // now the transaction should pass when the correct amount of funds are sent
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId
            ]
            const userConnectedInvoicePlatform = await invoicePlatformContract.connect(user);
            await userConnectedInvoicePlatform.pay(...args, {
                value: ethers.utils.parseEther("1000")
            })

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesBefore = await userConnectedInvoicePlatform.getInvoices(...args);
            const sellerInvoiceBefore = sellerInvoicesBefore[0]
            assert.equal(sellerInvoiceBefore.monthsToPay, 0, "monthsToPay should be 0") // since we paid for 1 month
            assert.equal(sellerInvoiceBefore.status, true, "status should be true") // since all months are paid

            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesBefore = await userConnectedInvoicePlatform.getInvoices(...args);
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
                userAddress, // recipient
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]

            await invoicePlatform.addInvoice(...args);
            
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId
            ]
            // since payment is already done - offline, we don't transfer any payments
            const userConnectedInvoicePlatform = await invoicePlatformContract.connect(user);
            await userConnectedInvoicePlatform.pay(...args);

            // check if the invoice is paid properly for the seller
            args = [
                "sellerPAN", // sellerPAN
                0 // personType
            ]
            const sellerInvoicesBefore = await userConnectedInvoicePlatform.getInvoices(...args);
            const sellerInvoiceBefore = sellerInvoicesBefore[0]
            assert.equal(sellerInvoiceBefore.monthsToPay, 0, "monthsToPay should be 0") // since we paid already
            assert.equal(sellerInvoiceBefore.status, true, "status should be true") // since all months are paid

            // check if the invoice is paid properly for the buyer
            args = [
                "buyerPAN", // buyerPAN
                1 // personType
            ]
            const buyerInvoicesBefore = await userConnectedInvoicePlatform.getInvoices(...args);
            const buyerInvoiceBefore = buyerInvoicesBefore[0]
            assert.equal(buyerInvoiceBefore.monthsToPay, 0, "monthsToPay should be 0") // since we paid already
            assert.equal(buyerInvoiceBefore.status, true, "status should be true") // since all months are paid
        })
        it("should pay and funds received at seller", async() => {
            let args = [
                1, // paymentMode
                1000, // amountMonthly
                4, // monthsToPay
                false, // status
                userAddress, // receipent
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await invoicePlatform.addInvoice(...args);  

            const sellerBalanceBefore = await ethers.provider.getBalance(deployerAddress);

            // pay to the seller
            const userConnectedInvoicePlatform = await invoicePlatformContract.connect(user);
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId   
            ] 
            await userConnectedInvoicePlatform.pay(...args, {
                value: ethers.utils.parseEther("1000")
            })

            const sellerBalanceAfter = await ethers.provider.getBalance(deployerAddress);

            // check if the seller received the funds
            assert.equal(sellerBalanceAfter.sub(sellerBalanceBefore).toString(), ethers.utils.parseEther("1000").toString(), "seller should have received 1000 ethers")
        })
        it("should emit Paid event",async () => {
            let args = [
                1, // paymentMode
                1000, // amountMonthly
                4, // monthsToPay
                false, // status
                userAddress, // receipent
                "sellerPAN", // sellerPAN
                "buyerPAN", // buyerPAN
                "date", // date
                "url" // url
            ]
            await invoicePlatform.addInvoice(...args);  

            // pay to the seller
            const userConnectedInvoicePlatform = await invoicePlatformContract.connect(user);
            args = [
                deployerAddress, // sellerAddress
                "buyerPAN", // buyerPAN
                "sellerPAN", // sellerPAN
                0 // invoiceId   
            ] 
            const paidTx = await userConnectedInvoicePlatform.pay(...args, {
                value: ethers.utils.parseEther("1000")
            })
            const paidReceipt = await paidTx.wait();
            expect(paidReceipt.events[0].event).to.equal("Paid");
            expect(paidReceipt.events[0].args.sellerPan).to.equal("sellerPAN");
            expect(paidReceipt.events[0].args.buyerPan).to.equal("buyerPAN");
        })
    })

    describe('registerPerson', () => {
        it("should register a person", async() => {
            let args = [
                "sellerPAN", // pan
                "sellerName" // name
            ]
            await invoicePlatform.registerPerson(...args);

            // check if the person is registered properly
            const person = await invoicePlatform.getPerson("sellerPAN");
            assert.equal(person.name, "sellerName", "name should be sellerName")
            assert.equal(person.percentSuccess, 100, "percentSuccess should be 100")
            assert.equal(person.rating, 5, "rating should be 5")
            assert.equal(person.addr, deployerAddress, "addr should be deployerAddress")
        })
        it("should not register a person if already registered", async() => {
            let args = [
                "sellerPAN", // pan
                "sellerName" // name
            ]
            await invoicePlatform.registerPerson(...args);

            // try to register again
            await expect(invoicePlatform.registerPerson(...args)).to.be.revertedWith("PersonAlreadyExists")
        })
        it("should emit RegisterPerson event", async() => {
            // RegisterPerson(string pan, string name);
            let args = [
                "sellerPAN", // pan
                "sellerName" // name
            ]
            const registerPersonTx = await invoicePlatform.registerPerson(...args);
            const registerPersonReceipt = await registerPersonTx.wait();
            expect (registerPersonReceipt.events[1].event).to.equal("RegisterPerson")
            expect (registerPersonReceipt.events[1].args.pan).to.equal("sellerPAN")
            expect (registerPersonReceipt.events[1].args.name).to.equal("sellerName")   
            
        })
    })

    describe("giveRating", () => {
        it("should give a rating to a person", async() => {
            // should fail if person is not registered
            let args = [
                "sellerPAN", // pan
                3 // rating
            ]
            await expect(invoicePlatform.addRating(...args)).to.be.revertedWith("InvalidTx")

            // register that seller
            args = [
                "sellerPAN", // pan
                "sellerName" // name
            ]
            await invoicePlatform.registerPerson(...args);

            // give rating
            args = [
                "sellerPAN", // pan
                3 // rating
            ]
            await invoicePlatform.addRating(...args);
            const person = await invoicePlatform.getPerson("sellerPAN");
            assert.equal(person.rating, 4, "rating should be 4")
        })
        it("should emit AddRating event", async() => {
            // register that seller
            args = [
                "sellerPAN", // pan
                "sellerName" // name
            ]
            await invoicePlatform.registerPerson(...args);

            // give rating
            args = [
                "sellerPAN", // pan
                3 // rating
            ]
            const addRatingTx = await invoicePlatform.addRating(...args);
            const addRatingReceipt = await addRatingTx.wait();
            expect(addRatingReceipt.events[0].event).to.equal("AddRating")
            
        })
    })

    describe("getImageURI", () => {
        it("should get the image URI", async() => {
            let imageUris = [
                'ipfs://QmZVusy75ueem2C7dwcv2htVziDFuXZ2rmp3qn7mrpbQxF',
                'ipfs://QmeBgDNBktQ4kBSEtcxuc8Dg4PVVJAcGpVPBKnLpDP1sDQ',
                'ipfs://QmWcwZud5HxJD1u2SuVuVijDHUPBbxBBkje46YW3o6QWiB'
            ]
            // should fail if rating is not between 0 and 5
            await expect(invoicePlatform._getImageURI(6)).to.be.revertedWith("InvalidRating")

            // console.log(await invoicePlatform._getImageURI(1))

            // check if the image URI is correct
            for (let i = 0; i <= 2; i++) {
                let imageURI = await invoicePlatform._getImageURI(i);
                assert.equal(imageURI, imageUris[0], "imageURI should be correct")
            }
            for (let i = 3; i <= 4; i++) {
                let imageURI = await invoicePlatform._getImageURI(i);
                assert.equal(imageURI, imageUris[1], "imageURI should be correct")
            }
            let imageUri = await invoicePlatform._getImageURI(5);
            assert.equal(imageUri, imageUris[2], "imageURI should be correct")
        })
    })

    describe("mintNft", () => {
        it("should mint an NFT when a person registers", async() => {
            await invoicePlatform.registerPerson("sellerPAN", "sellerName");

            // should fail if asked a NFT that is not minted
            await expect(invoicePlatform.tokenURI(0)).to.be.revertedWith("NftNotExist")

            // check if the NFT is minted properly by getting the tokenURI
            let tokendatabase64 = await invoicePlatform.tokenURI(1); 
            let token = Buffer.from(tokendatabase64.split(",")[1], 'base64').toString();
            token = JSON.parse(token);
            assert.equal(token.name, "InvoiceNFT", "name should be InvoiceNFT")
            assert.equal(token.description, "An NFT that changes based on the rating that a seller has.", "description should be correct")
            assert.equal((token.attributes.at(0)).value, "5", "rating should be 5")
        })
        it("should change it's imageURI when rating is changed", async() => {
            await invoicePlatform.registerPerson("sellerPAN", "sellerName");
            // initial rating is 5
            let tokendatabase64 = await invoicePlatform.tokenURI(1);
            let token = Buffer.from(tokendatabase64.split(",")[1], 'base64').toString();
            token = JSON.parse(token);
            assert.equal((token.attributes.at(0)).value, "5", "rating should be 5")

            await invoicePlatform.addRating("sellerPAN", 3);

            // check if the NFT is minted properly by getting the tokenURI
            tokendatabase64 = await invoicePlatform.tokenURI(1); 
            token = Buffer.from(tokendatabase64.split(",")[1], 'base64').toString();
            token = JSON.parse(token);
            assert.equal((token.attributes.at(0)).value, "4", "rating should be 4")
        })
    })
})