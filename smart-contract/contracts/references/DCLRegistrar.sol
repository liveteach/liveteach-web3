// SPDX-License-Identifier: MIT
// Since this is only being used for test I have mocked the contract
// with only the methods I require.
// This is due to having compatibility issues with 0.5.* versions of solidity in this project.
// Original contract here: https://etherscan.io/address/0x2a187453064356c898cae034eaed119e1663acb8#code

pragma solidity ^0.8.12;

contract DCLRegistrar {
    mapping(string => address) nameOwnerMapping;

    constructor() {}

    // not implemented in original contract
    function setOwnerOf(string memory _subdomain, address owner) public {
        nameOwnerMapping[_subdomain] = owner;
    }

    // implemented in original contract
    function getOwnerOf(
        string memory _subdomain
    ) external view returns (address) {
        return nameOwnerMapping[_subdomain];
    }
}
