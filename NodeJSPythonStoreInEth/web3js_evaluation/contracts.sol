pragma solidity ^0.4.24;

contract TicketController {
    address[] public addresses;
    int ticketNumber = 0;
	    
    function getTicket(uint tn) public view returns(address) {
        return addresses[tn-1];
    }
    
    function getTicketNumber() public view returns(int) {
        return ticketNumber;
    }
	
	function getAllTickets() public view returns(address[]) {
		return addresses;
	}
    
    function createTicket(string txt, string technician, string due_date) public returns(uint) {
        ticketNumber++;
        Ticket ticket = new Ticket(ticketNumber, txt, technician, due_date);
        addresses.push(address(ticket)); 
    }
}


contract Ticket {
    int _id = 0;
    string _task;
    string _technician;
    string _due_date;
    
    constructor(int tn, string task, string technician, string due_date) public {
        _id = tn;
        _task = task;
        _technician = technician;
        _due_date = due_date;
    }
    
    function getTicket() public constant returns(int, string, string, string) {
        return (_id, _task, _technician, _due_date);
    }
}
