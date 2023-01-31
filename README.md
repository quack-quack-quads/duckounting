
# Duckounting

### Our Website : https://duckounting.netlify.app/
### Smart Contract : https://goerli.etherscan.io/address/0xFD912A1e39D08a2c159a5D12954Bb62e78226A25#code

## By team Quack Quack Quad 

Invoice management is a major part of accounting in businesses both big and small. But all the existing software in this field lack in one aspect – transparency. 

We attempt to solve this problem by moving the entire process to the blockchain and the world of Web3. When invoices are generated and maintained on the chain, they become a part of a detailed ledger which makes this process transparent like never before. 

We also try to provide Web3 solutions for other problems in the field of accounting such as irregular payments and lack of credibility when working with new business partners. 



## Installation
## Starting the backend server
Start a terminal in the server folder and install all the node modules by running yarn install. 

```bash
    cd server
    yarn install
```
Now, run the command yarn hardhat node to start the server 

```bash
    yarn hardhat node
```

Now import one of the accounts from the local blockchain server into your MetaMask wallet 
and copy the RPC URL. You can find it highlighted in green colour on the terminal.

```bash
    
    Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545 
    
```
Update the RPC URL and enter the chain id as 31337 in your meta mask wallet in localhost:8545 network

Import one of the accounts provided by the hardhat local node into your meta mask. After importing you should see 10,000 ETH added to your wallet in the localhost network


## Starting the client server

Go to the client folder and install the node modules by running npm install

```bash
    cd client
    npm install
```

Now, you can open the website at localhost:3000 on your browser.



    
## Our Website

## Home Page
On opening the URL, you will be greeted by our home page.  
Our home page features a prominent hero section with a 3D interactive model of our 
website’s mascot. We have sections dedicated to Web3 literacy where we inform our users 
how decentralisation of computing can help them maintain transparency in their 
transactions. 
To login, click on the CONNECT WALLET button on the top right and enter your name and 
PAN number on the prompt. This will be followed by a prompt from MetaMask which you 
have to approve.  
Now, you will see your wallet address on the top right and you will be redirected to the 
Duckboard. 


![Home Page](https://github.com/quack-quack-quads/duckounting/blob/main/app-snapshots/home.png)

## Duckboard
This is the control section of the application. You view the details you logged in with and the 
NFT you earned for being an awesome user. You can directly jump into action by creating 
an invoice or by view your past invoices.

![Duck Board](https://github.com/quack-quack-quads/duckounting/blob/main/app-snapshots/profile.png)

## CREATE INVOICE 

This is the tool you’ll be using to create invoices and deploy them on the blockchain. Just key 
in the relevant details and you are good to go. The invoice amount can be entered in any 
denomination you feel like – the platform converts it to ETH. You can upload proof 

![Create Invoice](https://github.com/quack-quack-quads/duckounting/blob/main/app-snapshots/createinv.png)

## TRANSACTION HISTORY 

This is where you’ll find your past transactions. You can sort them, filter them and search using 
keywords. 

![Create Invoice](https://github.com/quack-quack-quads/duckounting/blob/main/app-snapshots/transactionhistory.png)

## Invoice Display

You can find all pertinent details here, with the additional option of settling the payment. You 
can also look up the other party with a single click. 
 

![Invoice ](https://github.com/quack-quack-quads/duckounting/blob/main/app-snapshots/invoice.png)

## User Lookup

Supports lookup using Wallet Address, PAN and ENS Address.

![Lookup ](https://github.com/quack-quack-quads/duckounting/blob/main/app-snapshots/otherboard.png)



