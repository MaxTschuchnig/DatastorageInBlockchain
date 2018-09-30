contract Ticket {
    int _id;
    string _task;
    string _technician;
    string _due_date;
    
	function Ticket (int id, string task, string technician, string due_date) public {
        _id = id;
		_task = task;
        _technician = technician;
        _due_date = due_date;
    }
	
    function setTicket(int id, string task, string technician, string due_date) public {
        _id = id;
        _task = task;
        _technician = technician;
        _due_date = due_date;
    }
    
    function getTicket() public constant returns(int, string, string, string) {
        return (_id, _task, _technician, _due_date);
    }
}