const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect, BigNumber } = require("chai");   
  const { ethers } = require("hardhat");
//Test 1 : vérifier si une plongée a été ajoutée correctement
//Test 2 : vérifier si et seulement si en tant qu'instructeur, je peux valider une plongée
//Test 3 : vérifier si on peut ajouter correctement une certification
//Test 4 : vérifier si les certifications d'un plongeur sont renvoyées correctement
//Test 5 : vérifier si on peut récupérer correctement une plongée
//Test 6 : vérifier si on peut récupérer correctement les plongées d'un utilisateur
//Test 7 : vérifier si on peut minter correctement
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
            it("Only the owner can add an instructor", async function () {
                const { divesLedger, instructor, diver } = await loadFixture(deployDivesLedger);
                expect(divesLedger.connect(diver).addInstructor(instructor.address)).to.be.revertedWith("Only owner can call this function");        
            });
            //Add tests
            it("Register an address as an instructor", async function () {
                const { divesLedger, owner, instructor } = await loadFixture(deployDivesLedger);
                // Add addr1 as an instructor
                await divesLedger.connect(owner).addInstructor(instructor.address);

                expect(await divesLedger.instructors(instructor.address)).to.equal(true);
            });
            it("Should revert if the instructor is already registered", async function () {
                const { divesLedger, instructor } = await loadFixture(deployDivesLedger);
                // Add addr1 as an instructor
                await divesLedger.addInstructor(instructor.address);
            
                // Try to add the same instructor again and expect it to revert
                await expect(divesLedger.addInstructor(instructor.address)).to.be.revertedWith("The instructor is already registered.");
            });
            //Remove tests
            it("Should revert if an address is not registered as an instructor", async function () {
                const { divesLedger, nonInstructor } = await loadFixture(deployDivesLedger);
                // Try to remove addr1 which is not an instructor and expect it to revert
                await expect(divesLedger.removeInstructor(nonInstructor.address)).to.be.revertedWith("The address is not registered as an instructor.");
            });
            it("Should remove an instructor", async function () {
                const { divesLedger, instructor } = await loadFixture(deployDivesLedger);
                // Add addr1 as an instructor
                await divesLedger.addInstructor(instructor.address);
                
                // Remove addr1 as an instructor
                await divesLedger.removeInstructor(instructor.address);
                
                // Check if addr1 is no longer an instructor
                expect(await divesLedger.instructors(instructor.address)).to.equal(false);
              });
              it("Should revert if not called by the owner", async function () {
                const { divesLedger, instructor } = await loadFixture(deployDivesLedger);
                expect(divesLedger.connect(instructor).removeInstructor(instructor.address)).to.be.revertedWith("Only owner can call this function");        
              });
        });

        //Dives section
        //Vérifier l'ajout, vérifier si on est bien sur le nextDiveId, vérifier si l'événement est bien émis
        describe("Dives management", function () {
            it("Should add a dive correctly", async function () {
                const { divesLedger, owner } = await loadFixture(deployDivesLedger);

                const location = "Tahiti";
                const date = 1672531199;
                const depth = 30;
                const duration = 45;
                const notes = "Blue Sea";
          
                // Add a dive
                await divesLedger.addDive(location, date, depth, duration, notes);
          
                // Get dives by owner
                const dives = await divesLedger.getDivesByDiver(owner.address);
                expect(dives.length).to.equal(1);
          
                const dive = dives[0];
                expect(dive.location).to.equal(location);
                expect(dive.date).to.equal(date);
                expect(dive.depth).to.equal(depth);
                expect(dive.duration).to.equal(duration);
                expect(dive.notes).to.equal(notes);
                expect(dive.validated).to.equal(false);
            });
            //A réfléchir
            it("Should add a dive for a different diver", async function () {
                const { divesLedger, diver, addr1 } = await loadFixture(deployDivesLedger);

                const location = "Tahiti";
                const date = 1672531199;
                const depth = 30;
                const duration = 45;
                const notes = "Blue Sea";
              
                // Add a dive from a different address
                await divesLedger.connect(addr1).addDive(location, date, depth, duration, notes);
              
                // Get dives by addr1
                const dives = await divesLedger.getDivesByDiver(addr1.address);
                expect(dives.length).to.equal(1);
              
                const dive = dives[0];
                expect(dive.location).to.equal(location);
                expect(dive.date).to.equal(date);
                expect(dive.depth).to.equal(depth);
                expect(dive.duration).to.equal(duration);
                expect(dive.notes).to.equal(notes);
                expect(dive.validated).to.equal(false);
            });
            it("Should emit the DiveAdded event after adding a dive", async function () {
                const { divesLedger, diver } = await loadFixture(deployDivesLedger);

                const location = "Tahiti";
                const date = 1672531199;
                const depth = 30;
                const duration = 45;
                const notes = "Blue Sea";
          
                // Add a dive and check the emission of the event
                await expect(divesLedger.connect(diver).addDive(location, date, depth, duration, notes))
                .to.emit(divesLedger, "DiveAdded")
                .withArgs(0, diver.address, location, date, depth, duration, notes);
                
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
                const { divesLedger, owner, instructor } = await loadFixture(deployDivesLedger);
                // Add instructor as an instructor
                await divesLedger.connect(owner).addInstructor(instructor.address);
                
               await expect(divesLedger.connect(instructor).validateDive(999))
                    .to.be.revertedWith("Dive does not exist.");
            });
            it("Should validate a dive and emit DiveValidated event", async function () {
                const { divesLedger, diver, instructor, owner } = await loadFixture(deployDivesLedger);
                // Add a dive by the diver
                await divesLedger.connect(diver).addDive("Tahiti", Math.floor(Date.now() / 1000), 30, 60, "Blue sea");

                // Add instructor as an instructor
                await divesLedger.connect(owner).addInstructor(instructor.address);
            
                // Validate the dive by the instructor
               await expect(divesLedger.connect(instructor).validateDive(0))
                  .to.emit(divesLedger, "DiveValidated")
                  .withArgs(0, instructor.address);
            
                // Check if the dive is marked as validated
                const dive = await divesLedger.getDive(0);
                expect(dive.validated).to.be.true;
              });
            it("Should revert if trying to validate an already validated dive", async function () {
                const { divesLedger, owner, diver, instructor } = await loadFixture(deployDivesLedger);
                
                // Add a dive by the diver
                await divesLedger.connect(diver).addDive("Tahiti", Math.floor(Date.now() / 1000), 30, 60, "Blue sea");

                // Add instructor as an instructor
                await divesLedger.connect(owner).addInstructor(instructor.address);
            
                // Validate the dive by the instructor
                await divesLedger.connect(instructor).validateDive(0);
            
                // Try to validate the same dive again and expect it to revert
                await expect(divesLedger.connect(instructor).validateDive(0))
                  .to.be.revertedWith("Dive is already validated.");
            });
        });
        //Certifications management
        describe("Certifications management", function () {
            it("Only an instructor can add a certification", async function () {
                const { divesLedger, nonInstructor, diver } = await loadFixture(deployDivesLedger);
                const certName = "Advanced Diver";
                const issuingOrganization = "PADI";
                const issueDate = Math.floor(Date.now() / 1000);
            
                // Try to add a certification by a non-instructor and expect it to revert
                await expect(divesLedger.connect(nonInstructor).addCertification(diver.address, certName, issuingOrganization, issueDate))
                  .to.be.revertedWith("Only an instructor can perform this action.");
            });
            it("Should add a certification and emit CertificationAdded event", async function () {
                const { divesLedger, owner, instructor, diver } = await loadFixture(deployDivesLedger);
                const certName = "Advanced Diver";
                const issuingOrganization = "PADI";
                const issueDate = Math.floor(Date.now() / 1000);

                // Add instructor as an instructor
                await divesLedger.connect(owner).addInstructor(instructor.address);
        
                // Add a certification by the instructor
                await expect(divesLedger.connect(instructor).addCertification(diver.address, certName, issuingOrganization, issueDate))
                .to.emit(divesLedger, "CertificationAdded")
                .withArgs(diver.address, certName, issuingOrganization, issueDate);
        
                // Check if the certification is added correctly
                const certifications = await divesLedger.getCertifications(diver.address);
                expect(certifications.length).to.equal(1);
                expect(certifications[0].certName).to.equal(certName);
                expect(certifications[0].issuingOrganization).to.equal(issuingOrganization);
                expect(certifications[0].issueDate).to.equal(issueDate);
            });
            it("Should get the correct certifications for a diver", async function () {
                const { divesLedger, owner, instructor, diver } = await loadFixture(deployDivesLedger);
                const certName1 = "Advanced Diver";
                const issuingOrganization1 = "PADI";
                const issueDate1 = Math.floor(Date.now() / 1000);
        
                const certName2 = "Rescue Diver";
                const issuingOrganization2 = "NAUI";
                const issueDate2 = Math.floor(Date.now() / 1000) - 10000;

                // Add instructor as an instructor
                await divesLedger.connect(owner).addInstructor(instructor.address);
        
                // Add certifications by the instructor
                await divesLedger.connect(instructor).addCertification(diver.address, certName1, issuingOrganization1, issueDate1);
                await divesLedger.connect(instructor).addCertification(diver.address, certName2, issuingOrganization2, issueDate2);
        
                // Check if the certifications are added correctly
                const certifications = await divesLedger.getCertifications(diver.address);
                expect(certifications.length).to.equal(2);
        
                expect(certifications[0].certName).to.equal(certName1);
                expect(certifications[0].issuingOrganization).to.equal(issuingOrganization1);
                expect(certifications[0].issueDate).to.equal(issueDate1);
        
                expect(certifications[1].certName).to.equal(certName2);
                expect(certifications[1].issuingOrganization).to.equal(issuingOrganization2);
                expect(certifications[1].issueDate).to.equal(issueDate2);
            });
        });
    });
  });