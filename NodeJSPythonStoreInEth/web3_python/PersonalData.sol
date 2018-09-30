pragma solidity ^0.4.18;

contract personalData {
    string name;
    uint16 plz;
    string addressCustomer;
    string city;
    string country;
    
    function personalData (string _name, string _addressCustomer, uint16 _plz, string _city, string _country) public {
        name = _name;
        plz = _plz;
        city = _city;
        addressCustomer = _addressCustomer;
        country = _country;
    }

    function getName() public constant returns(string) {
        return name;
    }
    
    function getPlz() public constant returns(uint16) {
        return plz;
    }
        
    function getCountry() public constant returns(string) {
        return country;
    }
    
    function getAddressCustomer() public constant returns(string) {
        return addressCustomer;
    }
    
    function getCity() public constant returns(string) {
        return city;
    }
}