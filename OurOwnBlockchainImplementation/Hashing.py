import hashlib
import random
import blockchain
import time

msg = u'Test'
hash = blockchain.hash_me(msg)

print('Message: ' + msg)
print('Hash: ' + hash)

difficulty = 4
while True:
    current_try = blockchain.hash_me(random.getrandbits(256))
    result = hash + current_try

    decodedHash = blockchain.hash_me(result)

    hashState = True
    for i in range(difficulty):
        if decodedHash[i] != '0':
            hashState = False
            break

    if hashState:
        print('Found Block')
        print(decodedHash)
        break

'''
difficulty = 5

timeStamps = []
for i in range(360):
    print(str(i) + ' ', end='')
    start_time = time.time()
    while True:
        decodedHash = hashlib.sha256(str(random.getrandbits(256)).encode('utf-8')).hexdigest()

        hashState = True
        for i in range(difficulty):
            if decodedHash[i] != '0':
                hashState = False
                break

        if hashState:
            print('Found Block')
            break
            
'''