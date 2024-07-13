const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of DivesLedger contract...");

  const divesLedger = await hre.ethers.deployContract("DivesLedger");

  await divesLedger.waitForDeployment();

  console.log(
    `DivesLedger deployed to ${divesLedger.target}`
    );
   }
runTests();

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Launch the hardhat tests
async function runTests() {
  console.log("Running automated tests...");

  await hre.run("test", {
    files: "test/DivesLedger.js"
  });

  console.log("Tests completed.");
}
