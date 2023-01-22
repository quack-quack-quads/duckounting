const {ethers} =    require("ethers");

let a = "123000000000000000"
// a is in wei
// convert to ether
let b = ethers.utils.formatEther(a)
console.log(b)