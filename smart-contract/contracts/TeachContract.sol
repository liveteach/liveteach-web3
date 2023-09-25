pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

bytes32 constant STUDENT = keccak256("STUDENT");
bytes32 constant TEACHER = keccak256("TEACHER");
bytes32 constant CLASSROOM_ADMIN = keccak256("CLASSROOM_ADMIN");
bytes32 constant LAND_OPERATOR = keccak256("LAND_OPERATOR");

contract TeachContract is AccessControl {
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // id generators, start at one so we can determine unassigned.
    uint256 private latestClassroomId = 1;
    uint256 private latestTeacherId = 1;

    function getNewClassroomId() private returns (uint256) {
        return latestClassroomId++;
    }

    function getNewTeacherId() private returns (uint256) {
        return latestTeacherId++;
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
        uint256[] teacherIds;
    }

    struct Classroom {
        uint256 id;
        string name;
        uint256[] landIds;
        int[][] landCoordinates; // not persisted
        address classroomAdminId;
        uint256[] teacherIds;
    }

    struct Teacher {
        uint256 id;
        address walletAddress;
        uint256[] classroomIds;
        address classroomAdminId;
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
        uint256[] teacher;
        mapping(uint256 => bool) teacherBool;
    }

    // id to object mappings
    struct IdsToObjects {
        mapping(uint256 => Land) land;
        mapping(address => ClassroomAdmin) classroomAdmin;
        mapping(uint256 => Classroom) classroom;
        mapping(uint256 => Teacher) teacher;
    }

    RegisteredIds private registeredIds;
    IdsToObjects private idsToObjects;

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
        uint256[] memory allTeacherIds = registeredIds.teacher;
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
        require(
            !hasRole(CLASSROOM_ADMIN, _walletAddress),
            "Provided wallet address is already CLASSROOM_ADMIN"
        );

        require(
            !areAnyLandIdsAssignedToClassroomAdmin(_landIds, _walletAddress),
            "Provided land id already registered."
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
        require(
            hasRole(CLASSROOM_ADMIN, _walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );

        require(
            !areAnyLandIdsAssignedToClassroomAdmin(_landIds, _walletAddress),
            "Provided land id already registered."
        );

        // remove existing mappings
        unregisterClassroomAdmin(_walletAddress);
        // recreate with same wallet address
        registerClassroomAdmin(_walletAddress, _landIds);
    }

    // delete

    function deleteClassroomAdmin(address _walletAddress) public {
        require(
            hasRole(CLASSROOM_ADMIN, _walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );

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
            "Provided land id not valid."
        );
        registerClassroom(getNewClassroomId(), _name, _landIds, msg.sender);
    }

    function createClassroomCoordinates(
        string memory _name,
        int[][] memory coordinatePairs
    ) public onlyRole(CLASSROOM_ADMIN) {
        uint256[] memory landIds = new uint256[](coordinatePairs.length);
        for (uint256 i = 0; i < coordinatePairs.length; i++) {
            landIds[i] = _encodeTokenId(
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
        require(
            walletOwnsClassroom(msg.sender, id),
            "This classroom does not exist or you do not have access to it."
        );
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
        require(
            walletOwnsClassroom(msg.sender, id),
            "This classroom does not exist or you do not have access to it."
        );
        require(
            checkLandIdsSuitableToBeAssignedToClassroom(msg.sender, landIds),
            "Provided land id not valid."
        );
        unregisterClassroom(id);
        registerClassroom(id, name, landIds, msg.sender);
    }

    // delete
    function deleteClassroom(uint256 id) public onlyRole(CLASSROOM_ADMIN) {
        // check you're entitled to this classroom
        require(
            walletOwnsClassroom(msg.sender, id),
            "This classroom does not exist or you do not have access to it."
        );
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
            "Provided classroom id not valid."
        );
        registerTeacher(
            getNewTeacherId(),
            walletAddress,
            classroomIds,
            msg.sender
        );
    }

    // read
    function getTeachers()
        public
        view
        onlyRole(CLASSROOM_ADMIN)
        returns (Teacher[] memory)
    {
        uint256[] memory teacherIds = idsToObjects
            .classroomAdmin[msg.sender]
            .teacherIds;
        Teacher[] memory rtn = new Teacher[](teacherIds.length);
        for (uint256 i = 0; i < teacherIds.length; i++) {
            rtn[i] = idsToObjects.teacher[teacherIds[i]];
        }
        return rtn;
    }

    function getTeacher(
        uint256 id
    ) public view onlyRole(CLASSROOM_ADMIN) returns (Teacher memory) {
        require(
            walletOwnsTeacher(msg.sender, id),
            "This teacher does not exist or you do not have access to it."
        );
        return idsToObjects.teacher[id];
    }

    // update
    function updateTeacher(
        uint256 id,
        uint256[] memory classroomIds
    ) public onlyRole(CLASSROOM_ADMIN) {
        require(
            walletOwnsTeacher(msg.sender, id),
            "This teacher does not exist or you do not have access to it."
        );
        require(
            checkClassroomIdsSuitableToBeAssignedToTeacher(
                msg.sender,
                classroomIds
            ),
            "Provided classroom id not valid."
        );

        _updateTeacher(id, classroomIds);
    }

    // delete
    function deleteTeacher(uint256 id) public onlyRole(CLASSROOM_ADMIN) {
        require(
            walletOwnsTeacher(msg.sender, id),
            "This teacher does not exist or you do not have access to it."
        );
        unregisterTeacher(id);
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

    function walletOwnsTeacher(
        address walletId,
        uint256 _teacherId
    ) private view returns (bool) {
        return idsToObjects.teacher[_teacherId].classroomAdminId == walletId;
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
        int[][] memory _landCoordinates;

        idsToObjects.classroomAdmin[_walletAddress] = ClassroomAdmin({
            walletAddress: _walletAddress,
            landIds: landIds,
            landCoordinates: _landCoordinates,
            classroomIds: emptyUintList,
            teacherIds: emptyUintList
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
        uint256[] memory emptyUintList;
        int[][] memory emptyIntList;

        idsToObjects.classroom[_id] = Classroom({
            id: _id,
            name: _name,
            landIds: _landIds,
            landCoordinates: emptyIntList,
            classroomAdminId: _classroomAdminId,
            teacherIds: emptyUintList
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
                unregisterTeacher(teacher.id);
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
                _updateTeacher(teacher.id, newClassroomIds);
            }
        }

        delete idsToObjects.classroom[_id];
    }

    function registerTeacher(
        uint256 _id,
        address _walletAddress,
        uint256[] memory _classroomIds,
        address classroomAdminWallet
    ) private {
        idsToObjects.teacher[_id] = Teacher({
            id: _id,
            walletAddress: _walletAddress,
            classroomIds: _classroomIds,
            classroomAdminId: classroomAdminWallet
        });
        registeredIds.teacher.push(_id);
        registeredIds.teacherBool[_id] = true;
        // associate with classrooms
        for (uint256 i = 0; i < _classroomIds.length; i++) {
            idsToObjects.classroom[_classroomIds[i]].teacherIds.push(_id);
        }
        idsToObjects.classroomAdmin[classroomAdminWallet].teacherIds.push(_id);
    }

    function unregisterTeacher(uint256 _id) private {
        Teacher memory teacher = idsToObjects.teacher[_id];
        removeUintFromArrayMaintainOrder(registeredIds.teacher, _id);
        delete registeredIds.teacherBool[_id];
        for (uint256 i = 0; i < teacher.classroomIds.length; i++) {
            removeUintFromArrayMaintainOrder(
                idsToObjects.classroom[teacher.classroomIds[i]].teacherIds,
                _id
            );
        }
        removeUintFromArrayMaintainOrder(
            idsToObjects.classroomAdmin[teacher.classroomAdminId].teacherIds,
            _id
        );
        delete idsToObjects.teacher[_id];
    }

    function _updateTeacher(uint256 id, uint256[] memory classroomIds) private {
        address walletAddress = idsToObjects.teacher[id].walletAddress;

        unregisterTeacher(id);
        registerTeacher(id, walletAddress, classroomIds, msg.sender);
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
    ) private pure returns (int[][] memory) {
        int[][] memory rtn = new int[][](landIds.length);
        for (uint256 i = 0; i < landIds.length; i++) {
            (int x, int y) = _decodeTokenId(landIds[i]);
            rtn[i] = new int[](2);
            rtn[i][0] = x;
            rtn[i][1] = y;
        }
        return rtn;
    }

    // methods and variables to encode / decode land token ids
    // TODO: remove thiese and rely on external contract when
    // we have something in place.
    uint256 constant clearLow =
        0xffffffffffffffffffffffffffffffff00000000000000000000000000000000;
    uint256 constant clearHigh =
        0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff;
    uint256 constant factor = 0x100000000000000000000000000000000;

    // function encodeTokenId(int x, int y) external pure returns (uint) {
    //     return _encodeTokenId(x, y);
    // }

    function _encodeTokenId(int x, int y) internal pure returns (uint result) {
        require(
            -1000000 < x && x < 1000000 && -1000000 < y && y < 1000000,
            "The coordinates should be inside bounds"
        );
        return _unsafeEncodeTokenId(x, y);
    }

    function _unsafeEncodeTokenId(int x, int y) internal pure returns (uint) {
        return ((uint(x) * factor) & clearLow) | (uint(y) & clearHigh);
    }

    // function decodeTokenId(uint value) external pure returns (int, int) {
    //     return _decodeTokenId(value);
    // }

    function _unsafeDecodeTokenId(
        uint value
    ) internal pure returns (int x, int y) {
        x = expandNegative128BitCast((value & clearLow) >> 128);
        y = expandNegative128BitCast(value & clearHigh);
    }

    function _decodeTokenId(uint value) internal pure returns (int x, int y) {
        (x, y) = _unsafeDecodeTokenId(value);
        require(
            -1000000 < x && x < 1000000 && -1000000 < y && y < 1000000,
            "The coordinates should be inside bounds"
        );
    }

    function expandNegative128BitCast(uint value) internal pure returns (int) {
        if (value & (1 << 127) != 0) {
            return int(value | clearLow);
        }
        return int(value);
    }
}
