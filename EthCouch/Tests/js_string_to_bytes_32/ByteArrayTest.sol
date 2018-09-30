pragma solidity ^0.4.4;

contract ByteArrayTest {
    
    event newBytes(bytes32 msg);
    
    bytes32 singleInputStore;
    function setInput(bytes32 enterBytes){
        newBytes(enterBytes);
        singleInputStore = enterBytes;
    }
    
    function getInput() returns (bytes32)
    {
        return singleInputStore;
    }
    
    event arrayLength(uint msg);
    
    bytes32[] multipleInputStore;
    function setMultipleInput(bytes32[] enterBytesArray){
        arrayLength(enterBytesArray.length);
        
        multipleInputStore = enterBytesArray;
        for (uint i = 0; i < enterBytesArray.length; i ++) {
            newBytes(enterBytesArray[i]);
        }
    }
    
    function getMultipleInput() returns (bytes32[])
    {
        return multipleInputStore;
    }
}