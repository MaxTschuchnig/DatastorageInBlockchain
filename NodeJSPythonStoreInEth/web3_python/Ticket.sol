contract Ticket {//TODO: leading 0 will raise an error
    struct Time {
        int hour;
        int minute;
    }

    struct Date {
        int day;
        int month; //could be also a string (better: use int, because of different nationalities)
        int year;
    }

    int ticketNumber;
    address customer;
    int ticketTimestamp;
    Date planedDate = Date(0, 0, 0); //geplanter Einsatztag
    Time planedTime = Time(0, 0); //geplante Einsatzzeit
    string text;
    string state;
    
    function Ticket (int tn, string txt, address c) {
        ticketNumber = tn;
        ticketTimestamp = 123; //now; does not work??
        text = txt;
        state = "created";
        customer = c;
    }

    //setter
    function setState(string _state) public {
        state = _state;
    }
    
    function setPlannedDate(int dy, int mth, int yr) public {
        planedDate.day = dy;
        planedDate.month = mth;
        planedDate.year = yr;
    }
    
    function setPlannedTime(int hr, int min) public {
        planedTime.hour = hr;
        planedTime.minute = min;
    }

    //getter
    function getTicketNumber() public constant returns(int) {
        return ticketNumber;
    }
    
    function getText() public constant returns(string) {
        return text;
    }
    
    function getPlannedDate() public constant returns(int, int, int) {
        return (planedDate.day, planedDate.month, planedDate.year);
    }

    function getPlannedTime() public constant returns(int, int) {
        return (planedTime.hour, planedTime.minute);
    }
    
    function getTicketTimestamp() public constant returns(int) {
        return ticketTimestamp;
    }
	
	function getState() public constant returns(string) {
        return state;
    }
}