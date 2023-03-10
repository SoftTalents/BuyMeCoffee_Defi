const hre = require('hardhat');
const abi = require('../artifacts/contracts/BuyMeCoffee.sol/BuyMeCoffee.json');

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contractABI = abi.abi;

    const provider = new hre.ethers.providers.AlchemyProvider('goerli', process.env.GOERLI_API_KEY);
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Instantiate connected contract
    const buyMeCoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    console.log(`current balance of owner: ${await getBalance(provider, signer.address)}ETH`);
    console.log(`current balance of contract: ${await getBalance(provider, buyMeCoffee.address)}Eth`);

    const contractBalance = await getBalance(provider, buyMeCoffee.address);
    if (contractBalance !== "0.0") {
        console.log('Withdrawing funds...');
        const withdrawTxn = await buyMeCoffee.withdrawTips();
        await withdrawTxn.wait();
    } else {
        console.log('no funds to withdraw!');
    }

    console.log(`current balance of owner: ${await getBalance(provider, signer.address)}Eth`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });