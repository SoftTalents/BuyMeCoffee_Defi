# Buy Me Coffee DApp

This project demonstrates How to buy coffee to contract owner.

For simple test purpose on console, run below command.
```shell
npx hardhat run scripts/buy-coffee.js
npx hardhat run scripts/withdraw.js
```

To deploy, run below command
```shell
npx hardhat run scripts/deploy.js
```

Goerli deploy is below.
```shell
npx hardhat run scripts/deploy.js --network goerli
```

To deploy on polygon mumbai test net, run the following command.
```shell
npx hardhat run --network mumbai scripts/deploy.js --show-stack-traces
```

To see website, run the following command.
```shell
cd client && npm run dev
```