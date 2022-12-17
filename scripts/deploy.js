// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const BuyMeCoffee = await hre.ethers.getContractFactory("BuyMeCoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();

  // Deploy the contract
  await buyMeCoffee.deployed();
  console.log(
    `BuyMeCoffee deployed to ${buyMeCoffee.address}`
  );

  const data = {
    address: buyMeCoffee.address,
    abi: JSON.parse(buyMeCoffee.interface.format('json'))
  }

  const dir = './client/utils';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
  fs.writeFileSync('./client/utils/BuyMeCoffee.json', JSON.stringify(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
