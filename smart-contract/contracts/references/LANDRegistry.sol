pragma solidity ^0.4.24;

// NB This is used for testing
// The code in the full contract is very old
// and doesn't like being deployed with openzeppelin upgrades
// I have deleted much code from here that isn't need for tests.
// frankie 05/10/2023

contract LANDRegistry {
    uint256 constant clearLow =
        0xffffffffffffffffffffffffffffffff00000000000000000000000000000000;
    uint256 constant clearHigh =
        0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff;
    uint256 constant factor = 0x100000000000000000000000000000000;

    function encodeTokenId(int x, int y) external pure returns (uint) {
        return _encodeTokenId(x, y);
    }

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

    function decodeTokenId(uint value) external pure returns (int, int) {
        return _decodeTokenId(value);
    }

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
