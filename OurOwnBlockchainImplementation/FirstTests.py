# Maximilian Tschuchnig, Tut: http://ecomunsing.com/build-your-own-blockchain

import hashlib, json, sys


# Hashing Function
def hash_me(msg = ''):
    if type(msg) != str:
        #If the message to hash is no message, convert the object into a json string. Before doing this, sort the keys alphanumerically by using sort key.
        msg = json.dumps(msg, sort_keys = True)

    if sys.version_info.major == 2:
        return str(hashlib.sha256(msg).hexdigest(), 'utf-8') # unicode from tut is equivalent to str: https://stackoverflow.com/questions/6812031/how-to-make-unicode-string-with-python3
    else:
        return hashlib.sha256(str(msg).encode('utf-8')).hexdigest()


import random
# equivalent to not seeded
random.seed(0)


# Creates a valid transaction in range of 1 - Max Value-
def make_transaction(maxValue = 3):
    # Creates a random signum by first creating 0 or 1, multiplying it by 2 (0/2) and then subtracting 1
    sign = int(random.getrandbits(1)) * 2 - 1

    amount = random.randint(1, maxValue)
    alicePays = sign * amount
    bobPays = -1 * alicePays

    # u before to create unicode
    return  {u'Alice':alicePays,u'Bob':bobPays}


def update_state(txn, state):
    # Inputs txn, state consisting of account names, transfer amount and account balance

    # create deep copy of state
    _state  = state.copy()

    # If a transaction is valid, then update the state (user) with new transaction, else add User to state for this transaction
    for key in txn:
        if key in state.keys():
            _state[key] += txn[key]
        else:
            _state[key] = txn[key]

    return _state

# rules from Tutorial:
# - The sum of deposits and withdrawals must be 0 (tokens are neither created nor destroyed)
# - A user’s account must have sufficient funds to cover any withdrawals


def is_valid_txn(txn, state):
    # Assume that the transaction is a dictionary keyed by account names

    # If the sum of values (in and out value) is not null, rules are not ok
    if sum(txn.values()) != 0:
        return False

    # Check for overdraft
    for key in txn.keys():
        if key in state.keys():
            # Look in state for account balance
            acctBalance = state[key]
        else:
            acctBalance = 0

        # Checks if value of transaction key (name) + acct balance is smaller 0, removes overdraft transactions
        if (acctBalance + txn[key]) < 0:
            return False

    return True


def make_block(txns, chain):
    parentBlockString = chain[-1]

    if type(parentBlockString) != str:
        parentBlock = parentBlockString
    else:
        parentBlock = json.loads(parentBlockString)

    parentHash = parentBlock[u'hash']
    blockNumber = parentBlock[u'contents'][u'blockNumber'] + 1
    txnCount = len(txns)
    blockContents = {u'blockNumber':blockNumber,u'parentHash':parentHash,u'txnCount':txnCount,u'txns':txns}
    blockHash = hash_me(blockContents)
    block = {u'hash':blockHash,u'contents':blockContents}

    return block


def check_block_hash(block):
    # Convert block string to object
    if type(block) != str:
        block = block
    else:
        block = json.loads(block)

    # Raise an exception if the hash does not match the block contents
    expectedHash = hash_me(block[u'contents'])
    if block[u'hash'] != expectedHash:
        raise Exception('Hash does not match contents of block %s'%block[u'contents'][u'blockNumber'])
    return


# Checking:
# - Each of the transactions are valid updates to the system state - 1
# - Block hash is valid for the block contents - 2
# - Block number increments the parent block number by 1 - 3
# - Accurately references the parent block's hash - 4
def check_block_validity(block, parent, state):

    # Convert strings to corresponding objects
    if type(block) != str:
        block = block
    else:
        block = json.loads(block)

    if type(parent) != str:
        parent = parent
    else:
        parent = json.loads(parent)

    parentNumber = parent['contents']['blockNumber']
    parentHash = parent['hash']
    blockNumber = block['contents']['blockNumber']

    # Check 1
    for txn in block['contents']['txns']:
        if is_valid_txn(txn, state):
            # State gets incremented (if valid) to allow for checking and adding in check_chain
            state = update_state(txn, state)
        else:
            raise Exception('Invalid transaction in block %s: %s' % (blockNumber, txn))

    # Check 2
    check_block_hash(block)

    # 3
    if blockNumber != (parentNumber + 1):
        raise Exception('Hash does not match contents of block %s' % blockNumber)

    # 4
    if block['contents']['parentHash'] != parentHash:
        raise Exception('Parent hash not accurate at block %s' % blockNumber)

    return state


