from contract import Contract


class DataContract(Contract):
    def __init__(self, w3, private_key, account, path):
        super().__init__(w3, private_key, account, path)
        self._contract_obj = None

    def deploy(self, name, customer_addr, plz, city, country):
        trans = self._w3.eth.contract(abi=self._abi, bytecode=self._bytecode).constructor(name,
                                                                                          customer_addr, plz, city,
                                                                                          country).buildTransaction()
        transaction_hash = self.send_transaction(trans)
        print('transaction_hash_deploy: ', transaction_hash.hex())
        self._w3.eth.waitForTransactionReceipt(transaction_hash)
        mined_block = self._w3.eth.getTransactionReceipt(transaction_hash)
        contract_address = mined_block['contractAddress']
        print('deployed_contract: ', contract_address)
        self._contract_obj = self._w3.eth.contract(address=contract_address, abi=self._abi)
        return contract_address

    def get_name(self):
        return self._contract_obj.functions.getName().call()

    def get_customer_address(self):
        return self._contract_obj.functions.getAddressCustomer().call()

    def get_plz(self):
        return self._contract_obj.functions.getPlz().call()

    def get_city(self):
        return self._contract_obj.functions.getCity().call()
