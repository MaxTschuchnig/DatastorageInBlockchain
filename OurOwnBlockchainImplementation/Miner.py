from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread
from time import sleep
import hashlib
import random
import http.client
import ipService
import re, json
import blockchain

# TODO: If new Block received, check hash to see if block is really solved

routerIp = '10.20.20.42'

chain = []
state = {}

peers = []
transactions = []

block_transaction_limit = 5

found_block = False
difficulty = 5

def get_content_length(header):
    m = re.search('Content-Length: (\w+)', str(header))
    if m != None:
        return m.group(1)

    return 0


def connect_to_network():
    myIp = ipService.get_ip()
    conn = http.client.HTTPConnection(routerIp, 8000)
    conn.request('POST', '/', str(myIp))
    r1 = conn.getresponse()
    # data1 = r1.read()


def connect_fake_peers_to_network(numberPeers):
    for i in range(0, numberPeers):
        myIp = '192.168.0.' + str(i)
        conn = http.client.HTTPConnection(routerIp, 8000)
        conn.request('POST', '/', str(myIp))


def get_peers():
    myIp = ipService.get_ip()
    conn = http.client.HTTPConnection(routerIp, 8000)
    conn.request("GET", "/", str(myIp))
    r1 = conn.getresponse()
    data1 = r1.read()

    if r1.status == 200:
        return data1


def make_transaction():
    player = input('Alice/Bob pays other: ')
    amount = input('Amount: ')

    txn = ''
    if player == 'Alice':
        txn = blockchain.make_transaction(u'Alice', u'Bob', amount)
    elif player == 'Bob': \
        txn = blockchain.make_transaction(u'Bob', u'Alice', amount)

    if blockchain.is_valid_txn(txn, state):
        broadcast_new_transaction(txn)


def broadcast_new_transaction(transaction):
    for peer in peers:
        print('current peer on port 12345: ' + peer)
        conn = http.client.HTTPConnection(str(peer), 12345)
        conn.request("POST", "/", json.dumps(transaction, sort_keys = True))
        conn.getresponse()


def transaction_threaded_function():
    while True:
        make_transaction()


def mine(hashToMine, difficulty):
    while True:
        decodedHash = hashlib.sha256(str(random.getrandbits(256)).encode('utf-8')).hexdigest()

        hashState = True
        for i in range(difficulty):
            if decodedHash[i] != '0':
                hashState = False
                break

        if hashState:
            print('Found Block')
            # send block to all peers
            break


def get_state(peers):
    foundPeers = []
    # Ask all peers for state
    for peer in peers:
        conn = http.client.HTTPConnection(str(peer), 12345)
        myIp = ipService.get_ip()
        conn.request('HEAD', '/', 'StateInfo')
        r1 = conn.getresponse()

        if r1.status == 200:
            foundPeers.append(peer)
            break

    # If no peer has the state, ask peers of peers (recursion) - Not Working
    if len(foundPeers) == 0:
        print('No Peer has state, fix recursion')

    # If peer with state was found, ask for state
    print('Getting state from: ' + foundPeers[0])

    conn = http.client.HTTPConnection(str(foundPeers[0]), 12345)
    myIp = ipService.get_ip()
    conn.request('GET', '/', 'State')
    r1 = conn.getresponse()
    data1 = r1.read()

    return data1


def get_chain(peers):
    foundPeers = []
    # Ask all peers for chain
    for peer in peers:
        conn = http.client.HTTPConnection(str(peer), 12345)
        myIp = ipService.get_ip()
        conn.request('HEAD', '/', 'ChainInfo')
        r1 = conn.getresponse()

        if r1.status == 200:
            foundPeers.append(peer)
            break

    # If no peer has a chain, ask peers of peers (recursion) - Not Working
    if len(foundPeers) == 0:
        '''
        for peer in peers:
            conn = http.client.HTTPConnection(str(peer), 8888)
            myIp = ipService.get_ip()
            conn.request('HEAD', 'ChainPeerInfo', str(myIp))

            return get_chain(peers) # Do it all again, now with loaded Data
        Not working '''

    # If peer with chain was found, ask for chain
    print('Getting Chain from: ' + foundPeers[0])

    conn = http.client.HTTPConnection(str(foundPeers[0]), 12345)
    myIp = ipService.get_ip()
    conn.request('GET', '/', 'Chain')
    r1 = conn.getresponse()
    data1 = r1.read()

    return data1


