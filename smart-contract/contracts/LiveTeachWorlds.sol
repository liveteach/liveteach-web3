// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

interface IDCLRegistrar {
    function getOwnerOf(
        string memory _subdomain
    ) external view returns (address);
}

contract LiveTeachWorlds {
    uint256 private latestClassroomId;

    address private owner;

    uint256[] private emptyUintList;
    address[] private emptyAddressList;
    int[][] private emptyIntList;

    function setDCLRegistrar(address _registrar) public onlyOwner {
        dclRegistrar = IDCLRegistrar(_registrar);
    }

    constructor() {
        owner = msg.sender;
        latestClassroomId = 100001;
        roleMap.classroomAdmin.roleName = "CLASSROOM_ADMIN";
        roleMap.teacher.roleName = "TEACHER";
    }

    // id generators, start at one so we can determine unassigned.
    function getNewClassroomId() private returns (uint256) {
        return latestClassroomId++;
    }

    // structs
    struct ClassroomAdmin {
        address walletAddress;
        uint256[] landIds;
        string[] worlds;
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

    struct RoleDetail {
        string roleName;
        address[] addressArray;
        mapping(address => bool) boolMapping;
    }

    struct RoleMap {
        RoleDetail classroomAdmin;
        RoleDetail teacher;
    }

    struct RegisteredIds {
        mapping(string => uint256) worldToClassroom;
        mapping(string => address) worldToClassroomAdmin;
        mapping(string => string) worldToClassroomGuid;
        // mapping(address => string) classroomAdminToWorld;
        uint256[] classroom;
        mapping(uint256 => bool) classroomBool;
        mapping(string => uint256) guidToClassroom;
    }

    // id to object mappings
    struct IdsToObjects {
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
    RoleMap private roleMap;
    IdsToObjects private idsToObjects;

    IDCLRegistrar public dclRegistrar;

    // OWNER ONLY METHODS

    function allClassrooms() public view onlyOwner returns (uint256[] memory) {
        return registeredIds.classroom;
    }

    function allTeachers() public view onlyOwner returns (address[] memory) {
        return roleMap.teacher.addressArray;
    }

    // PUBLIC UTILITY
    function getRoles() public view returns (RoleResult memory) {
        return
            RoleResult({
                // student: hasRole(STUDENT, msg.sender),
                teacher: hasRole(roleMap.teacher, msg.sender),
                classroomAdmin: hasRole(roleMap.classroomAdmin, msg.sender)
                // landOperator: hasRole(LAND_OPERATOR, msg.sender)
            });
    }

    // CLASSROOM ADMIN
    // create
    function createClassroomAdmin(
        address _walletAddress,
        string[] memory worlds
    ) public {
        for (uint256 i = 0; i < worlds.length; i++) {
            requireCallerWorldOwner(worlds[i]);
        }
        registerClassroomAdmin(_walletAddress, worlds);
    }

    // read
    function getClassroomAdmins()
        public
        view
        returns (ClassroomAdmin[] memory)
    {
        address[] memory registeredClassroomAdminIds = roleMap
            .classroomAdmin
            .addressArray;
        ClassroomAdmin[] memory rtn = new ClassroomAdmin[](
            registeredClassroomAdminIds.length
        );
        for (uint256 i = 0; i < registeredClassroomAdminIds.length; i++) {
            rtn[i] = idsToObjects.classroomAdmin[
                registeredClassroomAdminIds[i]
            ];
        }
        return rtn;
    }

    function getClassroomAdmin(
        address _walletAddress
    ) public view returns (ClassroomAdmin memory) {
        ClassroomAdmin memory rtn = idsToObjects.classroomAdmin[_walletAddress];
        return rtn;
    }

    // delete

    function deleteClassroomAdmin(address _walletAddress) public {
        require(
            hasRole(roleMap.classroomAdmin, _walletAddress),
            ERR_ACCESS_DENIED
        );
        ClassroomAdmin storage classroomAdmin = idsToObjects.classroomAdmin[
            _walletAddress
        ];

        // remove the classrooms this CA has created
        // but only if the world matches the callers world
        // the caller can have many worlds
        // go through the ca's classrooms, get the world, if owner owns it then delete

        uint256[] memory classroomsToRemove = new uint256[](
            classroomAdmin.classroomIds.length
        );

        if (classroomAdmin.classroomIds.length == 0) {
            for (uint256 i = 0; i < classroomAdmin.worlds.length; i++) {
                delete registeredIds.worldToClassroomAdmin[
                    classroomAdmin.worlds[i]
                ];

                removeStringFromArrayMaintainOrder(
                    classroomAdmin.worlds,
                    classroomAdmin.worlds[i]
                );
            }
        } else {
            for (uint256 i = 0; i < classroomAdmin.classroomIds.length; i++) {
                Classroom memory classroom = idsToObjects.classroom[
                    classroomAdmin.classroomIds[i]
                ];

                if (msg.sender == dclRegistrar.getOwnerOf(classroom.world)) {
                    removeStringFromArrayMaintainOrder(
                        classroomAdmin.worlds,
                        classroom.world
                    );
                    classroomsToRemove[i] = classroom.id;
                    delete registeredIds.worldToClassroomAdmin[classroom.world];
                }
            }
        }
        for (uint256 i = 0; i < classroomsToRemove.length; i++) {
            unregisterClassroom(classroomsToRemove[i]);
        }
        // require(false, Strings.toString(classroomAdmin.worlds.length));

        if (classroomAdmin.worlds.length == 0) {
            // remove existing mappings
            delete idsToObjects.classroomAdmin[_walletAddress];
            toggleRole(_walletAddress, roleMap.classroomAdmin, false);
            roleMap.classroomAdmin.boolMapping[_walletAddress] = false;
            removeAddressFromArrayMaintainOrder(
                roleMap.classroomAdmin.addressArray,
                _walletAddress
            );
        }
    }

    // CLASSROOM
    // create
    function createClassroom(
        string memory _name,
        string memory world,
        string memory guid
    ) public onlyRole(roleMap.classroomAdmin) {
        ClassroomAdmin memory classroomAdmin = idsToObjects.classroomAdmin[
            msg.sender
        ];
        require(
            arrayContainsString(classroomAdmin.worlds, world),
            string.concat("You are not authorised to use world: ", world)
        );
        registerClassroom(getNewClassroomId(), _name, world, msg.sender, guid);
    }

    // read
    function getClassrooms()
        public
        view
        onlyRole(roleMap.classroomAdmin)
        returns (Classroom[] memory)
    {
        uint256[] memory classroomIds = idsToObjects
            .classroomAdmin[msg.sender]
            .classroomIds;
        Classroom[] memory rtn = new Classroom[](classroomIds.length);
        for (uint256 i = 0; i < classroomIds.length; i++) {
            rtn[i] = idsToObjects.classroom[classroomIds[i]];
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

        if (hasRole(roleMap.teacher, msg.sender)) {
            for (uint256 i = 0; i < rtn.teacherIds.length; i++) {
                if (msg.sender == rtn.teacherIds[i]) {
                    entitledToViewClassroom = true;
                    break;
                }
            }
        } else if (hasRole(roleMap.classroomAdmin, msg.sender)) {
            entitledToViewClassroom = walletOwnsClassroom(msg.sender, id);
        }
        require(entitledToViewClassroom, ERR_OBJECT_ACCESS);
        return rtn;
    }

    // delete
    function deleteClassroom(
        uint256 id
    ) public onlyRole(roleMap.classroomAdmin) {
        // check you're entitled to this classroom
        require(walletOwnsClassroom(msg.sender, id), ERR_OBJECT_ACCESS);
        unregisterClassroom(id);
    }

    // TEACHER
    function createTeacher(
        address walletAddress,
        uint256[] memory classroomIds
    ) public onlyRole(roleMap.classroomAdmin) {
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
        onlyRole(roleMap.classroomAdmin)
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
        require(hasRole(roleMap.teacher, id), ERR_OBJECT_ACCESS);
        Teacher memory rtn = idsToObjects.teacher[id];
        bool entitledToViewTeacher = false;

        if (hasRole(roleMap.teacher, msg.sender)) {
            // teacher trying to view self
            if (msg.sender == id) {
                entitledToViewTeacher = true;
            }
        } else if (hasRole(roleMap.classroomAdmin, msg.sender)) {
            // classroom admin trying to view teacher
            entitledToViewTeacher = walletOwnsTeacher(msg.sender, id);
        }
        require(entitledToViewTeacher, ERR_OBJECT_ACCESS);
        return rtn;
    }

    // delete
    function deleteTeacher(address id) public onlyRole(roleMap.classroomAdmin) {
        require(walletOwnsTeacher(msg.sender, id), ERR_OBJECT_ACCESS);
        unregisterTeacher(id);
    }

    function getClassroomGuid(
        string memory world
    ) public view returns (string memory) {
        // check teacher was created by CA with access to this world
        require(!Strings.equal("", world), "Must pass valid world name");
        Teacher memory teacher = idsToObjects.teacher[msg.sender];
        // check that this teacher has that classroom admin
        require(
            arrayContainsAddress(
                teacher.classroomAdminIds,
                registeredIds.worldToClassroomAdmin[world]
            ),
            "You are not authorised to use this world."
        );
        // then get classroom guid by world

        return registeredIds.worldToClassroomGuid[world];
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
            arrayContainsAddress(
                idsToObjects.teacher[_teacherId].classroomAdminIds,
                walletId
            );
    }

    // classroomAdmin
    function registerClassroomAdmin(
        address _walletAddress,
        string[] memory worlds
    ) private {
        idsToObjects.classroomAdmin[_walletAddress] = ClassroomAdmin({
            walletAddress: _walletAddress,
            landIds: emptyUintList,
            worlds: worlds,
            landCoordinates: emptyIntList,
            classroomIds: emptyUintList,
            teacherIds: emptyAddressList
        });
        if (!hasRole(roleMap.classroomAdmin, _walletAddress)) {
            toggleRole(_walletAddress, roleMap.classroomAdmin, true);
        }
        for (uint256 i = 0; i < worlds.length; i++) {
            registeredIds.worldToClassroomAdmin[worlds[i]] = _walletAddress;
        }
    }

    function registerClassroom(
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
        registeredIds.worldToClassroom[world] = _id;
        registeredIds.worldToClassroomGuid[world] = _guid;
    }

    function unregisterClassroom(uint256 _id) private {
        Classroom memory classroom = idsToObjects.classroom[_id];
        removeUintFromArrayMaintainOrder(registeredIds.classroom, _id);
        delete registeredIds.classroomBool[_id];
        delete registeredIds.worldToClassroom[classroom.world];

        if (Strings.equal(classroom.guid, "")) {
            delete registeredIds.guidToClassroom[classroom.guid];
        }
        removeUintFromArrayMaintainOrder(
            idsToObjects
                .classroomAdmin[classroom.classroomAdminId]
                .classroomIds,
            _id
        );

        delete registeredIds.worldToClassroomGuid[classroom.world];

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
                        newClassroomIds[keyCounter] = teacher.classroomIds[j];
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
        if (hasRole(roleMap.teacher, _walletAddress)) {
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
            toggleRole(_walletAddress, roleMap.teacher, true);
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
        Teacher storage teacher = idsToObjects.teacher[_walletAddress];
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
            toggleRole(_walletAddress, roleMap.teacher, false);
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

    function removeStringFromArrayMaintainOrder(
        string[] storage arr,
        string memory val
    ) private {
        for (uint256 i = 0; i < arr.length; i++) {
            if (Strings.equal(val, arr[i])) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
    }

    function arrayContainsUint(
        uint256[] memory arr,
        uint256 val
    ) private pure returns (bool) {
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
    ) private pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                return true;
            }
        }
        return false;
    }

    function arrayContainsString(
        string[] memory arr,
        string memory val
    ) private pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (Strings.equal(arr[i], val)) {
                return true;
            }
        }
        return false;
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

    // ROLES

    /*
     *    Grant or revoke role based on grant flag
     */
    function toggleRole(
        address beneficiary,
        RoleDetail storage roleDetail,
        bool grant
    ) private {
        if (grant) {
            roleDetail.addressArray.push(beneficiary);
            roleDetail.boolMapping[beneficiary] = true;
        } else {
            removeAddressFromArrayMaintainOrder(
                roleDetail.addressArray,
                beneficiary
            );
            delete roleDetail.boolMapping[beneficiary];
        }
    }

    function hasRole(
        RoleDetail storage roleDetail,
        address user
    ) internal view returns (bool) {
        return roleDetail.boolMapping[user];
    }

    modifier onlyRole(RoleDetail storage roleDetail) {
        require(
            hasRole(roleDetail, msg.sender),
            string.concat(
                "You ",
                Strings.toHexString(uint160(msg.sender)),
                " lack the appropriate role to call this function: ",
                roleDetail.roleName
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
}