# Work through the chain from the genesis block (which gets special treatment),
#  checking that all transactions are internally valid,
#    that the transactions do not cause an overdraft,
#    and that the blocks are linked by their hashes.
# This returns the state as a dictionary of accounts and balances,
#   or returns False if an error was detected
def check_chain(chain):
    # Data input processing: Make sure that our chain is a list of dicts
    if type(chain) == str:
        try:
            chain = json.loads(chain)
            assert (type(chain) == list)
        except:  # This is a catch-all, admittedly crude
            return False
    elif type(chain) != list:
        return False

    state = {}
    # Prime the pump by checking the genesis block
    # We want to check the following conditions:
    # - Each of the transactions are valid updates to the system state
    # - Block hash is valid for the block contents

    # Add Transactions of block 0 (genesis block) to new state
    genesis = chain[0]
    # Convert strings to corresponding objects
    if type(genesis) != str:
        genesis = genesis
    else:
        genesis = json.loads(genesis)

    for txn in genesis['contents']['txns']:
        state = update_state(txn, state)
    check_block_hash(chain[0])
    parent = chain[0]

    # Checking subsequent blocks: These additionally need to check
    #    - the reference to the parent block's hash
    #    - the validity of the block number
    for block in chain[1:]:
        state = check_block_validity(block, parent, state)
        parent = block

    return state


'''
Test Function is_valid_txn

state = {u'Alice':5,u'Bob':5}

print(is_valid_txn({u'Alice': -3, u'Bob': 3},state))  # Basic transaction- this works great!
print(is_valid_txn({u'Alice': -4, u'Bob': 3},state))  # But we can't create or destroy tokens!
print(is_valid_txn({u'Alice': -6, u'Bob': 6},state))  # We also can't overdraft our account.
print(is_valid_txn({u'Alice': -4, u'Bob': 2,'Lisa':2},state)) # Creating new users is valid
print(is_valid_txn({u'Alice': -4, u'Bob': 3,'Lisa':2},state)) # But the same rules still apply!
'''

# creating test transactions
txn_buffer = [make_transaction() for i in range(30)]
print(txn_buffer)

# Creating Starting State
state = {u'Alice':50,u'Bob':50}

# Creating Genesis Block
genesis_block_txns = [state]
genesis_block_contents = {u'blockNumber':0,u'parentHash':None,u'txnCount':1,u'txns':genesis_block_txns}
genesis_hash = hash_me(genesis_block_contents)
genesis_block =  {u'hash':genesis_hash,u'contents':genesis_block_contents}
genesis_block_string = json.dumps(genesis_block, sort_keys = True)

chain = [genesis_block_string]

print(chain)

block_size_limit = 5 # Arbitrary number of transactions per minute

while len(txn_buffer) > 0:
    buffer_start_size = len(txn_buffer)

    # List of currently handled transactions
    txn_list = []

    # While the len of all transactions is greater 0 and the len of the current transactions < transactions limit
    while (len(txn_buffer) > 0) & (len(txn_list) < block_size_limit):
        # Get First Transaction and remove from buffer
        new_txn = txn_buffer.pop()
        valid_txn = is_valid_txn(new_txn, state)

        if valid_txn:
            txn_list.append(new_txn)
            state = update_state(new_txn, state)
        else:
            print('Faulty Transaction, ignoring ...')

            # move on
            continue

    myBlock = make_block(txn_list, chain)
    chain.append(myBlock)

for i in chain:
    print(i)
print(state)

check_chain(chain)
chainAsText = json.dumps(chain,sort_keys=True)
check_chain(chainAsText)