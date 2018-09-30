pragma solidity ^0.4.18;

contract TicketController {
    address[] public addresses;
    uint256 ticketNumber = 0; //consists of year+_+randnr.
    
    function getTicket(uint256 tn) public returns(address) {
        return addresses[tn-1];
    }
    
    function createTicket(string txt, address c) {
        ticketNumber++;
        Ticket ticket = new Ticket(ticketNumber, txt, c);
        addresses.push(address(ticket)); //address(ticket)
    }
}


contract Ticket {//TODO: leading 0 will raise an error
    struct Time {
        uint8 hour;
        uint8 minute;
    }

    struct Date {
        uint8 day;
        uint8 month; //could be also a string (better: use int, because of different nationalities)
        uint8 year;
    }

    uint256 ticketNumber;
    address customer;
    uint256 ticketTimestamp;
    Date planedDate = Date(0, 0, 0); //geplanter Einsatztag
    Time planedTime = Time(0, 0); //geplante Einsatzzeit
    string text;
    string status;
    
    function Ticket (uint256 tn, string txt, address c) {
        ticketNumber = tn;
        ticketTimestamp = now;
        text = txt;
        status = "created";
        customer = c;
    }

    //setter
    function setStatus(string state) public {
        status = state;
    }
    
    function setPlanedDate(uint8 dy, uint8 mth, uint8 yr) public {
        planedDate.day = dy;
        planedDate.month = mth;
        planedDate.year = yr;
    }
    
    function setPlanedTime(uint8 hr, uint8 min) public {
        planedTime.hour = hr;
        planedTime.minute = min;
    }

    //getter
    function getTicketNumber() public constant returns(uint256) {
        return ticketNumber;
    }
    
    function getText() public constant returns(string) {
        return text;
    }
    
    function getPlannedDate() public constant returns(uint8, uint8, uint8) {
        return (planedDate.day, planedDate.month, planedDate.year);
    }

    function getPlannedTime() public constant returns(uint8, uint8) {
        return (planedTime.hour, planedTime.minute);
    }
    
    function getTicketTimestamp() public constant returns(uint256) {
        return ticketTimestamp;
    }
}

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
