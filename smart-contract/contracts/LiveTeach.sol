// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

interface IContractUtils {
    function toggleRole(
        address beneficiary,
        string memory role,
        bool grant
    ) external;

    function hasRole(
        string memory name,
        address user
    ) external view returns (bool);

    function allForRole(
        string memory name
    ) external view returns (address[] memory);

    function arrayContainsUint(
        uint256[] memory arr,
        uint256 val
    ) external pure returns (bool);

    function arrayContainsAddress(
        address[] memory arr,
        address val
    ) external pure returns (bool);

    function _isContract(address addr) external view returns (bool);
}

interface ILANDRegistry {
    function encodeTokenId(int x, int y) external pure returns (uint256);

    function decodeTokenId(uint value) external pure returns (int, int);

    function isApprovedForAll(
        address assetHolder,
        address operator
    ) external view returns (bool);

    function isAuthorized(
        address operator,
        uint256 assetId
    ) external view returns (bool);

    function updateOperator(uint256 input) external view returns (address);
}

interface IDCLRegistrar {
    function getOwnerOf(
        string memory _subdomain
    ) external view returns (address);
}

contract LiveTeach {
    IContractUtils private contractUtils;
    string constant teacherRole = "TEACHER";
    string constant classroomAdminRole = "CLASSROOM_ADMIN";
    uint256 private latestClassroomId;

    address private owner;

    uint256[] private emptyUintList;
    address[] private emptyAddressList;
    int[][] private emptyIntList;

    function setContractUtils(address contractUtilsAddress) public onlyOwner {
        contractUtils = IContractUtils(contractUtilsAddress);
    }

    function setDCLRegistrar(address _registrar) public onlyOwner {
        require(
            contractUtils._isContract(_registrar),
            "DCL Registrar not a contract"
        );
        dclRegistrar = IDCLRegistrar(_registrar);
    }

    constructor() {
        owner = msg.sender;
        latestClassroomId = 1;
    }

    // id generators, start at one so we can determine unassigned.
    function getNewClassroomId() private returns (uint256) {
        return latestClassroomId++;
    }

    // structs
    struct Land {
        uint256 id;
        address classroomAdminId;
        uint256 classroomId;
    }

    struct ClassroomAdmin {
        address walletAddress;
        uint256[] landIds;
        string world;
        int[][] landCoordinates; // not persisted
        uint256[] classroomIds;
        address[] teacherIds;
    }

    struct Classroom {
        uint256 id;
        string name;
        string world;
        uint256[] landIds;
        int[][] landCoordinates; // not persisted
        address classroomAdminId;
        address[] teacherIds;
        string guid;
        string configUrl;
    }

    struct Teacher {
        address walletAddress;
        uint256[] classroomIds;
        address[] classroomAdminIds;
    }

    struct RegisteredIds {
        uint256[] landsRegisteredToClassroomAdmin;
        mapping(uint256 => bool) landsRegisteredToClassroomAdminBool;
        uint256[] classroom;
        mapping(uint256 => bool) classroomBool;
        uint256[] landsRegisteredToClassroom;
        mapping(uint256 => bool) landsRegisteredToClassroomBool;
        mapping(string => uint256) guidToClassroom;
    }

    // id to object mappings
    struct IdsToObjects {
        mapping(uint256 => Land) land;
        mapping(address => ClassroomAdmin) classroomAdmin;
        mapping(uint256 => Classroom) classroom;
        mapping(address => Teacher) teacher;
    }

    struct RoleResult {
        // bool student;
        bool teacher;
        bool classroomAdmin;
        // bool landOperator;
    }

    // Error messages
    string public constant ERR_OBJECT_ACCESS =
        "Object doesn't exist or you don't have access to it.";
    string public constant ERR_ROLE_ASSIGNED =
        "Provided wallet already has role: ";
    string public constant ERR_OBJECT_EXISTS = "Provided id invalid.";
    string public constant ERR_ACCESS_DENIED =
        "Provided wallet lacks appropriate role.";

    RegisteredIds private registeredIds;
    IdsToObjects private idsToObjects;

    ILANDRegistry public landRegistry;
    IDCLRegistrar public dclRegistrar;

    // OWNER ONLY METHODS

    function allLands() public view onlyOwner returns (uint256[] memory) {
        return registeredIds.landsRegisteredToClassroomAdmin;
    }

    function allClassrooms() public view onlyOwner returns (uint256[] memory) {
        return registeredIds.classroom;
    }

    function allTeachers() public view onlyOwner returns (address[] memory) {
        return contractUtils.allForRole(teacherRole);
    }

    function setLANDRegistry(address _registry) public onlyOwner {
        require(
            contractUtils._isContract(_registry),
            "LAND registry not a contract"
        );
        landRegistry = ILANDRegistry(_registry);
    }

    // PUBLIC UTILITY
    function getRoles() public view returns (RoleResult memory) {
        return
            RoleResult({
                // student: hasRole(STUDENT, msg.sender),
                teacher: contractUtils.hasRole(teacherRole, msg.sender),
                classroomAdmin: contractUtils.hasRole(
                    classroomAdminRole,
                    msg.sender
                )
                // landOperator: hasRole(LAND_OPERATOR, msg.sender)
            });
    }

    function getCoordinatesFromLandIds(
        uint256[] memory landIds
    ) public view returns (int[][] memory) {
        int[][] memory rtn = new int[][](landIds.length);
        for (uint256 i = 0; i < landIds.length; i++) {
            (int x, int y) = landRegistry.decodeTokenId(landIds[i]);
            rtn[i] = new int[](2);
            rtn[i][0] = x;
            rtn[i][1] = y;
        }
        return rtn;
    }

    function getLandIdsFromCoordinates(
        int[][] memory coordinatePairs
    ) public view returns (uint256[] memory) {
        uint256[] memory landIds = new uint256[](coordinatePairs.length);
        for (uint256 i = 0; i < coordinatePairs.length; i++) {
            landIds[i] = landRegistry.encodeTokenId(
                coordinatePairs[i][0],
                coordinatePairs[i][1]
            );
        }
        return landIds;
    }

    // CLASSROOM ADMIN
    // create
    function createWorldClassroomAdmin(
        address _walletAddress,
        string memory world
    ) public {
        requireCallerWorldOwner(world);
        registerWorldClassroomAdmin(_walletAddress, world);
    }

    function createClassroomAdmin(
        address _walletAddress,
        uint256[] memory _landIds
    ) public {
        requireCallerLandOperator(_landIds);
        require(
            !contractUtils.hasRole(classroomAdminRole, _walletAddress),
            string.concat(ERR_ROLE_ASSIGNED, classroomAdminRole)
        );
        registerClassroomAdmin(_walletAddress, _landIds);
    }

    // read
    function getClassroomAdmins()
        public
        view
        returns (ClassroomAdmin[] memory)
    {
        address[] memory registeredClassroomAdminIds = contractUtils.allForRole(
            classroomAdminRole
        );
        ClassroomAdmin[] memory rtn = new ClassroomAdmin[](
            registeredClassroomAdminIds.length
        );
        for (uint256 i = 0; i < registeredClassroomAdminIds.length; i++) {
            rtn[i] = idsToObjects.classroomAdmin[
                registeredClassroomAdminIds[i]
            ];
            rtn[i].landCoordinates = getCoordinatesFromLandIds(rtn[i].landIds);
        }
        return rtn;
    }

    function getClassroomAdmin(
        address _walletAddress
    ) public view returns (ClassroomAdmin memory) {
        ClassroomAdmin memory rtn = idsToObjects.classroomAdmin[_walletAddress];
        rtn.landCoordinates = getCoordinatesFromLandIds(rtn.landIds);
        return rtn;
    }

    // delete

    function deleteClassroomAdmin(address _walletAddress) public {
        require(
            contractUtils.hasRole(classroomAdminRole, _walletAddress),
            ERR_ACCESS_DENIED
        );
        ClassroomAdmin memory classroomAdmin = idsToObjects.classroomAdmin[
            _walletAddress
        ];
        if (Strings.equal(classroomAdmin.world, "")) {
            requireCallerLandOperator(classroomAdmin.landIds);
        } else {
            requireCallerWorldOwner(classroomAdmin.world);
        }

        // remove existing mappings
        for (uint256 i = 0; i < classroomAdmin.landIds.length; i++) {
            unregisterLandFromClassroomAdmin(classroomAdmin.landIds[i]);
        }

        // delete classrooms
        for (uint256 i = 0; i < classroomAdmin.classroomIds.length; i++) {
            unregisterClassroom(classroomAdmin.classroomIds[i]);
        }

        delete idsToObjects.classroomAdmin[_walletAddress];
        contractUtils.toggleRole(_walletAddress, classroomAdminRole, false);
    }

    // CLASSROOM
    // create
    function createWorldClassroom(
        string memory _name,
        string memory world,
        string memory guid
    ) public onlyRole(classroomAdminRole) {
        ClassroomAdmin memory classroomAdmin = idsToObjects.classroomAdmin[
            msg.sender
        ];
        require(
            Strings.equal(classroomAdmin.world, world),
            string.concat(
                "You are not authorised to use world: ",
                world,
                " only ",
                classroomAdmin.world
            )
        );
        registerWorldClassroom(
            getNewClassroomId(),
            _name,
            world,
            msg.sender,
            guid
        );
    }

    function createClassroomLandIds(
        string memory _name,
        uint256[] memory _landIds,
        string memory guid
    ) public onlyRole(classroomAdminRole) {
        bool landIdsSuitable = true;
        for (uint256 i = 0; i < _landIds.length; i++) {
            uint256 landId = _landIds[i];
            // do the land ids exist?
            if (!registeredIds.landsRegisteredToClassroomAdminBool[landId]) {
                landIdsSuitable = false;
                break;
            }
            Land memory land = idsToObjects.land[landId];
            // are they yours?
            if (msg.sender != land.classroomAdminId) {
                landIdsSuitable = false;
                break;
            }
        }

        require(landIdsSuitable, ERR_OBJECT_EXISTS);
        registerClassroom(
            getNewClassroomId(),
            _name,
            _landIds,
            msg.sender,
            guid
        );
    }

    function createClassroomCoordinates(
        string memory _name,
        int[][] memory coordinatePairs,
        string memory guid
    ) public onlyRole(classroomAdminRole) {
        uint256[] memory landIds = new uint256[](coordinatePairs.length);
        for (uint256 i = 0; i < coordinatePairs.length; i++) {
            landIds[i] = landRegistry.encodeTokenId(
                coordinatePairs[i][0],
                coordinatePairs[i][1]
            );
        }
        createClassroomLandIds(_name, landIds, guid);
    }

    // read
    function getClassrooms()
        public
        view
        onlyRole(classroomAdminRole)
        returns (Classroom[] memory)
    {
        uint256[] memory classroomIds = idsToObjects
            .classroomAdmin[msg.sender]
            .classroomIds;
        Classroom[] memory rtn = new Classroom[](classroomIds.length);
        for (uint256 i = 0; i < classroomIds.length; i++) {
            rtn[i] = idsToObjects.classroom[classroomIds[i]];
            rtn[i].landCoordinates = getCoordinatesFromLandIds(rtn[i].landIds);
        }
        return rtn;
    }

    function getClassroom(uint256 id) public view returns (Classroom memory) {
        // check you're entitled to view this classroom
        // either the owning classroom admin
        // or a teacher assigned to this classroom

        require(registeredIds.classroomBool[id], ERR_OBJECT_ACCESS);
        Classroom memory rtn = idsToObjects.classroom[id];
        bool entitledToViewClassroom = false;

        if (contractUtils.hasRole(teacherRole, msg.sender)) {
            for (uint256 i = 0; i < rtn.teacherIds.length; i++) {
                if (msg.sender == rtn.teacherIds[i]) {
                    entitledToViewClassroom = true;
                    break;
                }
            }
        } else if (contractUtils.hasRole(classroomAdminRole, msg.sender)) {
            entitledToViewClassroom = walletOwnsClassroom(msg.sender, id);
        }
        require(entitledToViewClassroom, ERR_OBJECT_ACCESS);
        rtn.landCoordinates = getCoordinatesFromLandIds(rtn.landIds);
        return rtn;
    }

    // delete
    function deleteClassroom(uint256 id) public onlyRole(classroomAdminRole) {
        // check you're entitled to this classroom
        require(walletOwnsClassroom(msg.sender, id), ERR_OBJECT_ACCESS);
        unregisterClassroom(id);
    }

    // TEACHER
    function createTeacher(
        address walletAddress,
        uint256[] memory classroomIds
    ) public onlyRole(classroomAdminRole) {
        // check classroom ids belong to this
        // classroom admin
        bool classroomIdsSuitable = true;

        for (uint256 i = 0; i < classroomIds.length; i++) {
            uint256 classroomId = classroomIds[i];
            // do the classroom ids exist?
            if (!registeredIds.classroomBool[classroomId]) {
                classroomIdsSuitable = false;
                break;
            }
            Classroom memory classroom = idsToObjects.classroom[classroomId];
            // are they yours?
            if (msg.sender != classroom.classroomAdminId) {
                classroomIdsSuitable = false;
                break;
            }
        }

        require(classroomIdsSuitable, ERR_OBJECT_EXISTS);
        registerTeacher(walletAddress, classroomIds);
    }

    // read
    function getTeachers()
        public
        view
        onlyRole(classroomAdminRole)
        returns (Teacher[] memory)
    {
        address[] memory teacherIds = idsToObjects
            .classroomAdmin[msg.sender]
            .teacherIds;
        Teacher[] memory rtn = new Teacher[](teacherIds.length);
        for (uint256 i = 0; i < teacherIds.length; i++) {
            rtn[i] = idsToObjects.teacher[teacherIds[i]];
        }
        return rtn;
    }

    function getTeacher(address id) public view returns (Teacher memory) {
        require(contractUtils.hasRole(teacherRole, id), ERR_OBJECT_ACCESS);
        Teacher memory rtn = idsToObjects.teacher[id];
        bool entitledToViewTeacher = false;

        if (contractUtils.hasRole(teacherRole, msg.sender)) {
            // teacher trying to view self
            if (msg.sender == id) {
                entitledToViewTeacher = true;
            }
        } else if (contractUtils.hasRole(classroomAdminRole, msg.sender)) {
            // classroom admin trying to view teacher
            entitledToViewTeacher = walletOwnsTeacher(msg.sender, id);
        }
        require(entitledToViewTeacher, ERR_OBJECT_ACCESS);
        return rtn;
    }

    // delete
    function deleteTeacher(address id) public onlyRole(classroomAdminRole) {
        require(walletOwnsTeacher(msg.sender, id), ERR_OBJECT_ACCESS);
        unregisterTeacher(id);
    }

    function getWorldClassroomGuidByWorld(
        string memory world
    ) public view returns (string memory) {
        // check teacher was created by CA with access to this world
        require(!Strings.equal("", world), "Must pass valid world name");
        Teacher memory teacher = idsToObjects.teacher[msg.sender];
        string memory _classroomGuid;

        for (uint256 i = 0; i < teacher.classroomAdminIds.length; i++) {
            ClassroomAdmin memory classroomAdmin = idsToObjects.classroomAdmin[
                teacher.classroomAdminIds[i]
            ];
            if (Strings.equal(classroomAdmin.world, world)) {
                for (
                    uint256 j = 0;
                    j < classroomAdmin.classroomIds.length;
                    j++
                ) {
                    Classroom memory classroom = idsToObjects.classroom[
                        classroomAdmin.classroomIds[j]
                    ];
                    if (Strings.equal(classroom.world, world)) {
                        _classroomGuid = classroom.guid;
                        break;
                    }
                }
                break;
            }
        }
        require(
            !Strings.equal(_classroomGuid, ""),
            "You are not authorised to use this world."
        );
        return _classroomGuid;
    }

    function getClassroomGuid(
        int x,
        int y
    ) public view returns (string memory) {
        // does the teacher have access to this classroom from the supplied coordinates?
        Teacher memory teacher = idsToObjects.teacher[msg.sender];
        uint256 callingLandId = landRegistry.encodeTokenId(x, y);
        bool teacherCanUseLand = false;
        string memory _classroomGuid;
        for (uint256 i = 0; i < teacher.classroomIds.length; i++) {
            Classroom memory currentClassroom = idsToObjects.classroom[
                teacher.classroomIds[i]
            ];
            for (uint256 j = 0; j < currentClassroom.landIds.length; j++) {
                uint256 currentLandId = currentClassroom.landIds[j];
                if (callingLandId == currentLandId) {
                    teacherCanUseLand = true;
                    _classroomGuid = currentClassroom.guid;
                    break;
                }
            }
            if (teacherCanUseLand) {
                break;
            }
        }
        require(
            teacherCanUseLand,
            string.concat(
                "You ",
                Strings.toHexString(uint160(msg.sender)),
                " are not authorised to use this classroom."
            )
        );

        return _classroomGuid;
    }

    // private
    // land
    function walletOwnsClassroom(
        address walletId,
        uint256 _classroomId
    ) private view returns (bool) {
        return
            idsToObjects.classroom[_classroomId].classroomAdminId == walletId;
    }

    function walletOwnsTeacher(
        address walletId,
        address _teacherId
    ) private view returns (bool) {
        return
            contractUtils.arrayContainsAddress(
                idsToObjects.teacher[_teacherId].classroomAdminIds,
                walletId
            );
    }

    function unregisterLandFromClassroomAdmin(uint256 landId) private {
        delete idsToObjects.land[landId];
        removeUintFromArrayMaintainOrder(
            registeredIds.landsRegisteredToClassroomAdmin,
            landId
        );
        delete registeredIds.landsRegisteredToClassroomAdminBool[landId];
    }

    function registerLandToClassroom(
        uint256 landId,
        uint256 _classroomId
    ) private {
        idsToObjects.land[landId].classroomId = _classroomId;
        registeredIds.landsRegisteredToClassroom.push(landId);
        registeredIds.landsRegisteredToClassroomBool[landId] = true;
    }

    function unregisterLandFromClassroom(uint256 landId) private {
        idsToObjects.land[landId].classroomId = 0;
        removeUintFromArrayMaintainOrder(
            registeredIds.landsRegisteredToClassroom,
            landId
        );
        delete registeredIds.landsRegisteredToClassroomBool[landId];
    }

    // classroomAdmin
    function registerWorldClassroomAdmin(
        address _walletAddress,
        string memory world
    ) private {
        idsToObjects.classroomAdmin[_walletAddress] = ClassroomAdmin({
            walletAddress: _walletAddress,
            landIds: emptyUintList,
            world: world,
            landCoordinates: emptyIntList,
            classroomIds: emptyUintList,
            teacherIds: emptyAddressList
        });
        if (!contractUtils.hasRole(classroomAdminRole, _walletAddress)) {
            contractUtils.toggleRole(_walletAddress, classroomAdminRole, true);
        }
    }

    function registerClassroomAdmin(
        address _walletAddress,
        uint256[] memory landIds
    ) private {
        int[][] memory _landCoordinates;

        // register land ids
        for (uint256 i = 0; i < landIds.length; i++) {
            uint256 landId = landIds[i];
            idsToObjects.land[landId] = Land({
                id: landId,
                classroomAdminId: _walletAddress,
                classroomId: 0
            });

            registeredIds.landsRegisteredToClassroomAdmin.push(landId);
            registeredIds.landsRegisteredToClassroomAdminBool[landId] = true;
        }

        idsToObjects.classroomAdmin[_walletAddress] = ClassroomAdmin({
            walletAddress: _walletAddress,
            landIds: landIds,
            world: "",
            landCoordinates: _landCoordinates,
            classroomIds: emptyUintList,
            teacherIds: emptyAddressList
        });
        contractUtils.toggleRole(_walletAddress, classroomAdminRole, true);
    }

    function registerWorldClassroom(
        uint256 _id,
        string memory _name,
        string memory world,
        address _classroomAdminId,
        string memory _guid
    ) private {
        idsToObjects.classroom[_id] = Classroom({
            id: _id,
            name: _name,
            world: world,
            landIds: emptyUintList,
            landCoordinates: emptyIntList,
            classroomAdminId: _classroomAdminId,
            teacherIds: emptyAddressList,
            guid: _guid,
            configUrl: ""
        });
        registeredIds.classroom.push(_id);
        registeredIds.classroomBool[_id] = true;
        registeredIds.guidToClassroom[_guid] = _id;

        idsToObjects.classroomAdmin[_classroomAdminId].classroomIds.push(_id);
    }

    function registerClassroom(
        uint256 _id,
        string memory _name,
        uint256[] memory _landIds,
        address _classroomAdminId,
        string memory _guid
    ) private {
        idsToObjects.classroom[_id] = Classroom({
            id: _id,
            name: _name,
            world: "",
            landIds: _landIds,
            landCoordinates: emptyIntList,
            classroomAdminId: _classroomAdminId,
            teacherIds: emptyAddressList,
            guid: _guid,
            configUrl: ""
        });
        registeredIds.classroom.push(_id);
        registeredIds.classroomBool[_id] = true;
        registeredIds.guidToClassroom[_guid] = _id;
        for (uint256 i = 0; i < _landIds.length; i++) {
            registerLandToClassroom(_landIds[i], _id);
        }
        idsToObjects.classroomAdmin[_classroomAdminId].classroomIds.push(_id);
    }

    function unregisterClassroom(uint256 _id) private {
        Classroom memory classroom = idsToObjects.classroom[_id];
        uint256[] memory _landIds = classroom.landIds;
        removeUintFromArrayMaintainOrder(registeredIds.classroom, _id);

        delete registeredIds.classroomBool[_id];
        if (Strings.equal(classroom.guid, "")) {
            delete registeredIds.guidToClassroom[classroom.guid];
        }
        for (uint256 i = 0; i < _landIds.length; i++) {
            unregisterLandFromClassroom(_landIds[i]);
        }
        removeUintFromArrayMaintainOrder(
            idsToObjects
                .classroomAdmin[classroom.classroomAdminId]
                .classroomIds,
            _id
        );

        // delete orphaned teachers
        for (uint256 i = 0; i < classroom.teacherIds.length; i++) {
            Teacher memory teacher = idsToObjects.teacher[
                classroom.teacherIds[i]
            ];
            if (teacher.classroomIds.length == 1) {
                unregisterTeacher(teacher.walletAddress);
            } else {
                // remove this classroom from the teacher
                uint256[] memory newClassroomIds = new uint256[](
                    teacher.classroomIds.length - 1
                );
                // build the new array
                // skip the classroom to be removed
                uint256 keyCounter = 0;
                for (uint256 j = 0; j < teacher.classroomIds.length; j++) {
                    if (teacher.classroomIds[j] != _id) {
                        newClassroomIds[j] = teacher.classroomIds[keyCounter];
                        keyCounter++;
                    }
                }

                unregisterTeacher(teacher.walletAddress);
                registerTeacher(teacher.walletAddress, newClassroomIds);
            }
        }

        delete idsToObjects.classroom[_id];
    }

    function registerTeacher(
        address _walletAddress,
        uint256[] memory _classroomIds
    ) private {
        // they could already be registered by another classroom admin
        // in which case we need to update them
        if (contractUtils.hasRole(teacherRole, _walletAddress)) {
            // they are already registered with another CA
            idsToObjects.teacher[_walletAddress].classroomAdminIds.push(
                msg.sender
            );
        } else {
            address[] memory classroomAdminsWallets = new address[](1);
            classroomAdminsWallets[0] = msg.sender;
            idsToObjects.teacher[_walletAddress] = Teacher({
                walletAddress: _walletAddress,
                classroomIds: _classroomIds,
                classroomAdminIds: classroomAdminsWallets
            });
            contractUtils.toggleRole(_walletAddress, teacherRole, true);
        }
        // associate with classrooms
        for (uint256 i = 0; i < _classroomIds.length; i++) {
            idsToObjects.classroom[_classroomIds[i]].teacherIds.push(
                _walletAddress
            );
        }
        idsToObjects.classroomAdmin[msg.sender].teacherIds.push(_walletAddress);
    }

    function unregisterTeacher(address _walletAddress) private {
        Teacher memory teacher = idsToObjects.teacher[_walletAddress];
        uint256 classroomAdminCount = teacher.classroomAdminIds.length;

        removeAddressFromArrayMaintainOrder(
            idsToObjects.classroomAdmin[msg.sender].teacherIds,
            _walletAddress
        );
        removeAddressFromArrayMaintainOrder(
            idsToObjects.teacher[_walletAddress].classroomAdminIds,
            msg.sender
        );

        if (classroomAdminCount == 1) {
            contractUtils.toggleRole(_walletAddress, teacherRole, false);
            for (uint256 i = 0; i < teacher.classroomIds.length; i++) {
                removeAddressFromArrayMaintainOrder(
                    idsToObjects.classroom[teacher.classroomIds[i]].teacherIds,
                    _walletAddress
                );
            }
            delete idsToObjects.teacher[_walletAddress];
        }
    }

    // PRIVATE UTILITY
    function removeAddressFromArrayMaintainOrder(
        address[] storage arr,
        address val
    ) private {
        for (uint256 i = 0; i < arr.length; i++) {
            if (val == arr[i]) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
    }

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

    function removeClassroomFromArrayMaintainOrder(
        Classroom[] storage arr,
        uint256 _classroomId
    ) private {
        for (uint256 i = 0; i < arr.length; i++) {
            if (_classroomId == arr[i].id) {
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

    modifier onlyRole(string memory name) {
        require(
            contractUtils.hasRole(name, msg.sender),
            string.concat(
                "You ",
                Strings.toHexString(uint160(msg.sender)),
                " lack the appropriate role to call this function: ",
                name
            )
        );
        _;
    }

    function requireCallerWorldOwner(string memory world) public view {
        bool isWorldOwner = true;
        string memory err = "";
        address actualWorldOwner = dclRegistrar.getOwnerOf(world);
        if (actualWorldOwner != msg.sender) {
            isWorldOwner = false;
            err = string.concat(
                err,
                "Caller is not world owner of ",
                world,
                " expected: ",
                Strings.toHexString(uint160(msg.sender)),
                " but was: ",
                Strings.toHexString(uint160(actualWorldOwner))
            );
        }
        require(isWorldOwner, err);
    }

    function requireCallerLandOperator(uint256[] memory assetIds) public view {
        bool isOperator = true;
        string memory err = "";
        for (uint256 i = 0; i < assetIds.length; i++) {
            address actualOperator = landRegistry.updateOperator(assetIds[i]);
            if (actualOperator != msg.sender) {
                isOperator = false;
                err = string.concat(
                    err,
                    "Parcel ",
                    Strings.toString(assetIds[i]),
                    " expected operator: ",
                    Strings.toHexString(uint160(msg.sender)),
                    " but was: ",
                    Strings.toHexString(uint160(actualOperator)),
                    "\n"
                );
            }
        }
        require(isOperator, err);
    }
}
