// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DivesLedger is ERC721, Ownable {

    /*************************************
    *              Structs               *
    **************************************/

    struct Dive {
        uint256 id;
        address diver;
        string location;
        uint256 date; // Unix timestamp
        uint256 depth; // Depth in meters
        uint256 duration; // Duration in minutes
        string notes;
        bool validated;
    }

    struct Certification {
        string certName;
        string issuingOrganization;
        uint256 issueDate; // Unix timestamp
    }

    /*************************************
    *             Variables              *
    **************************************/

    uint256 public nextDiveId;
    mapping(uint256 => Dive) public dives;
    mapping(address => uint256[]) public diverDives;
    mapping(address => Certification[]) public diverCertifications;
    mapping(address => bool) public instructors;

    /*************************************
    *              Events                *
    **************************************/

    event DiveAdded(uint256 id, address indexed diver, string location, uint256 date, uint256 depth, uint256 duration, string notes);
    event DiveValidated(uint256 id, address indexed instructor);
    event CertificationAdded(address indexed diver, string certName, string issuingOrganization, uint256 issueDate);

    /*************************************
    *             Constructor            *
    **************************************/

    constructor()
        ERC721("DivesLedger", "DLG")
        Ownable(msg.sender)
    { }

    /*************************************
    *             Modifiers              *
    **************************************/

     modifier onlyInstructor() {
        require(instructors[msg.sender], "Only an instructor can perform this action.");
        _;
    }

    /*************************************
    *             Functions              *
    **************************************/

    function addInstructor(address _instructor) external onlyOwner {
        require(instructors[_instructor]==false , "The instructor is already registered.");
        instructors[_instructor] = true;
    }

    function removeInstructor(address _instructor) external onlyOwner {
        require(instructors[_instructor]==true , "The address is not registered as an instructor.");
        instructors[_instructor] = false;
    }

    function addDive(
        string memory _location,
        uint256 _date,
        uint256 _depth,
        uint256 _duration,
        string memory _notes
    ) public {
        dives[nextDiveId] = Dive({
            id: nextDiveId,
            diver: msg.sender,
            location: _location,
            date: _date,
            depth: _depth,
            duration: _duration,
            notes: _notes,
            validated: false
        });

        diverDives[msg.sender].push(nextDiveId);

        _safeMint(msg.sender, nextDiveId);

        emit DiveAdded(nextDiveId, msg.sender, _location, _date, _depth, _duration, _notes);

        nextDiveId++;
    }

    function validateDive(uint256 _id) public onlyInstructor {
        require(_id >= 0 && _id <= nextDiveId, "Dive does not exist.");
        Dive storage dive = dives[_id];
        require(!dive.validated, "Dive is already validated.");

        dive.validated = true;

        emit DiveValidated(_id, msg.sender);
    }

    function addCertification(
        address _diver,
        string memory _certName,
        string memory _issuingOrganization,
        uint256 _issueDate
    ) public onlyInstructor {
        diverCertifications[_diver].push(Certification({
            certName: _certName,
            issuingOrganization: _issuingOrganization,
            issueDate: _issueDate
        }));

        emit CertificationAdded(_diver, _certName, _issuingOrganization, _issueDate);
    }

    function getCertifications(address _diver) public view returns (Certification[] memory) {
        return diverCertifications[_diver];
    }

    function getDive(uint256 _id) public view returns (Dive memory) {
        require(_id >= 0 && _id <= nextDiveId, "Dive does not exist.");
        return dives[_id];
    }

    function getDivesByDiver(address _diver) public view returns (Dive[] memory) {
        uint256[] memory diveIds = diverDives[_diver];
        Dive[] memory diverDiveList = new Dive[](diveIds.length);
        for (uint256 i = 0; i < diveIds.length; i++) {
            diverDiveList[i] = dives[diveIds[i]];
        }
        return diverDiveList;
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}