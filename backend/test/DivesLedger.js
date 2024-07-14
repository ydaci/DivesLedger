const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect, BigNumber } = require("chai");   
  const { ethers } = require("hardhat");
  describe.only("DivesLedger", function () {

    async function deployDivesLedger() {

        const [owner, instructor, nonInstructor, diver, addr1] = await ethers.getSigners();
    
        const DivesLedger = await ethers.getContractFactory("DivesLedger");
        const divesLedger = await DivesLedger.deploy();
    
        return { divesLedger , owner, instructor, nonInstructor, diver, addr1 };
      }
      //On ne peut pas ajouter 2 fois un insctructeur
      describe("Deployment", function () {
        //Instructors section
        describe("Instructors management", function () {
            it("Should return false if a diver has no certification", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);
                const isInstructor = await divesLedger.isInstructor(owner.address);
                expect(isInstructor).to.equal(false);       
            });
            it("Should return false if a diver has certifications below level 6", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);
                await divesLedger.addCertification(1 , "Organization", 1720104021);
                await divesLedger.addCertification(2 , "Organization", 1720104021);
                const isInstructor = await divesLedger.isInstructor(owner.address);
                expect(isInstructor).to.equal(false);          
            });
            it("Should return true if a diver has at least a certification level above level 6", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);
                await divesLedger.addCertification(6, "Organization", 1720104021);
                await divesLedger.addCertification(7, "Organization", 1720104021);
                
                const isInstructor = await divesLedger.isInstructor(owner.address);
                expect(isInstructor).to.equal(true);          
            });
            it("Should return true if a diver has a certification level above level 6 and another below 6", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);
                await divesLedger.addCertification(3, "Organization", 1720104021);
                await divesLedger.addCertification(7, "Organization", 1720104021);
                
                const isInstructor = await divesLedger.isInstructor(owner.address);
                expect(isInstructor).to.equal(true);          
            });
        });

        //Dives section
        describe("Dives management", function () {
           it("Should add a dive correctly", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);

                const location = "Tahiti";
                const surname = "Smith";
                const firstName = "Tom";
                const otherName = "Arnold Schwarzenneger"
                const date = 1672531199;
                const depth = 30;
                const duration = 45;
                const notes = "Blue Sea";
          
                // Add a dive
                await divesLedger.addDive(location, surname, firstName, otherName, date, depth, duration, notes);
          
                // Get dives by owner
                const dives = await divesLedger.getDivesByDiver(owner.address);
                expect(dives.length).to.equal(1);
          
                const dive = dives[0];
                expect(dive.location).to.equal(location);
                expect(dive.diverSurname).to.equal(surname);
                expect(dive.diverFirstName).to.equal(firstName);
                expect(dive.otherDiverNames).to.equal(otherName);
                expect(dive.date).to.equal(date);
                expect(dive.depth).to.equal(depth);
                expect(dive.duration).to.equal(duration);
                expect(dive.notes).to.equal(notes);
                expect(dive.validated).to.equal(false);
            });
            it("Should add multiple dives correctly with the same diver", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);
            
                const diveData = [
                    { location: "Tahiti", diverSurname: "Smith", diverFirstName: "Tom", otherDiverNames:"Bruce Willlis", date: 1672531199, depth: 30, duration: 45, notes: "Blue Sea" },
                    { location: "Bali", diverSurname: "Doe", diverFirstName: "Jane",otherDiverNames:"Jet Li", date: 1672531299, depth: 25, duration: 50, notes: "Coral Reef" }
                ];
            
                for (let dive of diveData) {
                    await divesLedger.addDive(dive.location, dive.diverSurname, dive.diverFirstName,dive.otherDiverNames, dive.date, dive.depth, dive.duration, dive.notes);
                }
            
                const dives = await divesLedger.getDivesByDiver(owner.address);
                expect(dives.length).to.equal(2);
                expect(dives[0].location).to.equal(diveData[0].location);
                expect(dives[1].location).to.equal(diveData[1].location);
            });
            it("Should emit the DiveAdded event after adding a dive", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);

                const location = "Tahiti";
                const surname = "Smith";
                const firstName = "Tom";
                const otherName = "Harrison Ford"
                const date = 1672531199;
                const depth = 30;
                const duration = 45;
                const notes = "Blue Sea";
          
                // Add a dive and check the emission of the event
                await expect(divesLedger.connect(diver).addDive(location, surname, firstName, otherName, date, depth, duration, notes))
                .to.emit(divesLedger, "DiveAdded")
                .withArgs(0, diver.address, surname, firstName, otherName, location, date, depth, duration, notes);
                
            });
            it("Should return an empty list if no dives", async function () {
                // Get dives for an address with no dives
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);
                const dives = await divesLedger.getDivesByDiver(diver.address);
                expect(dives.length).to.equal(0);
            });  
            it("Only the instructor can validate a dive", async function () {
                const { divesLedger, nonInstructor } = await loadFixture(deployDivesLedger);
                //1 is an example of an id value
                expect(divesLedger.connect(nonInstructor).validateDive(1)).to.be.revertedWith("Only owner can call this function");        
            }); 
            it("Should revert if trying to validate a non-existent dive", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);
                await divesLedger.addCertification(6 , "Organization", 1720104021);
                
               await expect(divesLedger.connect(owner).validateDive(999))
                    .to.be.revertedWith("Dive does not exist.");
            });
            it("Should validate a dive and emit DiveValidated event", async function () {
                const { divesLedger, diver, instructor } = await loadFixture(deployDivesLedger);
                // Add a dive by the diver
                await divesLedger.connect(diver).addDive("Tahiti", "Smith", "Tom", "Jo-Wilfried Tsonga", Math.floor(Date.now() / 1000), 30, 60, "Blue sea");

                // Add instructor as an instructor
                await divesLedger.connect(instructor).addCertification(6 , "Organization", 1720104021);
            
                // Validate the dive by the instructor
               await expect(divesLedger.connect(instructor).validateDive(0))
                  .to.emit(divesLedger, "DiveValidated")
                  .withArgs(0, instructor.address);
            
                // Check if the dive is marked as validated
                const dive = await divesLedger.getDive(0);
                expect(dive.validated).to.be.true;
              });
            it("Should revert if trying to validate an already validated dive", async function () {
                const { divesLedger, diver, instructor } = await loadFixture(deployDivesLedger);
                
                // Add a dive by the diver
                await divesLedger.connect(diver).addDive("Tahiti", "Smith", "Tom", "Richard Gasquet", Math.floor(Date.now() / 1000), 30, 60, "Blue sea");

                // Add instructor as an instructor
                await divesLedger.connect(instructor).addCertification(6 , "Organization", 1720104021);
            
                // Validate the dive by the instructor
                await divesLedger.connect(instructor).validateDive(0);
            
                // Try to validate the same dive again and expect it to revert
                await expect(divesLedger.connect(instructor).validateDive(0))
                  .to.be.revertedWith("Dive is already validated.");
            });
            it("Should return the current dive ID", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);

                // Now getCurrentDiveId must be equal to 0
                expect(await divesLedger.getCurrentDiveId()).to.equal(0);
        
                 // Add a dive by the diver
                 await divesLedger.connect(diver).addDive("Tahiti", "Smith", "Tom", "Richard Gasquet", Math.floor(Date.now() / 1000), 30, 60, "Blue sea");
        
                // Now getCurrentDiveId must have been incremented
                expect(await divesLedger.getCurrentDiveId()).to.equal(1);
            });
        });
        //Certifications management
        describe("Certifications management", function () {
            it("Should return the correct certification name for level 1", async function () {
                const { divesLedger } = await loadFixture(deployDivesLedger);                
                expect(await divesLedger.getCertificationName(1)).to.equal("1. Diver 1 star / Open Water Diver");
            });
            it("Should return the correct certification name for level 6", async function () {
                const { divesLedger } = await loadFixture(deployDivesLedger);                
                expect(await divesLedger.getCertificationName(6)).to.equal("6. Instructor / Dive Leader");
            });
            it("Should return 'Unknown Certification' for an invalid level", async function () {
                const { divesLedger } = await loadFixture(deployDivesLedger);                
                expect(await divesLedger.getCertificationName(0)).to.equal("Unknown Certification");
                expect(await divesLedger.getCertificationName(99)).to.equal("Unknown Certification");
            });
            it("should return an empty array if no certifications exist for the diver", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);                
                const certifications = await divesLedger.getCertifications(diver.address);
                expect(certifications.length).to.equal(0);
            });
           it("Should add a certification", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);
                const certLevel = 1;
                const issuingOrganization = "PADI";
                const issueDate = Math.floor(Date.now() / 1000); // current timestamp in seconds
            
                await expect(
                    divesLedger.connect(diver).addCertification(certLevel, issuingOrganization, issueDate)
                )
                  .to.emit(divesLedger, "CertificationAdded")
                  .withArgs(diver.address, "1. Diver 1 star / Open Water Diver", issuingOrganization, issueDate);
            
                const certifications = await divesLedger.getCertifications(diver.address);
                expect(certifications.length).to.equal(1);
                expect(certifications[0].certLevel).to.equal(certLevel);
                expect(certifications[0].certName).to.equal("1. Diver 1 star / Open Water Diver");
                expect(certifications[0].issuingOrganization).to.equal(issuingOrganization);
                expect(certifications[0].issueDate).to.equal(issueDate);
            });
            it("Should return the correct certification name for different levels", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);
                
                const certLevel1 = 1;
                const certLevel2 = 2;
                
                expect(await divesLedger.getCertificationName(certLevel1)).to.equal("1. Diver 1 star / Open Water Diver");
                expect(await divesLedger.getCertificationName(certLevel2)).to.equal("2. Diver 2 stars / Advanced Open Water Diver");
            });
            it("Should add multiple certifications correctly", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);
            
                const certData = [
                    { level: 1, org: "PADI", date: Math.floor(Date.now() / 1000) },
                    { level: 2, org: "NAUI", date: Math.floor(Date.now() / 1000) }
                ];
            
                for (let cert of certData) {
                    await divesLedger.connect(diver).addCertification(cert.level, cert.org, cert.date);
                }
            
                const certifications = await divesLedger.getCertifications(diver.address);
                expect(certifications.length).to.equal(2);
                expect(certifications[0].certLevel).to.equal(certData[0].level);
                expect(certifications[1].certLevel).to.equal(certData[1].level);
            });
            it("Should not allow adding a duplicate certification", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);
                const certLevel = 1;
                const issuingOrganization = "PADI";
                const issueDate = Math.floor(Date.now() / 1000); // current timestamp in seconds
        
                await divesLedger.connect(diver).addCertification(certLevel, issuingOrganization, issueDate);
        
                // Attempt to add the same certification again
                await expect(
                    divesLedger.connect(diver).addCertification(certLevel, issuingOrganization, issueDate)
                ).to.be.revertedWith("Certification with the same level already exists for this diver.");
        
                const certifications = await divesLedger.getCertifications(diver.address);
                expect(certifications.length).to.equal(1); // Should still be 1
            });
        });
        describe("Mint management", function () {
            it("Should not allow non-owners to mint a new token", async function () {
                const { divesLedger, diver, addr1 } = await loadFixture(deployDivesLedger);
                await expect(divesLedger.connect(diver).safeMint(addr1.address, 1)).to.be.revertedWithCustomError(divesLedger, "OwnableUnauthorizedAccount");
            });
            it("Should allow the owner to mint a new token", async function () {
                const { divesLedger, addr1 } = await loadFixture(deployDivesLedger);
                await divesLedger.safeMint(addr1.address, 1);
                expect(await divesLedger.ownerOf(1)).to.equal(addr1.address);
            });
            it("Should correctly assign the token ID to the recipient", async function () {
                const { divesLedger, addr1 } = await loadFixture(deployDivesLedger);
                await divesLedger.safeMint(addr1.address, 1);
                const ownerOfToken = await divesLedger.ownerOf(1);
                expect(ownerOfToken).to.equal(addr1.address);
            });
        });
    });
  });