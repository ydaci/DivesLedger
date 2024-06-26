// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DivesLedger is Ownable {
//Variables et fonctions à définir
struct Plongeur {
    address addresse;
    string nom;
    string prenom;
    Certification certification;
}

struct Certification {
    string nom;
    uint256 anneeObtention;
}

struct Performance {
    string lieu;
    uint256 date;
}
constructor() Ownable(msg.sender) {    }

//Renvoyer les certifications d'un plongeur
//Renvoyer les performances d'un plongeur
//Définir si un plongeur a le droit d'aller sur telle ou telle épreuve


}