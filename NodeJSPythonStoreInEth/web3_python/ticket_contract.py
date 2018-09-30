from contract import Contract


class TicketContract(Contract):
    def __init__(self, w3, private_key, account, path, contract_addr):
        super().__init__(w3, private_key, account, path)
        self._contract_obj = self._w3.eth.contract(address=contract_addr, abi=self._abi)

    def get_ticket_number(self):
        return self._contract_obj.functions.getTicketNumber().call()

    def get_text(self):
        return self._contract_obj.functions.getText().call()

    def get_planned_date(self):
        return self._contract_obj.functions.getPlannedDate().call()

    def get_planned_time(self):
        return self._contract_obj.functions.getPlannedTime().call()

    def get_ticket_timestamp(self):
        return self._contract_obj.functions.getTicketTimestamp().call()

    def get_state(self):
        return self._contract_obj.functions.getState().call()

    def set_planned_time(self, hour, minute):
        transaction = self._contract_obj.functions.setPlannedTime(hour, minute).buildTransaction()
        transaction_hash = self.send_transaction(transaction)
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
        print('transaction_hash: ', transaction_hash.hex())
        self._w3.eth.waitForTransactionReceipt(transaction_hash)

    def set_planned_date(self, day, month, year):
        transaction = self._contract_obj.functions.setPlannedDate(day, month, year).buildTransaction()
        transaction_hash = self.send_transaction(transaction)
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
        print('transaction_hash: ', transaction_hash.hex())
        self._w3.eth.waitForTransactionReceipt(transaction_hash)

    def set_state(self, state):
        transaction = self._contract_obj.functions.setState(state).buildTransaction()
        transaction_hash = self.send_transaction(transaction)
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
        print('transaction_hash: ', transaction_hash.hex())
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
