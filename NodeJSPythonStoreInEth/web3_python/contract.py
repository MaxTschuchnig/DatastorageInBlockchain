from solc import compile_files


class Contract:
    def __init__(self, w3, private_key, account, path):
        self._w3 = w3
        self._private_key = private_key
        self.account = account
        self._path = path
        self._abi = None
        self._bytecode = None
        self.compile_contract()

    def send_transaction(self, transaction):
        nonce = self._w3.eth.getTransactionCount(self.account.address)
        transaction["nonce"] = nonce
        transaction["chainId"] = 15
        signed_transaction = self._w3.eth.account.signTransaction(transaction, self._private_key)
        transaction_hash = self._w3.eth.sendRawTransaction(signed_transaction.rawTransaction)
        return transaction_hash

    def compile_contract(self):
        compiled_sol = compile_files(self._path)
        contract_id, contract_interface = compiled_sol.popitem()
        self._abi = contract_interface['abi']
        self._bytecode = contract_interface['bin']
        return {'abi': self._abi, 'contract_data': self._bytecode}
