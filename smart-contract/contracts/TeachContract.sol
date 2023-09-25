pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

bytes32 constant STUDENT = keccak256("STUDENT");
bytes32 constant TEACHER = keccak256("TEACHER");
bytes32 constant CLASSROOM_ADMIN = keccak256("CLASSROOM_ADMIN");
bytes32 constant LAND_OPERATOR = keccak256("LAND_OPERATOR");

contract TeachContract is AccessControl {
    // classroom admin
    address[] private classroomAdminWalletAddresses;
    mapping(address => uint256[]) private classroomAdminToLandIds;
    mapping(uint256 => address) private landIdToClassroomAdmin;
    // classroom
    mapping(uint256 => Classroom) private classroomIdToClassroom;
    mapping(address => Classroom[]) private classroomAdminToClassrooms;
    mapping(uint256 => address) private classroomIdToClassroomAdmin;
    mapping(uint256 => bool) private classroomAssignedLandIds;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // CLASSROOM
    struct Classroom {
        string name;
        uint256[] landIds;
        uint256 id;
    }

    uint256 private classroomId;

    function getNewClassroomId()
        private
        onlyRole(CLASSROOM_ADMIN)
        returns (uint256)
    {
        return classroomId++;
    }

    // create

    function createClassroomLandIds(
        string calldata _name,
        uint256[] memory _landIds
    ) public onlyRole(CLASSROOM_ADMIN) {
        for (uint256 i = 0; i < _landIds.length; i++) {
            require(
                landIdToClassroomAdmin[_landIds[i]] == msg.sender,
                "Can only create classroom using assigned land ids."
            );
            // check landId isn't used in different classroom
            require(
                !classroomAssignedLandIds[_landIds[i]],
                "Land id already assigned to a different classroom."
            );
            classroomAssignedLandIds[_landIds[i]] = true;
        }
        // if a more complex identifer is required
        // we could add a hash (block.timestamp + getNewClassroomId)
        uint256 _id = getNewClassroomId();
        Classroom memory classroom = Classroom({
            id: _id,
            name: _name,
            landIds: _landIds
        });
        classroomAdminToClassrooms[msg.sender].push(classroom);
        classroomIdToClassroomAdmin[_id] = msg.sender;
        classroomIdToClassroom[_id] = classroom;
    }

    function createClassroomCoordinates(
        string calldata _name,
        int[][] calldata coordinatePairs
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
        return classroomAdminToClassrooms[msg.sender];
    }

    function getClassroom(
        uint256 id
    ) public view onlyRole(CLASSROOM_ADMIN) returns (Classroom memory) {
        require(
            msg.sender == classroomIdToClassroomAdmin[id],
            "Classroom id not recognised or does not belong to caller."
        );
        return classroomIdToClassroom[id];
    }

    // update

    function updateClassroom(
        uint256 _id,
        string calldata _name,
        uint256[] calldata _landIds
    ) public onlyRole(CLASSROOM_ADMIN) {
        require(
            // checkCallerOwnsClassroom
            msg.sender == classroomIdToClassroomAdmin[_id],
            "Classroom id not recognised or does not belong to caller."
        );

        // clear landIds for this classroom
        Classroom memory classroom = classroomIdToClassroom[_id];
        for (uint256 i = 0; i < classroom.landIds.length; i++) {
            delete classroomAssignedLandIds[classroom.landIds[i]];
        }

        for (uint256 i = 0; i < _landIds.length; i++) {
            require(
                // checkCallerIsAssignedLandIds
                landIdToClassroomAdmin[_landIds[i]] == msg.sender,
                "Can only use assigned land ids while updating classroom."
            );
            // checkLandIdsAreUnassignedToOtherClassrooms
            require(
                !classroomAssignedLandIds[_landIds[i]],
                "Land id already assigned to a different classroom."
            );
            classroomAssignedLandIds[_landIds[i]] = true;
        }

        Classroom memory newClassroom = Classroom({
            id: _id,
            name: _name,
            landIds: _landIds
        });

        classroomIdToClassroom[_id] = newClassroom;
        removeClassroomFromArrayMaintainOrder(
            classroomAdminToClassrooms[msg.sender],
            _id
        );
        classroomAdminToClassrooms[msg.sender].push(newClassroom);
    }

    // delete
    function deleteClassroom(uint256 id) public onlyRole(CLASSROOM_ADMIN) {
        require(
            msg.sender == classroomIdToClassroomAdmin[id],
            "Requested classroom either not assigned to you or doesn't exist."
        );
        Classroom memory classroom = classroomIdToClassroom[id];
        for (uint256 i = 0; i < classroom.landIds.length; i++) {
            delete classroomAssignedLandIds[classroom.landIds[i]];
        }
        delete classroomIdToClassroom[id];

        removeClassroomFromArrayMaintainOrder(
            classroomAdminToClassrooms[msg.sender],
            id
        );
        delete classroomIdToClassroomAdmin[id];
    }

    function grantStudentRole(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(STUDENT, walletAddress);
    }

    function grantTeacherRole(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(TEACHER, walletAddress);
    }

    function grantLandOperatorRole(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(LAND_OPERATOR, walletAddress);
    }

    function revokeStudentRole(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(STUDENT, walletAddress);
    }

    function revokeTeacherRole(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(TEACHER, walletAddress);
    }

    function revokeLandOperatorRole(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(LAND_OPERATOR, walletAddress);
    }

    // CLASSROOM ADMIN

    // create

    function grantClassroomAdminRole(
        address walletAddress
    )
        private
    // onlyRole(LAND_OPERATOR) TODO: this function has been opened up to
    //                              allow anyone to call for development purposes.
    //                              This role restriction MUST be re-added before
    //                              going into anything resembling a production
    //                              environment.
    {
        require(
            !hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is already CLASSROOM_ADMIN"
        );
        grantRole(CLASSROOM_ADMIN, walletAddress);
    }

    function createClassroomAdmin(
        address walletAddress,
        uint256[] calldata landIds
    )
        public
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        require(
            !hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is already CLASSROOM_ADMIN"
        );
        grantClassroomAdminRole(walletAddress);
        addClassroomAdminLandIds(walletAddress, landIds);
        classroomAdminWalletAddresses.push(walletAddress);
    }

    // read
    struct ClassroomAdmin {
        address walletAddress;
        uint256[] landIds;
    }

    function getClassroomAdmins()
        public
        view
        returns (ClassroomAdmin[] memory)
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        ClassroomAdmin[] memory rtn = new ClassroomAdmin[](
            classroomAdminWalletAddresses.length
        );
        for (uint256 i = 0; i < classroomAdminWalletAddresses.length; i++) {
            rtn[i] = ClassroomAdmin({
                walletAddress: classroomAdminWalletAddresses[i],
                landIds: classroomAdminToLandIds[
                    classroomAdminWalletAddresses[i]
                ]
            });
        }
        return rtn;
    }

    function getClassroomAdmin(
        address walletAddress
    )
        public
        view
        returns (ClassroomAdmin memory)
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        bool exists = false;
        for (uint256 i = 0; i < classroomAdminWalletAddresses.length; i++) {
            if (walletAddress == classroomAdminWalletAddresses[i]) {
                exists = true;
                break;
            }
        }
        require(exists, "Classroom admin not found.");
        return
            ClassroomAdmin({
                walletAddress: walletAddress,
                landIds: classroomAdminToLandIds[walletAddress]
            });
    }

    function isClassroomAdminAssignedLandId(
        uint256 landId
    )
        public
        view
        returns (
            // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
            bool
        )
    {
        if (landIdToClassroomAdmin[landId] != address(0x0)) {
            return true;
        } else {
            return false;
        }
    }

    // dev - checks all included land Ids to see if they're registered
    // returns false if any are not.
    function isClassroomAdminAssignedLandIds(
        uint256[] calldata landIds
    )
        public
        view
        returns (
            // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
            bool
        )
    {
        for (uint256 i = 0; i < landIds.length; i++) {
            if (!isClassroomAdminAssignedLandId(landIds[i])) {
                return false;
            }
        }
        return true;
    }

    function isClassroomAdmin(
        address walletAddress
    )
        public
        view
        returns (bool)
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        return hasRole(CLASSROOM_ADMIN, walletAddress);
    }

    function getClassroomAdminLandIds(
        address walletAddress
    )
        public
        view
        returns (uint256[] memory)
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        return classroomAdminToLandIds[walletAddress];
    }

    // update

    function addClassroomAdminLandId(
        address walletAddress,
        uint256 landId
    )
        private
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        require(
            landIdToClassroomAdmin[landId] == address(0x0),
            "Land ID already assigned"
        );
        classroomAdminToLandIds[walletAddress].push(landId);
        landIdToClassroomAdmin[landId] = walletAddress;
    }

    function addClassroomAdminLandIds(
        address walletAddress,
        uint256[] calldata landIds
    )
        public
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        for (uint256 i = 0; i < landIds.length; i++) {
            addClassroomAdminLandId(walletAddress, landIds[i]);
        }
    }

    function deleteFromClassroomAdminAssignedLandIds(
        uint256[] memory landIds
    ) private {
        // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
        for (uint256 i = 0; i < landIds.length; i++) {
            delete landIdToClassroomAdmin[landIds[i]];
        }
    }

    // dev - Removes the entire entry from the mapping.  Use with caution.
    function deleteFromClassroomAdminLandIds(address walletAddress) private {
        // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        deleteFromClassroomAdminAssignedLandIds(
            classroomAdminToLandIds[walletAddress]
        );
        delete classroomAdminToLandIds[walletAddress];
    }

    function removeAllClassroomAdminLandIds(address walletAddress) public {
        // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        deleteFromClassroomAdminAssignedLandIds(
            classroomAdminToLandIds[walletAddress]
        );
        classroomAdminToLandIds[walletAddress] = new uint256[](0);
    }

    function removeClassroomAdminLandId(
        address walletAddress,
        uint256 landId
    )
        private
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        removeUintFromArrayMaintainOrder(
            classroomAdminToLandIds[walletAddress],
            landId
        );
        delete landIdToClassroomAdmin[landId];
    }

    function removeClassroomAdminLandIds(
        address walletAddress,
        uint256[] calldata landIds
    )
        public
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        for (uint256 i = 0; i < landIds.length; i++) {
            removeClassroomAdminLandId(walletAddress, landIds[i]);
        }
    }

    // delete

    function removeClassroomAdmin(
        address walletAddress
    )
        public
    // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
    {
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        deleteFromClassroomAdminLandIds(walletAddress);
        revokeRole(CLASSROOM_ADMIN, walletAddress);
        removeAddressFromArrayMaintainOrder(
            classroomAdminWalletAddresses,
            walletAddress
        );
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
