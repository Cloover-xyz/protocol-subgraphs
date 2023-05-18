import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';
import { BigInt } from '@graphprotocol/graph-ts';
import { createNewRaffleEvent, handeNewRaffles } from '../utils/events/raffleFactory';
import { RAFFLE_ENTITY_TYPE } from '../utils/entities';
import { RaffleConfig } from '../utils/raffleConfig';
import {
    BORED_APE,
    CREATOR_ADDRESS,
    PARTICIPANT_1_ADDRESS,
    PARTICIPANT_2_ADDRESS,
    RAFFLE_1_ADDRESS,
    USDC,
} from '../utils/constants';
import {
    createAddedTokenToWhitelistEvent,
    handleAddedTokenToWhitelists,
} from '../utils/events/tokenWhitelist';
import {
    createAddedNFTToWhitelistEvent,
    handleAddedNFTToWhitelists,
} from '../utils/events/nftWhitelist';
import {
    createCreatorClaimedEvent,
    createTicketsPurchasedEvent,
    handeTicketsPurchases,
} from '../utils/events/raffle';
import { handleCreatorClaimed } from '../../src/mapping/raffle';
import { Raffle } from '../../generated/schema';

describe('Raffle - CreatorClaimed', () => {
    beforeEach(() => {
        const addUSDCEvent = createAddedTokenToWhitelistEvent(USDC);
        handleAddedTokenToWhitelists([addUSDCEvent]);

        const addBoredApeEvent = createAddedNFTToWhitelistEvent(BORED_APE);
        handleAddedNFTToWhitelists([addBoredApeEvent]);

        const raffleConfig = new RaffleConfig(
            CREATOR_ADDRESS,
            RAFFLE_1_ADDRESS,
            USDC.address,
            BORED_APE.address
        );
        const newRaffleEvent = createNewRaffleEvent(raffleConfig);
        handeNewRaffles([newRaffleEvent]);

        const newPurchaseTicket_1 = createTicketsPurchasedEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            1,
            10
        );
        const newPurchaseTicket_2 = createTicketsPurchasedEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_2_ADDRESS,
            11,
            10
        );
        handeTicketsPurchases([newPurchaseTicket_1, newPurchaseTicket_2]);
    });
    afterEach(() => {
        clearStore();
    });

    test('should handle creator claimed event', () => {
        let newWinnerClaimed = createCreatorClaimedEvent(
            RAFFLE_1_ADDRESS,
            BigInt.fromString('10000000000000000000'),
            BigInt.fromString('1000000000000000000'),
            BigInt.fromString('2000000000000000000')
        );

        handleCreatorClaimed(newWinnerClaimed);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'creatorClaimed', 'true');

        assert.fieldEquals(
            RAFFLE_ENTITY_TYPE,
            RAFFLE_1_ADDRESS,
            'creatorAmountReceived',
            '10000000000000000000'
        );
        assert.fieldEquals(
            RAFFLE_ENTITY_TYPE,
            RAFFLE_1_ADDRESS,
            'treasuryAmountReceived',
            '1000000000000000000'
        );
        assert.fieldEquals(
            RAFFLE_ENTITY_TYPE,
            RAFFLE_1_ADDRESS,
            'royaltiesAmountReceived',
            '2000000000000000000'
        );
    });
    test('should set raffle status to FINISHED when creator claim prize after winner', () => {
        const raffle = Raffle.load(RAFFLE_1_ADDRESS)!;
        raffle.winnerClaimed = true;
        raffle.save();
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'DEFAULT');

        let newWinnerClaimed = createCreatorClaimedEvent(
            RAFFLE_1_ADDRESS,
            BigInt.fromString('10000000000000000000'),
            BigInt.fromString('1000000000000000000'),
            BigInt.fromString('2000000000000000000')
        );
        handleCreatorClaimed(newWinnerClaimed);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'FINISHED');
    });
});
