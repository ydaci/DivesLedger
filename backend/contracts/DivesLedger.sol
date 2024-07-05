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
        string diverSurname;
        string diverFirstName;
        string otherDiverNames; //Divers who accompany the diver
        string location;
        uint256 date; // Unix timestamp
        uint256 depth; // Depth in meters
        uint256 duration; // Duration in minutes
        string notes;
        bool validated;
    }

    struct Certification {
        uint256 certLevel; // Used to define which diver is an instructor
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

    /*************************************
    *              Events                *
    **************************************/

    event DiveAdded(uint256 id, address indexed diver, string diversSurnames, string diversFirstNames, string otherDiverNames, string location, uint256 date, uint256 depth, uint256 duration, string notes);
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
        require(isInstructor(msg.sender), "Only an instructor can perform this action.");
        _;
    }

    /*************************************
    *             Functions              *
    **************************************/
    //Pas le owner mais le plongeur décide de qui sera son instructeur. Le programme doit désigner s'il est bien autorisé. 
    //Faire différenciation entre mainDiver et accompagnants

    function addDive(
        string memory _location,
        string memory _diverSurname,
        string memory _diverFirstName,
        string memory _otherDiverNames,
        uint256 _date,
        uint256 _depth,
        uint256 _duration,
        string memory _notes
    ) public {
        dives[nextDiveId] = Dive({
            id: nextDiveId,
            diver: msg.sender,
            diverSurname: _diverSurname,
            diverFirstName: _diverFirstName,
            otherDiverNames: _otherDiverNames,
            location: _location,
            date: _date,
            depth: _depth,
            duration: _duration,
            notes: _notes,
            validated: false
        });

        diverDives[msg.sender].push(nextDiveId);

        emit DiveAdded(nextDiveId, msg.sender,_diverSurname, _diverFirstName, _otherDiverNames, _location, _date, _depth, _duration, _notes);

        nextDiveId++;
    }

    function validateDive(uint256 _id) public onlyInstructor {
        require(_id < nextDiveId, "Dive does not exist.");
        Dive storage dive = dives[_id];
        require(!dive.validated, "Dive is already validated.");

        dive.validated = true;

        _safeMint(dive.diver, _id); // Recording in blockchain at validation step (not add step). The diver mints the NFT (not the instructor)

        emit DiveValidated(_id, msg.sender);
    }

    function getCertificationName(uint256 _certLevel) public pure returns (string memory) {
        if (_certLevel == 1) return unicode"1. Diver 1 star / Open Water Diver";
        if (_certLevel == 2) return unicode"2. Diver 2 stars / Advanced Open Water Diver";
        if (_certLevel == 3) return unicode"3. Diver 3 stars / Rescue Diver";
        if (_certLevel == 4) return unicode"4. Confirmed diver / Divemaster";
        if (_certLevel == 5) return unicode"5. Instructor assistant";
        // minimum level to be considered as an instructor
        if (_certLevel == 6) return unicode"6. Instructor / Dive Leader";
        if (_certLevel == 7) return unicode"7. Instructor 2 stars";
        if (_certLevel == 8) return unicode"8. Instructor 3 stars";
        if (_certLevel == 9) return unicode"9. Instructor 4 stars";
        if (_certLevel == 10) return unicode"10. Instructor 5 stars";
        return "Unknown Certification";
    }
    
    function addCertification(
        address _diver,
        uint256 _certLevel,
        string memory _issuingOrganization,
        uint256 _issueDate
    ) public {
        diverCertifications[_diver].push(Certification({
            certLevel: _certLevel,
            certName: getCertificationName(_certLevel),
            issuingOrganization: _issuingOrganization,
            issueDate: _issueDate
        }));

        emit CertificationAdded(_diver, getCertificationName(_certLevel), _issuingOrganization, _issueDate);
    }
    
    // A diver with a certLevel >=6 (Dive Leader - Guide de palanqué) can be an instructor
    function isInstructor(address _diver) public view returns (bool) {
        Certification[] storage certifications = diverCertifications[_diver];
        for (uint256 i = 0; i < certifications.length; i++) {
            if (certifications[i].certLevel >= 6) {
                return true;
            }
        }
        return false;
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