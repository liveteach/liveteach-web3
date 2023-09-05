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

    function addStudent(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(STUDENT, walletAddress);
    }

    function addTeacher(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(TEACHER, walletAddress);
    }

    function addClassroomAdmin(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(CLASSROOM_ADMIN, walletAddress);
    }

    function addLandOperator(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(LAND_OPERATOR, walletAddress);
    }

    function removeStudent(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(STUDENT, walletAddress);
    }

    function removeTeacher(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(TEACHER, walletAddress);
    }

    function removeClassroomAdmin(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(CLASSROOM_ADMIN, walletAddress);
    }

    function removeLandOperator(
        address walletAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(LAND_OPERATOR, walletAddress);
    }

    function onlyStudentCanCall() public view onlyRole(STUDENT) returns (uint) {
        return 1;
    }

    function onlyTeacherCanCall() public view onlyRole(TEACHER) returns (uint) {
        return 2;
    }

    function onlyClassroomAdminCanCall()
        public
        view
        onlyRole(CLASSROOM_ADMIN)
        returns (uint)
    {
        return 3;
    }

    function onlyLandOperatorCanCall()
        public
        view
        onlyRole(LAND_OPERATOR)
        returns (uint)
    {
        return 4;
    }

    function onlyAdminCanCall()
        public
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint)
    {
        return 5;
    }
}
