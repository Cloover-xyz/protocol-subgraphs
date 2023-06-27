import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';
import { BigInt } from '@graphprotocol/graph-ts';
import { createNewRaffleEvent, handleNewRaffles } from '../utils/events/raffleFactory';
import { PARTICIPANT_ENTITY_TYPE, RAFFLE_ENTITY_TYPE, USER_ENTITY_TYPE } from '../utils/entities';
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
    createTicketsPurchasedEvent,
    createUserClaimedRefundEvent,
    handeTicketsPurchases,
    handleUserClaimedRefunds,
} from '../utils/events/raffle';
import { handleUserClaimedRefund } from '../../src/mapping/raffle';
import { Raffle } from '../../generated/schema';

describe('Raffle - UserClaimedRefund', () => {
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
        handleNewRaffles([newRaffleEvent]);

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
    test('should handle user claimed refunds', () => {
        const userClaimEvent = createUserClaimedRefundEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            BigInt.fromString('1000000000000000000')
        );
        handleUserClaimedRefund(userClaimEvent);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'participantsAmountRefunded', '1');
        assert.fieldEquals(
            USER_ENTITY_TYPE,
            PARTICIPANT_1_ADDRESS,
            'overallParticipationsRefunded',
            '1'
        );
        const participantId = `${RAFFLE_1_ADDRESS}-${PARTICIPANT_1_ADDRESS}`;
        assert.fieldEquals(PARTICIPANT_ENTITY_TYPE, participantId, 'claimedRefund', 'true');
        assert.fieldEquals(
            PARTICIPANT_ENTITY_TYPE,
            participantId,
            'refundAmount',
            '1000000000000000000'
        );
    });
    test('should handle multiple user claimed refunds', () => {
        const user1ClaimEvent = createUserClaimedRefundEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            BigInt.fromString('1000000000000000000')
        );
        const user2ClaimEvent = createUserClaimedRefundEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            BigInt.fromString('5000000000000000000')
        );
        handleUserClaimedRefunds([user1ClaimEvent, user2ClaimEvent]);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'participantsAmountRefunded', '2');
    });
    test('should set raffle status to FINISHED when last user claim refund after creator', () => {
        const raffle = Raffle.load(RAFFLE_1_ADDRESS)!;
        raffle.creatorClaimed = true;
        raffle.save();

        const user1ClaimEvent = createUserClaimedRefundEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            BigInt.fromString('1000000000000000000')
        );
        handleUserClaimedRefund(user1ClaimEvent);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'OPEN');

        const user2ClaimEvent = createUserClaimedRefundEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            BigInt.fromString('5000000000000000000')
        );
        handleUserClaimedRefund(user2ClaimEvent);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'FINISHED');
    });
});
