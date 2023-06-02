import { BigInt } from '@graphprotocol/graph-ts';

export class RaffleConfig {
    implementationManager: string = '0xEed7187bc58344BA5c36dc7bCe13177C261AF41B'.toLowerCase();
    nftId: BigInt = BigInt.fromI32(10);
    ticketPrice: BigInt = BigInt.fromString('10000000000000000000');
    salesDuration: BigInt = BigInt.fromI32(86400);
    endTicketSales: BigInt = BigInt.fromI32(864000);
    maxTicketSupply: i32 = 10_000;
    maxTicketsAllowedToPurchasePerWallet: i32 = 10;
    ticketSalesInsurance: i32 = 1_000;
    protocolFeeRate: i32 = 250;
    insuranceRate: i32 = 500;
    royaltiesRate: i32 = 0;
    isEthRaffle: boolean = true;

    constructor(
        public readonly creator: string,
        public readonly address: string,
        public readonly token: string,
        public readonly nftContract: string
    ) {}
}
