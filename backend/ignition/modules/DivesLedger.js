const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DivesLedgerModule", (m) => {
  try {
    const divesLedger = m.contract("DivesLedger");
    return { divesLedger };
  } catch (error) {
    console.error("An error occurred while deploying the contract:", error);
    throw error;
  }
});
