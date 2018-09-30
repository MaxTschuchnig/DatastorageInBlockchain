from contract import Contract


class TicketControllerContract(Contract):
    def __init__(self, w3, private_key, account, path):
        super().__init__(w3, private_key, account, path)
        self._contract_obj = None

    def deploy(self):
        trans = self._w3.eth.contract(abi=self._abi, bytecode=self._bytecode).constructor().buildTransaction()
        transaction_hash = self.send_transaction(trans)
        print('transaction_hash_deploy: ', transaction_hash.hex())
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
        mined_block = self._w3.eth.getTransactionReceipt(transaction_hash)
        contract_address = mined_block['contractAddress']
        print('deployed_contract: ', contract_address)
        self._contract_obj = self._w3.eth.contract(address=contract_address, abi=self._abi)
        return contract_address

    def create_ticket(self, text, contract_addr):
        event_filter = self._contract_obj.eventFilter('ticketNr')
        transaction = self._contract_obj.functions.createTicket(text, contract_addr).buildTransaction()
        transaction_hash = self.send_transaction(transaction)
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
        print('transaction_hash: ', transaction_hash.hex())
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
        ticket_number = event_filter.get_new_entries()[0].args.tn
        return ticket_number

    def get_ticket(self, ticket_number):
        return self._contract_obj.functions.getTicket(ticket_number).call()

    def get_all_tickets(self):
        return self._contract_obj.functions.getAllTickets().call()