# HTTPRequestHandler class
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    # HEAD
    def do_HEAD(self):
        len = int(get_content_length(str(self.headers)))
        message = str(self.rfile.read(len))

        if message == "b'ChainInfo'":
            # Send response status code
            if chain == None:
                self.send_response(404)
            else:
                self.send_response(200)

        if message == "b'StateInfo'":
            # Send response status code
            if state == None:
                self.send_response(404)
            else:
                self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Write content as utf-8 data
        self.wfile.write(bytes(str(message), "utf8"))
        return

    # GET
    def do_GET(self):
        len = int(get_content_length(str(self.headers)))
        message = str(self.rfile.read(len))
        msg = ''

        if message == "b'Chain'":
            msg = json.dumps(chain, sort_keys=True)
        if message == "b'State'":
            msg = json.dumps(state, sort_keys=True)

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Write content as utf-8 data
        self.wfile.write(bytes(msg, "utf8"))
        return

    # POST
    def do_POST(self):
        length = int(get_content_length(str(self.headers)))
        message = self.rfile.read(length)

        if length > 40:
            block = json.loads(message)
            add_block(block)
        else:
            txn = json.loads(message)
            add_transaction(txn)

        msg = 'In Post'

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Write content as utf-8 data
        self.wfile.write(bytes(msg, "utf8"))
        return


def add_block(block):
    global chain
    if blockchain.check_block_validity(block, chain[len(chain) - 1], state):
        tempChain = json.dumps(chain, sort_keys = True)
        tempChain = json.loads(tempChain)
        tempChain.append(block)
        if blockchain.check_chain(tempChain):
            chain.append(block)
            print('New, valid chain')
            print(chain)

            print('New State')
            print(state)
            global found_block
            found_block = True

    return


def add_transaction(txn):
    global state
    if blockchain.is_valid_txn(txn, state):
        state = blockchain.update_state(txn, state)
        global transactions
        transactions.append(txn)

    return


def starting_web_interface_thread():
    server_address = ('0.0.0.0', 12345)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('running web interface...')
    httpd.serve_forever()
    print('web interface stopped')


def run():
    print('connect_to_network')
    connect_to_network()

    # print('connect_fake_peers_to_network')
    # connect_fake_peers_to_network(5)

    global peers
    peers = get_peers()
    peers = re.findall('(\d+.\d+.\d+.\d+)', str(peers))

    thread = Thread(target=starting_web_interface_thread, args=())
    thread.start()

    sleep(1)

    global chain
    chain = json.loads(get_chain(peers))
    print(chain)

    global state
    state = get_state(peers)
    state = json.loads(state)
    print(state)

    print('Starting Transaction Thread')
    thread = Thread(target=transaction_threaded_function, args = ())
    thread.start()

    print(peers)

    while True:
        sleep(1)
        global transactions
        if len(transactions) >= block_transaction_limit:
            global found_block
            found_block = False
            hash = start_mining(chain[len(chain) - 1])
            if hash == 'none':
                continue

            new_block = blockchain.make_block(transactions, chain)
            if blockchain.check_block_validity(new_block, chain[len(chain) - 1], state):

                for peer in peers:
                    conn = http.client.HTTPConnection(peer, 12345)
                    conn.request('POST', '/', json.dumps(new_block, sort_keys = True))

                transactions = []
            else:
                print('Block not valid')


def start_mining(parent_block):
    print('Mining new Block')

    hash_to_mine = blockchain.hash_me(parent_block)

    while found_block == False:
        current_try = blockchain.hash_me(random.getrandbits(256))
        result = hash_to_mine + current_try

        decodedHash = blockchain.hash_me(result)

        hashState = True
        for i in range(difficulty):
            if decodedHash[i] != '0':
                hashState = False
                break

        if hashState:
            return decodedHash

    return 'none'