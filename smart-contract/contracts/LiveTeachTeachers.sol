// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract LiveTeachTeachers {
    address private owner;
    uint256 private latestClassConfigId = 0;

    RegisteredIds private registeredIds;
    IdsToObjects private idsToObjects;

    constructor() {
        owner = msg.sender;
    }

    struct ClassConfig {
        uint256 id;
        address teacher;
        string classReference;
        string contentUrl;
    }

    struct RegisteredIds {
        uint256[] classConfig;
        mapping(uint256 => bool) classConfigBool;
        mapping(address => uint256[]) teacherToClassConfigIds;
    }

    struct IdsToObjects {
        mapping(uint256 => ClassConfig) classConfig;
    }

    // Error messages
    string public constant ERR_OBJECT_ACCESS =
        "Object doesn't exist or you don't have access to it.";

    function getNewClassConfigId() private returns (uint256) {
        return latestClassConfigId++;
    }

    // create
    function createClassConfig(
        string memory _classReference,
        string memory _contentUrl
    ) public returns (uint256) {
        uint256 id = getNewClassConfigId();
        registerClassConfig(id, msg.sender, _classReference, _contentUrl);
        return id;
    }

    // read
    // Get all the ClassConfig objects associated with the calling teacher.
    function getClassConfigs() public view returns (ClassConfig[] memory) {
        uint256[] memory classConfigIds = registeredIds.teacherToClassConfigIds[
            msg.sender
        ];
        ClassConfig[] memory rtn = new ClassConfig[](classConfigIds.length);
        for (uint256 i = 0; i < classConfigIds.length; i++) {
            rtn[i] = idsToObjects.classConfig[classConfigIds[i]];
        }
        return rtn;
    }

    // Get a single ClassConfig object by id.
    // Must belong to the calling teacher.
    function getClassConfig(
        uint256 id
    ) public view returns (ClassConfig memory) {
        // class config should be registered to the calling teacher
        require(
            idsToObjects.classConfig[id].teacher == msg.sender,
            ERR_OBJECT_ACCESS
        );
        return idsToObjects.classConfig[id];
    }

    // update
    function updateClassConfig(
        uint256 id,
        string memory _classReference,
        string memory _contentUrl
    ) public {
        // class config should be registered to the calling teacher
        require(
            idsToObjects.classConfig[id].teacher == msg.sender,
            ERR_OBJECT_ACCESS
        );
        unregisterClassConfig(id);
        registerClassConfig(id, msg.sender, _classReference, _contentUrl);
    }

    // delete
    function deleteClassConfig(uint256 id) public {
        // class config should be registered to the calling teacher
        require(
            idsToObjects.classConfig[id].teacher == msg.sender,
            ERR_OBJECT_ACCESS
        );
        unregisterClassConfig(id);
    }

    // Export the data contained in this contract
    // Does not preserve contract owner
    // Ensure on import to determine latest id
    // Return values can be treated as an array in js
    // except when using ethers I have noticed that the returned object 
    // is `frozen` and cannot be used in an _import.
    // The workaround is to include this at the beginning of the calling 
    // js file:
    // `Object.freeze = function(obj) { return obj; };`  
    function export() public view onlyOwner returns (ClassConfig[] memory) {
        uint256 recordCount = (registeredIds.classConfig.length);
        ClassConfig[] memory rtn = new ClassConfig[](recordCount);
        for (uint256 i = 0; i < recordCount; i++) {
            rtn[i] = idsToObjects.classConfig[i];
        }

        return rtn;
    }

    // Destructive and assumes an empty contract
    // (in order to keep gas fees down).
    // See export notes if trying to call directly with
    // exported value.
    function _import(ClassConfig[] memory classConfigs) public onlyOwner {
        require(
            registeredIds.classConfig.length == 0,
            "Can only call _import on an empty contract"
        );
        // go through the input and create objects
        for (uint256 i = 0; i < classConfigs.length; i++) {
            ClassConfig memory classConfig = classConfigs[i];
            registerClassConfig(
                classConfig.id,
                classConfig.teacher,
                classConfig.classReference,
                classConfig.contentUrl
            );
            // keep id generation up to date
            if(classConfig.id > latestClassConfigId) {
                latestClassConfigId = classConfig.id;
            }
        }
    }

    //////////////////////////////PRIVATE/////////////////////////////////

    function registerClassConfig(
        uint256 _id,
        address teacher,
        string memory _classReference,
        string memory _contentUrl
    ) private {
        idsToObjects.classConfig[_id] = ClassConfig({
            id: _id,
            teacher: teacher,
            classReference: _classReference,
            contentUrl: _contentUrl
        });
        registeredIds.classConfig.push(_id);
        registeredIds.classConfigBool[_id] = true;
        registeredIds.teacherToClassConfigIds[msg.sender].push(_id);
    }

    function unregisterClassConfig(uint256 _id) private {
        removeUintFromArrayMaintainOrder(registeredIds.classConfig, _id);
        delete registeredIds.classConfigBool[_id];
        removeUintFromArrayMaintainOrder(
            registeredIds.teacherToClassConfigIds[msg.sender],
            _id
        );
    }

    // PRIVATE UTILITY
    function removeUintFromArrayMaintainOrder(
        uint256[] storage arr,
        uint256 val
    ) private {
        for (uint256 i = 0; i < arr.length; i++) {
            if (val == arr[i]) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}
