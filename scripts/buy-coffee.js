const hre = require("hardhat");

// Returns the Ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper}(${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get the example accounts we'll be working with
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyMeCoffee = await hre.ethers.getContractFactory("BuyMeCoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();

  // Deploy the contract
  await buyMeCoffee.deployed();
  console.log(
    `BuyMeCoffee deployed to ${buyMeCoffee.address}`
  );

  // Check balances before the coffee purchase
  const addresses = [owner.address, tipper.address, buyMeCoffee.address];
  await printBalances(addresses);

  // Buy the owner a few coffees
  const tip = {value: hre.ethers.utils.parseEther('1')};
  await buyMeCoffee.connect(tipper).buyCoffee('Carolina', "You're the best!", tip);
  
  // Check the balances after coffee purchase
  console.log('=== After Coffee Buy ===')
  await printBalances(addresses);

  // withdraw
  await buyMeCoffee.connect(owner).withdrawTips();

  // Check the balances after withdrawl
  console.log('=== after withdrawTips ===')
  await printBalances(addresses);

  // Show Memos
  console.log('=== Memos ===');
  const memos = await buyMeCoffee.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });