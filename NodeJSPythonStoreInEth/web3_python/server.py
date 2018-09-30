from web3 import Web3, HTTPProvider
from data_contract import DataContract
from ticket_contract import TicketContract
from ticket_controller_contract import TicketControllerContract


if __name__ == "__main__":
    ''' some standard settings '''
    w3 = Web3(HTTPProvider('http://185.69.161.123:8545'))
    private_key = '0x0c03891decc0490f49126c452f8e0f4bd0ce489ee06fd478c91fae8be0a6dbfd'
    account = w3.eth.account.privateKeyToAccount(private_key)
    data_cont_path = ['./PersonalData.sol']
    ticket_cont_path = ['./Ticket.sol']
    ticket_system_cont_path = ['./Ticketsystem.sol']

    #-------------------------------------#

    ''''data_contract:'''
    contract = DataContract(w3, private_key, account, data_cont_path)

    ''' deploy the contract & set data'''
    data_cont_address = contract.deploy('Anna', 'Luggaue 72', 9655, 'Luggaue', 'Ö')
    print('data contract address: ', data_cont_address)
    print("Data:")
    print(contract.get_name())
    print(contract.get_customer_address())
    print(contract.get_plz())
    print(contract.get_city())

    #-------------------------------------#

    '''whole ticket system contract'''
    contract = TicketControllerContract(w3, private_key, account, ticket_system_cont_path)

    ''' deploy the contract & set data'''
    ticket_system__cont_address = contract.deploy()
    print('Ticket system contract: ', ticket_system__cont_address)

    '''first ticket'''
    ticket_number = contract.create_ticket('TV geht nicht mehr', data_cont_address)
    ticket_cont_address = contract.get_ticket(ticket_number)
    print('Ticket 1: ', ticket_cont_address)

    contract_obj_ticket = TicketContract(w3, private_key, account, ticket_cont_path, ticket_cont_address)
    print('Text: ', contract_obj_ticket.get_text())
    print('Ticket number: ', contract_obj_ticket.get_ticket_number())

    '''second ticket'''
    ticket_number = contract.create_ticket('Wohnung ist überschwemmt', data_cont_address)
    ticket_cont_address = contract.get_ticket(ticket_number)
    print('Ticket 2: ', ticket_cont_address)

    contract_obj_ticket = TicketContract(w3, private_key, account, ticket_cont_path, ticket_cont_address)
    print('Text: ', contract_obj_ticket.get_text())
    print('Ticket number: ', contract_obj_ticket.get_ticket_number())

    print('Tickets: ', contract.get_all_tickets())
