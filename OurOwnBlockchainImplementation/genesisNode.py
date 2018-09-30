import blockchain

genesisState = {u'Alice': 50, u'Bob': 50}
genesisChain = []

def run():
    genesis_block_txns = [genesisState]
    genesis_block_contents = {u'blockNumber': 0, u'parentHash': None, u'txnCount': 1, u'txns': genesis_block_txns}
    genesis_hash = blockchain.hash_me(genesis_block_contents)
    genesis_block = {u'hash': genesis_hash, u'contents': genesis_block_contents}
    genesis_block_string = blockchain.json.dumps(genesis_block, sort_keys=True)

    global genesisChain
    genesisChain = [genesis_block_string]

    print(genesisChain)

    # import and run miner, after genesis creation
    import Miner
    Miner.chain = genesisChain
    Miner.state = genesisState
    Miner.run()

run()
