const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of DivesLedger contract...");

  const divesLedger = await hre.ethers.deployContract("DivesLedger");

  await divesLedger.waitForDeployment();

  console.log(
    `DivesLedger deployed to ${divesLedger.target}`
    );
   }
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
