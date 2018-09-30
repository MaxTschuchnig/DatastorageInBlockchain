pragma solidity ^0.4.4;

contract storage_rnd_test {
    struct Person {
        uint age;
        string name;
    }
    
    Person[] persons;
    
    function setPerson(uint _age, string _name) public{
        Person memory newPerson = Person(_age, _name);
        persons.push(newPerson);
    }
    
    function getAllPersons() constant public returns(string) {
        uint256 i=0;

        string memory _tmpValue;
        
        for(i;i<persons.length;i++) {
            string memory _age = uint2str(persons[i].age);
            string memory _name = persons[i].name;
            
            uint _age_len = bytes(uint2str(persons[i].age)).length;
            uint _name_len = bytes(persons[i].name).length;
            uint _len = bytes(_tmpValue).length + _age_len + _name_len;
            
            string memory temp = _tmpValue;
            _tmpValue = new string(_len);
            
            string memory c = concat(temp, _name);
            _tmpValue = concat(c, _age);
        }
        return _tmpValue;
    }
    
    function concat(string _base, string _value) internal pure returns (string) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i = 0;
        uint j = 0;

        for(i=0; i<_baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for(i=0; i<_valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }

        return string(_newValue);
    }
    
    function uint2str(uint i) internal pure returns (string)
    { 
        if (i == 0) return "0"; 
        
        uint j = i; 
        uint length; 
        
        while (j != 0)
        { 
            length++; 
            j /= 10; 
        } 
        
        bytes memory bstr = new bytes(length); 
        uint k = length - 1; 
        
        while (i != 0)
        { 
            bstr[k--] = byte(48 + i % 10); 
            i /= 10; 
        } 
        return string(bstr); 
    }
}