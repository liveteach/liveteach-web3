pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

bytes32 constant STUDENT = keccak256("STUDENT");
bytes32 constant TEACHER = keccak256("TEACHER");
bytes32 constant CLASSROOM_ADMIN = keccak256("CLASSROOM_ADMIN");
bytes32 constant LAND_OPERATOR = keccak256("LAND_OPERATOR");

contract TeachContract is AccessControl {
    // classroom admin
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
    function createClassroom(
        string calldata _name,
        uint256[] calldata _landIds
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
        removeClassroomAdminToClassroomsClassroom(_id);
        classroomAdminToClassrooms[msg.sender].push(newClassroom);
    }

    // delete

    function deleteClassroom(uint256 id) public view onlyRole(CLASSROOM_ADMIN) {
        // TODO
    }

    function removeClassroomAdminToClassroomsClassroom(
        uint256 classroomId
    ) private onlyRole(CLASSROOM_ADMIN) {
        for (
            uint256 i = 0;
            i < classroomAdminToClassrooms[msg.sender].length;
            i++
        ) {
            Classroom memory currentClassroom = classroomAdminToClassrooms[
                msg.sender
            ][i];
            if (classroomId == currentClassroom.id) {
                // Move the last element into the place to delete
                classroomAdminToClassrooms[msg.sender][
                    i
                ] = classroomAdminToClassrooms[msg.sender][
                    classroomAdminToClassrooms[msg.sender].length - 1
                ];
                // Remove the last element
                classroomAdminToClassrooms[msg.sender].pop();
                break;
            }
        }
    }

    // deleteClassroom

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
    }

    // read
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
        for (
            uint256 i = 0;
            i < classroomAdminToLandIds[walletAddress].length;
            i++
        ) {
            uint256 currentLandId = classroomAdminToLandIds[walletAddress][i];
            if (landId == currentLandId) {
                // Move the last element into the place to delete
                classroomAdminToLandIds[walletAddress][
                    i
                ] = classroomAdminToLandIds[walletAddress][
                    classroomAdminToLandIds[walletAddress].length - 1
                ];
                // Remove the last element
                classroomAdminToLandIds[walletAddress].pop();
                break;
            }
        }
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
    }
}
