pragma solidity ^0.4.20;

contract Data {//TODO: leading 0 will raise an error
    struct Time {
        uint8 hour;
        uint8 minute;
    }

    struct Date {
        uint8 day;
        uint8 month; //could be also a string (better: use int, because of different nationalities)
        uint8 year;
    }

    uint32 ticketNumber;
    string name;
    uint16 plz;
    string addressCustomer;
    Date date = Date(0, 0, 0);
    Time time = Time(0, 0);
    string text;

    //setter
    function setTicketNumber(uint32 tn) public {
        ticketNumber = tn;
    }
    
    function setName(string n) public {
        name = n;
    }
    
    function setPlz(uint16 p) public {
        plz = p;
    }
    
    function setAddressCustomer(string ac) public {
        addressCustomer = ac;
    }
    
    function setText(string txt) public {
        text = txt;
    }

    function setDate(uint8 dy, uint8 mth, uint8 yr) public {
        date.day = dy;
        date.month = mth;
        date.year = yr;
    }
    
    function setTime(uint8 hr, uint8 min) public {
        time.hour = hr;
        time.minute = min;
    }
    
    //getter
    function getTicketNumber() public constant returns(uint32) {
        return ticketNumber;
    }
    
    function getName() public constant  returns(string) {
        return name;
    }
    
    function getPlz() public constant  returns(uint16) {
        return plz;
    }
    
    function getAddressCustomer() public constant  returns(string) {
        return addressCustomer;
    }
    
    function getText() public constant returns(string) {
        return text;
    }
    
    function getDate() public constant returns(uint8, uint8, uint8) {
        return (date.day, date.month, date.year);
    }

    function getTime() public constant returns(uint8, uint8) {
        return (time.hour, time.minute);
    }

}