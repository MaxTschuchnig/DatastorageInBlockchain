pragma solidity ^0.4.4;

contract DbControllerContractV2 {
    
    event printUInt(uint _print);
    
    struct DbFunction {
        bytes32 task;
        bytes32 uuid_dataset;
        bytes32 editor_name;
        uint256 sequence_id;
    }
    
    uint256 s_sequence_id;
    
    DbFunction[] DbFunctions;
    
    function DbControllerContract () public {
        s_sequence_id = 0;
    }
    
    function setDbFunction(bytes32 _task, bytes32 _uuid_dataset, bytes32 _editor_name) public{
        DbFunction memory newDbFunction = DbFunction(_task, _uuid_dataset, _editor_name, s_sequence_id);
        DbFunctions.push(newDbFunction);
        s_sequence_id = s_sequence_id + 1;
    }
    
    function batchSetDbFunction(bytes32[] _task, bytes32[] _uuid_dataset, bytes32[] _editor_name) public{
        for (uint i = 0; i < _task.length; i ++) {
            DbFunction memory newDbFunction = DbFunction(_task[i], _uuid_dataset[i], _editor_name[i], s_sequence_id);
            DbFunctions.push(newDbFunction);
            s_sequence_id = s_sequence_id + 1;
        }
    }
    
    function checkParametersGetDbFunctionsFromTo(uint256 from, uint256 to) constant public returns(bytes32[]) {
        if (from > to) {
            uint256 t = to;
            to = from;
            from = t;
        }
        
        if (to > DbFunctions.length) {
            bytes32[] memory temp = new bytes32[](1);
            temp[0] = stringToBytes32("Out of bounds");
            return temp;
        } else {
            bytes32[] memory data = getDbFunctionsFromTo(from, to);
            return data;
        }
    }
    
    function getDbFunctionsFromTo(uint256 from, uint256 to) constant private returns(bytes32[]) {
        uint len = (to - from) * 4;
        bytes32[] memory _dbFunctions = new bytes32[](len);
        
        uint j = 0;
        for(uint256 i = from;i<to;i++) {
            _dbFunctions[4*j+0] = DbFunctions[i].task;
            _dbFunctions[4*j+1] = DbFunctions[i].uuid_dataset;
            _dbFunctions[4*j+2] = DbFunctions[i].editor_name;
            _dbFunctions[4*j+3] = bytes32(DbFunctions[i].sequence_id);
            
            j = j  + 1;
        }
        return _dbFunctions;
    }
    
    function getLatestDbFunction() constant public returns(uint256) {
        return s_sequence_id;
    }
    
    function stringToBytes32(string memory source) private returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
    
        assembly {
            result := mload(add(source, 32))
        }
    }
}