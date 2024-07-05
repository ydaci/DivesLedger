const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DivesLedgerModule", (m) => {

  const divesLedger = m.contract("DivesLedger");

  return { divesLedger };
});
