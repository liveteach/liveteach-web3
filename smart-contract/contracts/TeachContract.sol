pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

bytes32 constant STUDENT = keccak256("STUDENT");
bytes32 constant TEACHER = keccak256("TEACHER");
bytes32 constant CLASSROOM_ADMIN = keccak256("CLASSROOM_ADMIN");
bytes32 constant LAND_OPERATOR = keccak256("LAND_OPERATOR");

contract TeachContract is AccessControl {
    mapping(address => uint256[]) private classroomAdminLandIds;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
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

    // classroom admin

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
        return classroomAdminLandIds[walletAddress];
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
        classroomAdminLandIds[walletAddress].push(landId);
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
        for (uint i = 0; i < landIds.length; i++) {
            addClassroomAdminLandId(walletAddress, landIds[i]);
        }
    }

    // dev - Removes the entire entry from the mapping.  Use with caution.
    function deleteFromClassroomAdminLandIds(address walletAddress) private {
        // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );

        delete classroomAdminLandIds[walletAddress];
    }

    function removeAllClassroomAdminLandIds(address walletAddress) public {
        // onlyRole(LAND_OPERATOR) TODO: development only.  See addClassroomAdmin above.
        require(
            hasRole(CLASSROOM_ADMIN, walletAddress),
            "Provided wallet address is not CLASSROOM_ADMIN"
        );
        classroomAdminLandIds[walletAddress] = new uint256[](0);
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
            i < classroomAdminLandIds[walletAddress].length;
            i++
        ) {
            uint256 currentLandId = classroomAdminLandIds[walletAddress][i];
            if (landId == currentLandId) {
                // Move the last element into the place to delete
                classroomAdminLandIds[walletAddress][i] = classroomAdminLandIds[
                    walletAddress
                ][classroomAdminLandIds[walletAddress].length - 1];
                // Remove the last element
                classroomAdminLandIds[walletAddress].pop();
                break;
            }
        }
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
        for (uint i = 0; i < landIds.length; i++) {
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
