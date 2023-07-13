import { Address, BigInt, log } from '@graphprotocol/graph-ts';

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
import { NewRaffleRaffleParamsStruct } from '../../generated/RaffleFactory/RaffleFactoryEvents';

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
        const symbol = ERC20Contract.try_symbol();
        if (!symbol.reverted) {
            token.symbol = symbol.value;
        } else {
            log.error('Error in getting token symbol from contract: {}', [
                tokenAddress.toHexString(),
            ]);
        }
        const decimals = ERC20Contract.try_decimals();
        if (!decimals.reverted) {
            token.decimals = decimals.value;
        } else {
            log.error('Error in getting token decimals from contract: {}', [
                tokenAddress.toHexString(),
            ]);
        }
        token.save();
    }
    return token;
}

export function getOrInitNFT(nftCollectionAddress: Address): NFT {
    let nftId = getNFTId(nftCollectionAddress);
    let nft = NFT.load(nftId);
    if (!nft) {
        nft = new NFT(nftId);
        nft.royaltiesRecipent = '';
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
    params: NewRaffleRaffleParamsStruct,
    blockTimestamp: BigInt
): void {
    let raffleId = getRaffleId(raffleAddress);
    let raffle = Raffle.load(raffleId);
    if (raffle) {
        log.error('raffle {} already exist', [raffleAddress.toHexString()]);
        throw new Error('raffle ' + raffleAddress.toHexString() + ' already exist');
    }
    raffle = new Raffle(raffleId);
    raffle.status = 'OPEN';
    raffle.createAt = blockTimestamp;
    raffle.implementationManager = params.implementationManager.toHexString();
    raffle.raffleFactory = factoryAddress.toHexString();
    raffle.nftId = params.nftId;
    raffle.maxTicketSupply = params.maxTicketSupply;
    raffle.endTicketSales = params.endTicketSales;
    raffle.salesDuration = params.endTicketSales.minus(blockTimestamp);
    raffle.maxTicketPerWallet = params.maxTicketPerWallet;
    raffle.minTicketThreshold = params.minTicketThreshold;
    raffle.ticketPrice = params.ticketPrice;
    raffle.protocolFeeRate = params.protocolFeeRate;
    raffle.insuranceRate = params.insuranceRate;
    raffle.royaltiesRate = params.royaltiesRate;
    raffle.isETH = params.isEthRaffle;

    raffle.isTicketsSoldUnderMinThreshold = params.minTicketThreshold > 0 ? true : false;
    raffle.currentTicketSold = 0;
    raffle.winningTicketNumber = 0;
    raffle.winnerClaimed = false;
    raffle.creatorClaimed = false;
    raffle.creatorAmountEarned = zeroBI();
    raffle.treasuryAmountEarned = zeroBI();
    raffle.royaltiesAmountSent = zeroBI();
    raffle.participantsAmountRefunded = 0;

    let user = getOrInitUser(params.creator, blockTimestamp);

    user.overallCreatedRaffle = user.overallCreatedRaffle + 1;
    raffle.creator = user.id;

    if (!params.isEthRaffle) {
        let token = getOrInitToken(params.purchaseCurrency);
        raffle.token = token.id;
    }

    let nft = getOrInitNFT(params.nftContract);
    raffle.nft = nft.id;

    user.save();
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

export function getOrInitUser(userAddress: Address, blockTimestamp: BigInt): User {
    let userId = getUserId(userAddress);
    let user = User.load(userId);
    if (!user) {
        user = new User(userId);
        user.joinAt = blockTimestamp;
        user.save();
    }
    return user;
}

export function getOrInitParticipant(
    raffleAddress: Address,
    userAddress: Address,
    blockTimestamp: BigInt
): Participant {
    let participantId = getParticipantId(raffleAddress, userAddress);
    let participant = Participant.load(participantId);
    if (!participant) {
        const user = getOrInitUser(userAddress, blockTimestamp);
        user.overallRaffleParticipation = user.overallRaffleParticipation + 1;
        participant = new Participant(participantId);
        participant.numberOfTicketsPurchased = 0;
        participant.numbers = [];
        participant.raffle = getRaffleId(raffleAddress);
        participant.user = user.id;
        participant.claimedRefund = false;
        participant.refundAmount = zeroBI();
        participant.save();
        user.save();
    }
    return participant;
}
