pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface ILANDRegistry {
    function encodeTokenId(int x, int y) external pure returns (uint256);

    function decodeTokenId(uint value) external pure returns (int, int);
}

bytes32 constant STUDENT = keccak256("STUDENT");
bytes32 constant TEACHER = keccak256("TEACHER");
bytes32 constant CLASSROOM_ADMIN = keccak256("CLASSROOM_ADMIN");
bytes32 constant LAND_OPERATOR = keccak256("LAND_OPERATOR");

contract TeachContract is AccessControl {
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(TEACHER, CLASSROOM_ADMIN);
        grantRole(CLASSROOM_ADMIN, msg.sender); // TODO: remove this and update tests when we add LAND_OPERATOR
    }

    // id generators, start at one so we can determine unassigned.
    uint256 private latestClassroomId = 1;
    uint256 private latestClassConfigId = 1;

    function getNewClassroomId() private returns (uint256) {
        return latestClassroomId++;
    }

    function getNewClassConfigId() private returns (uint256) {
        return latestClassConfigId++;
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
        int[][] landCoordinates; // not persisted
        uint256[] classroomIds;
        address[] teacherIds;
    }

    struct Classroom {
        uint256 id;
        string name;
        uint256[] landIds;
        int[][] landCoordinates; // not persisted
        address classroomAdminId;
        address[] teacherIds;
    }

    struct Teacher {
        address walletAddress;
        uint256[] classroomIds;
        address classroomAdminId;
        uint256[] classConfigIds;
    }

    struct ClassConfig {
        uint256 id;
        address teacherId;
        string classReference;
        string contentUrl;
    }

    struct RegisteredIds {
        uint256[] landsRegisteredToClassroomAdmin;
        mapping(uint256 => bool) landsRegisteredToClassroomAdminBool;
        address[] classroomAdmin;
        mapping(address => bool) classroomAdminBool;
        uint256[] classroom;
        mapping(uint256 => bool) classroomBool;
        uint256[] landsRegisteredToClassroom;
        mapping(uint256 => bool) landsRegisteredToClassroomBool;
        address[] teacher;
        mapping(address => bool) teacherBool;
        uint256[] classConfig;
        mapping(uint256 => bool) classConfigBool;
    }

    // id to object mappings
    struct IdsToObjects {
        mapping(uint256 => Land) land;
        mapping(address => ClassroomAdmin) classroomAdmin;
        mapping(uint256 => Classroom) classroom;
        mapping(address => Teacher) teacher;
        mapping(uint256 => ClassConfig) classConfig;
    }

    struct RoleResult {
        bool student;
        bool teacher;
        bool classroomAdmin;
        bool landOperator;
    }

    // Error messages
    string public constant ERR_OBJECT_ACCESS =
        "Object doesn't exist or you don't have access to it.";
    string public constant ERR_ROLE_ASSIGNED =
        "Provided wallet already has role.";
    string public constant ERR_OBJECT_EXISTS = "Provided id invalid.";
    string public constant ERR_ACCESS_DENIED =
        "Provided wallet lacks appropriate role.";

    RegisteredIds private registeredIds;
    IdsToObjects private idsToObjects;

    ILANDRegistry public landRegistry;

    function setLANDRegistry(
        address _registry // onlyRole(LAND_OPERATOR) TODO: development only.
    ) public {
        require(_isContract(_registry), "LAND registry not a contract");
        landRegistry = ILANDRegistry(_registry);
    }

    // PUBLIC UTILITY
    function getRoles() public view returns (RoleResult memory) {
        return
            RoleResult({
                student: hasRole(STUDENT, msg.sender),
                teacher: hasRole(TEACHER, msg.sender),
                classroomAdmin: hasRole(CLASSROOM_ADMIN, msg.sender),
                landOperator: hasRole(LAND_OPERATOR, msg.sender)
            });
    }

    // OWNER ONLY METHODS

    function allLands()
        public
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (Land[] memory)
    {
        uint256[] memory allLandIds = registeredIds
            .landsRegisteredToClassroomAdmin;
        Land[] memory rtn = new Land[](allLandIds.length);
        for (uint256 i = 0; i < allLandIds.length; i++) {
            rtn[i] = idsToObjects.land[allLandIds[i]];
        }
        return rtn;
    }

    function allClassrooms()
        public
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (Classroom[] memory)
    {
        uint256[] memory allClassroomIds = registeredIds.classroom;
        Classroom[] memory rtn = new Classroom[](allClassroomIds.length);
        for (uint256 i = 0; i < allClassroomIds.length; i++) {
            rtn[i] = idsToObjects.classroom[allClassroomIds[i]];
        }
        return rtn;
    }

    function allTeachers()
        public
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (Teacher[] memory)
    {
        address[] memory allTeacherIds = registeredIds.teacher;
        Teacher[] memory rtn = new Teacher[](allTeacherIds.length);
        for (uint256 i = 0; i < allTeacherIds.length; i++) {
            rtn[i] = idsToObjects.teacher[allTeacherIds[i]];
        }
        return rtn;
    }

    // CLASSROOM ADMIN
    // create

    function createClassroomAdmin(
        address _walletAddress,
        uint256[] memory _landIds // onlyRole(LAND_OPERATOR) TODO: development only.
    ) public {
        require(!hasRole(CLASSROOM_ADMIN, _walletAddress), ERR_ROLE_ASSIGNED);

        require(
            !areAnyLandIdsAssignedToClassroomAdmin(_landIds, _walletAddress),
            ERR_OBJECT_EXISTS
        );
        registerClassroomAdmin(_walletAddress, _landIds);
    }

    // read
    function isClassroomAdmin(
        address _walletAddress
    )
        public
        view
        returns (
            // onlyRole(LAND_OPERATOR) TODO: development only.
            bool
        )
    {
        return hasRole(CLASSROOM_ADMIN, _walletAddress);
    }

    function getClassroomAdmins()
        public
        view
        returns (
            // onlyRole(LAND_OPERATOR) TODO: development only.
            ClassroomAdmin[] memory
        )
    {
        address[] memory registeredClassroomAdminIds = registeredIds
            .classroomAdmin;
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
    )
        public
        view
        returns (
            // onlyRole(LAND_OPERATOR) TODO: development only.
            ClassroomAdmin memory
        )
    {
        require(isClassroomAdmin(_walletAddress), "Classroom admin not found.");
        ClassroomAdmin memory rtn = idsToObjects.classroomAdmin[_walletAddress];
        rtn.landCoordinates = getCoordinatesFromLandIds(rtn.landIds);
        return rtn;
    }

    // update

    function updateClassroomAdmin(
        address _walletAddress,
        uint256[] memory _landIds // onlyRole(LAND_OPERATOR) TODO: development only.
    ) public {
        require(hasRole(CLASSROOM_ADMIN, _walletAddress), ERR_ACCESS_DENIED);

        require(
            !areAnyLandIdsAssignedToClassroomAdmin(_landIds, _walletAddress),
            ERR_OBJECT_EXISTS
        );

        // remove existing mappings
        unregisterClassroomAdmin(_walletAddress);
        // recreate with same wallet address
        registerClassroomAdmin(_walletAddress, _landIds);
    }

    // delete

    function deleteClassroomAdmin(address _walletAddress) public {
        require(hasRole(CLASSROOM_ADMIN, _walletAddress), ERR_ACCESS_DENIED);

        // remove existing mappings
        unregisterClassroomAdmin(_walletAddress);
    }

    // CLASSROOM
    // create

    function createClassroomLandIds(
        string memory _name,
        uint256[] memory _landIds
    ) public onlyRole(CLASSROOM_ADMIN) {
        require(
            checkLandIdsSuitableToBeAssignedToClassroom(msg.sender, _landIds),
            ERR_OBJECT_EXISTS
        );
        registerClassroom(getNewClassroomId(), _name, _landIds, msg.sender);
    }

    function createClassroomCoordinates(
        string memory _name,
        int[][] memory coordinatePairs
    ) public onlyRole(CLASSROOM_ADMIN) {
        uint256[] memory landIds = new uint256[](coordinatePairs.length);
        for (uint256 i = 0; i < coordinatePairs.length; i++) {
            landIds[i] = landRegistry.encodeTokenId(
                coordinatePairs[i][0],
                coordinatePairs[i][1]
            );
        }
        createClassroomLandIds(_name, landIds);
    }

    // read
    function getClassrooms()
        public
        view
        onlyRole(CLASSROOM_ADMIN)
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

    function getClassroom(
        uint256 id
    ) public view onlyRole(CLASSROOM_ADMIN) returns (Classroom memory) {
        // check you're entitled to view this classroom
        require(walletOwnsClassroom(msg.sender, id), ERR_OBJECT_ACCESS);
        Classroom memory rtn = idsToObjects.classroom[id];
        rtn.landCoordinates = getCoordinatesFromLandIds(rtn.landIds);
        return rtn;
    }

    // update
    function updateClassroom(
        uint256 id,
        string memory name,
        uint256[] memory landIds
    ) public onlyRole(CLASSROOM_ADMIN) {
        // check you're entitled to this classroom
        require(walletOwnsClassroom(msg.sender, id), ERR_OBJECT_ACCESS);
        require(
            checkLandIdsSuitableToBeAssignedToClassroom(msg.sender, landIds),
            ERR_OBJECT_EXISTS
        );
        unregisterClassroom(id);
        registerClassroom(id, name, landIds, msg.sender);
    }

    // delete
    function deleteClassroom(uint256 id) public onlyRole(CLASSROOM_ADMIN) {
        // check you're entitled to this classroom
        require(walletOwnsClassroom(msg.sender, id), ERR_OBJECT_ACCESS);
        unregisterClassroom(id);
    }

    // TEACHER

    function createTeacher(
        address walletAddress,
        uint256[] memory classroomIds
    ) public onlyRole(CLASSROOM_ADMIN) {
        // check classroom ids belong to this
        // classroom admin
        require(
            checkClassroomIdsSuitableToBeAssignedToTeacher(
                msg.sender,
                classroomIds
            ),
            ERR_OBJECT_EXISTS
        );
        registerTeacher(walletAddress, classroomIds, msg.sender);
    }

    // read
    function getTeachers()
        public
        view
        onlyRole(CLASSROOM_ADMIN)
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

    function getTeacher(
        address id
    ) public view onlyRole(CLASSROOM_ADMIN) returns (Teacher memory) {
        requireWalletOwnsTeacher(msg.sender, id);
        return idsToObjects.teacher[id];
    }

    // update
    function updateTeacher(
        address id,
        uint256[] memory classroomIds
    ) public onlyRole(CLASSROOM_ADMIN) {
        requireWalletOwnsTeacher(msg.sender, id);
        require(
            checkClassroomIdsSuitableToBeAssignedToTeacher(
                msg.sender,
                classroomIds
            ),
            ERR_OBJECT_EXISTS
        );

        _updateTeacher(id, classroomIds);
    }

    // delete
    function deleteTeacher(address id) public onlyRole(CLASSROOM_ADMIN) {
        requireWalletOwnsTeacher(msg.sender, id);
        unregisterTeacher(id);
    }

    // CLASS CONFIG

    // create
    function createClassConfig(
        string memory _classReference,
        string memory _contentUrl
    ) public onlyRole(TEACHER) {
        Teacher memory teacher = idsToObjects.teacher[msg.sender];
        registerClassConfig(
            getNewClassConfigId(),
            teacher,
            _classReference,
            _contentUrl
        );
    }

    // read
    function getClassConfigs()
        public
        view
        onlyRole(TEACHER)
        returns (ClassConfig[] memory)
    {
        uint256[] memory classConfigIds = idsToObjects
            .teacher[msg.sender]
            .classConfigIds;
        ClassConfig[] memory rtn = new ClassConfig[](classConfigIds.length);
        for (uint256 i = 0; i < classConfigIds.length; i++) {
            rtn[i] = idsToObjects.classConfig[classConfigIds[i]];
        }
        return rtn;
    }

    function getClassConfig(
        uint256 id
    ) public view onlyRole(TEACHER) returns (ClassConfig memory) {
        // class config should be registered to the calling teacher
        require(teacherOwnsClassConfig(msg.sender, id), ERR_OBJECT_ACCESS);
        return idsToObjects.classConfig[id];
    }

    // update
    function updateClassConfig(
        uint256 id,
        string memory _classReference,
        string memory _contentUrl
    ) public onlyRole(TEACHER) {
        // class config should be registered to the calling teacher
        require(teacherOwnsClassConfig(msg.sender, id), ERR_OBJECT_ACCESS);
        unregisterClassConfig(id);
        Teacher memory teacher = idsToObjects.teacher[msg.sender];
        registerClassConfig(id, teacher, _classReference, _contentUrl);
    }

    // delete
    function deleteClassConfig(uint256 id) public onlyRole(TEACHER) {
        // class config should be registered to the calling teacher
        require(teacherOwnsClassConfig(msg.sender, id), ERR_OBJECT_ACCESS);
        unregisterClassConfig(id);
    }

    // private
    // land
    function areAnyLandIdsAssignedToClassroomAdmin(
        uint256[] memory landIds,
        address classroomAdminWallet
    ) private returns (bool) {
        // Relies on call being reverted to unregister
        // landIds.  Should only be used in a require.
        for (uint256 i = 0; i < landIds.length; i++) {
            if (registeredIds.landsRegisteredToClassroomAdminBool[landIds[i]]) {
                return true;
            }
            registerLandToClassroomAdmin(landIds[i], classroomAdminWallet);
        }
        return false;
    }

    function walletOwnsClassroom(
        address walletId,
        uint256 _classroomId
    ) private view returns (bool) {
        return
            idsToObjects.classroom[_classroomId].classroomAdminId == walletId;
    }

    function requireWalletOwnsTeacher(
        address walletId,
        address _teacherId
    ) private view {
        require(walletOwnsTeacher(walletId, _teacherId), ERR_OBJECT_ACCESS);
    }

    function walletOwnsTeacher(
        address walletId,
        address _teacherId
    ) private view returns (bool) {
        return idsToObjects.teacher[_teacherId].classroomAdminId == walletId;
    }

    function teacherOwnsClassConfig(
        address teacherId,
        uint256 classConfigId
    ) private view returns (bool) {
        uint256[] memory ownedClassConfigs = idsToObjects
            .teacher[teacherId]
            .classConfigIds;
        for (uint256 i = 0; i < ownedClassConfigs.length; i++) {
            if (classConfigId == ownedClassConfigs[i]) {
                return true;
            }
        }
        return false;
    }

    function checkLandIdsSuitableToBeAssignedToClassroom(
        address _walletAddress,
        uint256[] memory _landIds
    ) private view returns (bool) {
        for (uint256 i = 0; i < _landIds.length; i++) {
            uint256 landId = _landIds[i];
            // do the land ids exist?
            if (!registeredIds.landsRegisteredToClassroomAdminBool[landId]) {
                return false;
            }
            Land memory land = idsToObjects.land[landId];
            // are they yours?
            if (_walletAddress != land.classroomAdminId) {
                return false;
            }
            // are they assigned to any classrooms?
            if (land.classroomId != 0) {
                return false;
            }
        }
        return true;
    }

    function checkClassroomIdsSuitableToBeAssignedToTeacher(
        address classroomAdminWallet,
        uint256[] memory classroomIds
    ) private view returns (bool) {
        for (uint256 i = 0; i < classroomIds.length; i++) {
            uint256 classroomId = classroomIds[i];
            // do the classroom ids exist?
            if (!registeredIds.classroomBool[classroomId]) {
                return false;
            }
            Classroom memory classroom = idsToObjects.classroom[classroomId];
            // are they yours?
            if (classroomAdminWallet != classroom.classroomAdminId) {
                return false;
            }
        }
        return true;
    }

    function registerLandToClassroomAdmin(
        uint256 landId,
        address _classroomAdminId
    ) private {
        idsToObjects.land[landId] = Land({
            id: landId,
            classroomAdminId: _classroomAdminId,
            classroomId: 0
        });

        registeredIds.landsRegisteredToClassroomAdmin.push(landId);
        registeredIds.landsRegisteredToClassroomAdminBool[landId] = true;
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
    function registerClassroomAdmin(
        address _walletAddress,
        uint256[] memory landIds
    ) private {
        uint256[] memory emptyUintList;
        address[] memory emptyAddressList;
        int[][] memory _landCoordinates;

        idsToObjects.classroomAdmin[_walletAddress] = ClassroomAdmin({
            walletAddress: _walletAddress,
            landIds: landIds,
            landCoordinates: _landCoordinates,
            classroomIds: emptyUintList,
            teacherIds: emptyAddressList
        });
        registeredIds.classroomAdmin.push(_walletAddress);
        registeredIds.classroomAdminBool[_walletAddress] = true;
        grantRole(CLASSROOM_ADMIN, _walletAddress);
        // landIds automatically registered in require
    }

    function unregisterClassroomAdmin(address _walletAddress) private {
        ClassroomAdmin memory classroomAdmin = idsToObjects.classroomAdmin[
            _walletAddress
        ];

        for (uint256 i = 0; i < classroomAdmin.landIds.length; i++) {
            unregisterLandFromClassroomAdmin(classroomAdmin.landIds[i]);
        }

        // delete classrooms
        for (uint256 i = 0; i < classroomAdmin.classroomIds.length; i++) {
            unregisterClassroom(classroomAdmin.classroomIds[i]);
        }

        delete idsToObjects.classroomAdmin[_walletAddress];
        removeAddressFromArrayMaintainOrder(
            registeredIds.classroomAdmin,
            _walletAddress
        );
        delete registeredIds.classroomAdminBool[_walletAddress];
        revokeRole(CLASSROOM_ADMIN, _walletAddress);
    }

    function registerClassroom(
        uint256 _id,
        string memory _name,
        uint256[] memory _landIds,
        address _classroomAdminId
    ) private {
        address[] memory emptyAddressList;
        int[][] memory emptyIntList;

        idsToObjects.classroom[_id] = Classroom({
            id: _id,
            name: _name,
            landIds: _landIds,
            landCoordinates: emptyIntList,
            classroomAdminId: _classroomAdminId,
            teacherIds: emptyAddressList
        });
        registeredIds.classroom.push(_id);
        registeredIds.classroomBool[_id] = true;
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
                _updateTeacher(teacher.walletAddress, newClassroomIds);
            }
        }

        delete idsToObjects.classroom[_id];
    }

    function registerTeacher(
        address _walletAddress,
        uint256[] memory _classroomIds,
        address classroomAdminWallet
    ) private {
        uint256[] memory emptyUintList;
        idsToObjects.teacher[_walletAddress] = Teacher({
            walletAddress: _walletAddress,
            classroomIds: _classroomIds,
            classroomAdminId: classroomAdminWallet,
            classConfigIds: emptyUintList
        });
        registeredIds.teacher.push(_walletAddress);
        registeredIds.teacherBool[_walletAddress] = true;
        // associate with classrooms
        for (uint256 i = 0; i < _classroomIds.length; i++) {
            idsToObjects.classroom[_classroomIds[i]].teacherIds.push(
                _walletAddress
            );
        }
        idsToObjects.classroomAdmin[classroomAdminWallet].teacherIds.push(
            _walletAddress
        );
        grantRole(TEACHER, _walletAddress);
    }

    function unregisterTeacher(address _id) private {
        Teacher memory teacher = idsToObjects.teacher[_id];
        removeAddressFromArrayMaintainOrder(registeredIds.teacher, _id);
        delete registeredIds.teacherBool[_id];
        for (uint256 i = 0; i < teacher.classroomIds.length; i++) {
            removeAddressFromArrayMaintainOrder(
                idsToObjects.classroom[teacher.classroomIds[i]].teacherIds,
                _id
            );
        }
        removeAddressFromArrayMaintainOrder(
            idsToObjects.classroomAdmin[teacher.classroomAdminId].teacherIds,
            _id
        );
        delete idsToObjects.teacher[_id];
        revokeRole(TEACHER, teacher.walletAddress);
    }

    function registerClassConfig(
        uint256 _id,
        Teacher memory teacher,
        string memory _classReference,
        string memory _contentUrl
    ) private {
        idsToObjects.classConfig[_id] = ClassConfig({
            id: _id,
            teacherId: teacher.walletAddress,
            classReference: _classReference,
            contentUrl: _contentUrl
        });
        registeredIds.classConfig.push(_id);
        registeredIds.classConfigBool[_id] = true;
        // associate with teacher
        idsToObjects.teacher[teacher.walletAddress].classConfigIds.push(_id);
    }

    function unregisterClassConfig(uint256 _id) private {
        ClassConfig memory classConfig = idsToObjects.classConfig[_id];
        removeUintFromArrayMaintainOrder(registeredIds.classConfig, _id);
        delete registeredIds.classConfigBool[_id];
        removeUintFromArrayMaintainOrder(
            idsToObjects.teacher[classConfig.teacherId].classConfigIds,
            _id
        );
        delete idsToObjects.classConfig[_id];
    }

    function _updateTeacher(address id, uint256[] memory classroomIds) private {
        address walletAddress = idsToObjects.teacher[id].walletAddress;

        unregisterTeacher(id);
        registerTeacher(walletAddress, classroomIds, msg.sender);
    }

    // utility
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

    function getCoordinatesFromLandIds(
        uint256[] memory landIds
    ) private view returns (int[][] memory) {
        int[][] memory rtn = new int[][](landIds.length);
        for (uint256 i = 0; i < landIds.length; i++) {
            (int x, int y) = landRegistry.decodeTokenId(landIds[i]);
            rtn[i] = new int[](2);
            rtn[i][0] = x;
            rtn[i][1] = y;
        }
        return rtn;
    }

    function _isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
