// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract ContractUtils {
    address internal owner;
    address[] internal adminList;
    mapping(address => bool) internal admins; // addresses which are allowed to call this contract

    uint256 latestEntityId = 1;

    struct Entity {
        string[] _keys;
        string[] _values;
    }

    struct IdInfo {
        mapping(uint256 => bool) used;
        uint256[] all;
    }

    struct EntityType {
        string id;
        mapping(uint256 => Entity) entities;
        IdInfo idInfo;
    }

    mapping(string => EntityType) private registeredEntities;

    constructor() {
        owner = msg.sender;
    }

    event EntityCreated(uint256 id);

    function addAdmin(address admin) public onlyOwner {
        admins[admin] = true;
        adminList.push(admin);
    }

    function clearAdmins() public onlyOwner {
        for (uint256 i = 0; i < adminList.length; i++) {
            admins[adminList[i]] = false;
        }
        delete adminList;
    }

    function create(
        string memory entityType,
        string[] memory keys,
        string[] memory values
    ) public onlyAdmin {
        uint256 id = getNewEntityId();
        _create(entityType, id, keys, values);
        emit EntityCreated(id);
    }

    function readOne(
        string memory entityType,
        uint256 id
    ) public view onlyAdmin returns (Entity memory) {
        return registeredEntities[entityType].entities[id];
    }

    function readAll(
        string memory entityType
    ) public view onlyAdmin returns (Entity[] memory) {
        Entity[] memory rtn = new Entity[](
            registeredEntities[entityType].idInfo.all.length
        );
        for (uint256 i = 0; i < rtn.length; i++) {
            rtn[i] = readOne(
                entityType,
                registeredEntities[entityType].idInfo.all[i]
            );
        }
        return rtn;
    }

    function deleteOne(
        string memory entityType,
        uint256 entityIdentifier
    ) public onlyAdmin {
        removeUintFromArrayMaintainOrder(
            registeredEntities[entityType].idInfo.all,
            entityIdentifier
        );
        registeredEntities[entityType].idInfo.used[entityIdentifier] = false;
        delete registeredEntities[entityType].entities[entityIdentifier];
    }

    /////////////////////PRIVATE////////////////////////////////
    function getNewEntityId() internal returns (uint256) {
        return latestEntityId++;
    }

    function _create(
        string memory entityType,
        uint256 entityIdentifier,
        string[] memory keys,
        string[] memory values
    ) private {
        registeredEntities[entityType]
            .entities[entityIdentifier]
            ._keys = new string[](keys.length);
        registeredEntities[entityType]
            .entities[entityIdentifier]
            ._values = new string[](values.length);
        for (uint256 i = 0; i < keys.length; i++) {
            registeredEntities[entityType].entities[entityIdentifier]._keys[
                    i
                ] = keys[i];
            registeredEntities[entityType].entities[entityIdentifier]._values[
                    i
                ] = values[i];
        }
        registeredEntities[entityType].idInfo.used[entityIdentifier] = true;
        registeredEntities[entityType].idInfo.all.push(entityIdentifier);
    }

    ///////////////////////////////ROLES

    struct RoleDetail {
        address[] addressArray;
        mapping(address => bool) boolMapping;
    }

    mapping(string => RoleDetail) roleDetails;

    // Grant or revoke role based on grant flag
    function toggleRole(
        address beneficiary,
        string memory role,
        bool grant
    ) public onlyAdmin {
        if (grant) {
            roleDetails[role].addressArray.push(beneficiary);
            roleDetails[role].boolMapping[beneficiary] = true;
        } else {
            removeAddressFromArrayMaintainOrder(
                roleDetails[role].addressArray,
                beneficiary
            );
            delete roleDetails[role].boolMapping[beneficiary];
        }
    }

    function allForRole(
        string memory name
    ) public view returns (address[] memory) {
        return roleDetails[name].addressArray;
    }

    function hasRole(
        string memory name,
        address user
    ) public view returns (bool) {
        return roleDetails[name].boolMapping[user];
    }

    modifier onlyRole(string memory name) {
        require(
            hasRole(name, msg.sender),
            string.concat(
                "You ",
                Strings.toHexString(uint160(msg.sender)),
                " lack the appropriate role to call this function: ",
                name
            )
        );
        _;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    modifier onlyAdmin() {
        require(
            admins[msg.sender] == true,
            "Only contract admin can call this function"
        );
        _;
    }

    // UTILITY
    function removeUintFromArrayMaintainOrder(
        uint256[] storage arr,
        uint256 val
    ) internal {
        for (uint256 i = 0; i < arr.length; i++) {
            if (val == arr[i]) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
    }

    function removeAddressFromArrayMaintainOrder(
        address[] storage arr,
        address val
    ) internal {
        for (uint256 i = 0; i < arr.length; i++) {
            if (val == arr[i]) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
    }

    function arrayContainsUint(
        uint256[] memory arr,
        uint256 val
    ) public pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                return true;
            }
        }
        return false;
    }

    function arrayContainsAddress(
        address[] memory arr,
        address val
    ) public pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                return true;
            }
        }
        return false;
    }

    function _isContract(address addr) public view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
