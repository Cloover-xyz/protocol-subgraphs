import { Address, log } from '@graphprotocol/graph-ts';

import {
    NFT,
    NFTWhitelist,
    Token,
    TokenWhitelist,
    RaffleFactory,
    Raffle,
    User,
    Participant,
} from '../../generated/schema';
import { IERC20Detailed } from '../../generated/TokenWhitelist/IERC20Detailed';
import { RaffleContract } from '../../generated/RaffleFactory/RaffleContract';

import {
    getFactoryId,
    getNFTId,
    getNFTWhitelistId,
    getParticipantId,
    getRaffleId,
    getTokenId,
    getTokenWhitelistId,
    getUserId,
} from '../utils/id-generation';
import { zeroBI } from '../utils/converters';
import { NewRaffleRaffleParamsStruct } from '../../generated/RaffleFactory/RaffleFactory';

export function getOrInitTokenWhitelist(tokenWhitelistAddress: Address): TokenWhitelist {
    let tokenWhitelistId = getTokenWhitelistId(tokenWhitelistAddress);
    let tokenWhitelist = TokenWhitelist.load(tokenWhitelistId);
    if (!tokenWhitelist) {
        tokenWhitelist = new TokenWhitelist(tokenWhitelistId);
        tokenWhitelist.tokenCount = zeroBI();
        tokenWhitelist.tokens = [];
        tokenWhitelist.save();
    }
    return tokenWhitelist;
}
export function getOrInitNFTWhitelist(nftWhitelistAddress: Address): NFTWhitelist {
    let nftWhitelistId = getNFTWhitelistId(nftWhitelistAddress);
    let nftWhitelist = NFTWhitelist.load(nftWhitelistId);
    if (!nftWhitelist) {
        nftWhitelist = new NFTWhitelist(nftWhitelistId);
        nftWhitelist.collectionCount = zeroBI();
        nftWhitelist.nfts = [];
        nftWhitelist.save();
    }
    return nftWhitelist;
}

export function getOrInitToken(tokenAddress: Address): Token {
    let tokenId = getTokenId(tokenAddress);
    let token = Token.load(tokenId);
    if (!token) {
        token = new Token(tokenId);
        let ERC20Contract = IERC20Detailed.bind(tokenAddress);
        token.symbol = ERC20Contract.symbol();
        token.decimals = ERC20Contract.decimals();
        token.save();
    }
    return token;
}

export function getOrInitNFT(nftCollectionAddress: Address): NFT {
    let nftId = getNFTId(nftCollectionAddress);
    let nft = NFT.load(nftId);
    if (!nft) {
        nft = new NFT(nftId);
        nft.creator = '';
        nft.save();
    }
    return nft;
}

export function getOrInitRaffleFactory(factoryAddress: Address): RaffleFactory {
    let factoryId = getFactoryId(factoryAddress);
    let factory = RaffleFactory.load(factoryId);
    if (!factory) {
        factory = new RaffleFactory(factoryId);
        factory.raffleCount = zeroBI();
        factory.save();
    }
    return factory;
}

export function initRaffle(
    factoryAddress: Address,
    raffleAddress: Address,
    params: NewRaffleRaffleParamsStruct
): void {
    let raffleId = getRaffleId(raffleAddress);
    let raffle = Raffle.load(raffleId);
    if (raffle) {
        log.error('raffle {} already exist', [raffleAddress.toHexString()]);
        throw new Error('raffle ' + raffleAddress.toHexString() + ' already exist');
    }
    raffle = new Raffle(raffleId);
    raffle.status = 'DEFAULT';
    raffle.implementationManager = params.implementationManager.toHexString();
    raffle.raffleFactory = factoryAddress.toHexString();
    raffle.nftId = params.nftId;
    raffle.maxTotalSupply = params.maxTotalSupply;
    raffle.ticketSalesDuration = params.ticketSalesDuration;
    raffle.maxTicketAllowedToPurchase = params.maxTicketAllowedToPurchase;
    raffle.ticketSalesInsurance = params.ticketSalesInsurance;
    raffle.ticketPrice = params.ticketPrice;
    raffle.protocolFeeRate = params.protocolFeeRate;
    raffle.insuranceRate = params.insuranceRate;
    raffle.royaltiesRate = params.royaltiesRate;
    raffle.isETH = params.isEthRaffle;
    raffle.currentSupply = 0;

    let raffleContract = RaffleContract.bind(raffleAddress);
    raffle.endTicketSales = raffleContract.endTicketSales();

    let user = getOrInitUser(params.creator);
    raffle.creator = user.id;

    let token = getOrInitToken(params.purchaseCurrency);
    raffle.token = token.id;

    let nft = getOrInitNFT(params.nftContract);
    raffle.nft = nft.id;

    raffle.save();
}

export function getRaffle(raffleAddress: Address): Raffle {
    let raffleId = getRaffleId(raffleAddress);
    let raffle = Raffle.load(raffleId);
    if (!raffle) {
        log.error('raffle {} does not exist', [raffleAddress.toHexString()]);
        throw new Error('raffle ' + raffleAddress.toHexString() + ' does not exist');
    }
    return raffle;
}

export function getOrInitUser(userAddress: Address): User {
    let userId = getUserId(userAddress);
    let user = User.load(userId);
    if (!user) {
        user = new User(userId);
        user.save();
    }
    return user;
}

export function getOrInitParticipant(raffleAddress: Address, userAddress: Address): Participant {
    let participantId = getParticipantId(raffleAddress, userAddress);
    let participant = Participant.load(participantId);
    if (!participant) {
        const user = getOrInitUser(userAddress);
        participant = new Participant(participantId);
        participant.numberOfTicketsPurchased = 0;
        participant.numbers = [];
        participant.raffle = getRaffleId(raffleAddress);
        participant.user = user.id;
        participant.save();
    }
    return participant;
}
