import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';

import { createNewRaffleEvent, handleNewRaffles } from '../utils/events/raffleFactory';
import { PARTICIPANT_ENTITY_TYPE, RAFFLE_ENTITY_TYPE, USER_ENTITY_TYPE } from '../utils/entities';
import { Raffle, Participant } from '../../generated/schema';
import { ethereum } from '@graphprotocol/graph-ts';
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
import { createTicketsPurchasedEvent, handeTicketsPurchases } from '../utils/events/raffle';

describe('Raffle - Tickets Purchased', () => {
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
    });
    afterEach(() => {
        clearStore();
    });

    test('should handle user that purchase one ticket', () => {
        const newPurchaseTicket = createTicketsPurchasedEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            1,
            1
        );
        handeTicketsPurchases([newPurchaseTicket]);

        const raffle = Raffle.load(RAFFLE_1_ADDRESS)!;
        assert.equals(
            ethereum.Value.fromI32(1),
            ethereum.Value.fromI32(raffle.participants.length)
        );
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'currentTicketSold', '1');
        assert.fieldEquals(
            USER_ENTITY_TYPE,
            PARTICIPANT_1_ADDRESS,
            'overallRaffleParticipation',
            '1'
        );
        assert.fieldEquals(USER_ENTITY_TYPE, PARTICIPANT_1_ADDRESS, 'overallTicketPurchase', '1');

        const participantId = `${RAFFLE_1_ADDRESS}-${PARTICIPANT_1_ADDRESS}`;
        const participant = Participant.load(participantId)!;
        assert.equals(
            ethereum.Value.fromI32(1),
            ethereum.Value.fromI32(participant.numbers.length)
        );
        assert.equals(ethereum.Value.fromI32(1), ethereum.Value.fromI32(participant.numbers[0]));
        assert.fieldEquals(PARTICIPANT_ENTITY_TYPE, participantId, 'numberOfTicketsPurchased', '1');
        assert.fieldEquals(PARTICIPANT_ENTITY_TYPE, participantId, 'raffle', RAFFLE_1_ADDRESS);
    });

    test('should handle user that purchase several tickets', () => {
        const newPurchaseTicket = createTicketsPurchasedEvent(
            RAFFLE_1_ADDRESS,
            PARTICIPANT_1_ADDRESS,
            1,
            10
        );
        handeTicketsPurchases([newPurchaseTicket]);

        const raffle = Raffle.load(RAFFLE_1_ADDRESS)!;
        assert.equals(
            ethereum.Value.fromI32(1),
            ethereum.Value.fromI32(raffle.participants.length)
        );
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'currentTicketSold', '10');
        assert.fieldEquals(
            USER_ENTITY_TYPE,
            PARTICIPANT_1_ADDRESS,
            'overallRaffleParticipation',
            '1'
        );
        assert.fieldEquals(USER_ENTITY_TYPE, PARTICIPANT_1_ADDRESS, 'overallTicketPurchase', '10');
        const participantId = `${RAFFLE_1_ADDRESS}-${PARTICIPANT_1_ADDRESS}`;
        const participant = Participant.load(participantId)!;
        assert.equals(
            ethereum.Value.fromI32(10),
            ethereum.Value.fromI32(participant.numbers.length)
        );
        for (let i = 0; i < 10; i++) {
            assert.equals(
                ethereum.Value.fromI32(i + 1),
                ethereum.Value.fromI32(participant.numbers[i])
            );
        }
        assert.fieldEquals(
            PARTICIPANT_ENTITY_TYPE,
            participantId,
            'numberOfTicketsPurchased',
            '10'
        );
        assert.fieldEquals(PARTICIPANT_ENTITY_TYPE, participantId, 'raffle', RAFFLE_1_ADDRESS);
    });
    test('should handle multi participants that purchased several tickets', () => {
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

        const raffle = Raffle.load(RAFFLE_1_ADDRESS)!;
        assert.equals(
            ethereum.Value.fromI32(2),
            ethereum.Value.fromI32(raffle.participants.length)
        );
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'currentTicketSold', '20');

        assert.fieldEquals(
            USER_ENTITY_TYPE,
            PARTICIPANT_1_ADDRESS,
            'overallRaffleParticipation',
            '1'
        );
        assert.fieldEquals(USER_ENTITY_TYPE, PARTICIPANT_1_ADDRESS, 'overallTicketPurchase', '10');

        assert.fieldEquals(
            USER_ENTITY_TYPE,
            PARTICIPANT_2_ADDRESS,
            'overallRaffleParticipation',
            '1'
        );
        assert.fieldEquals(USER_ENTITY_TYPE, PARTICIPANT_2_ADDRESS, 'overallTicketPurchase', '10');

        const participant_1_Id = `${RAFFLE_1_ADDRESS}-${PARTICIPANT_1_ADDRESS}`;
        const participant_1 = Participant.load(participant_1_Id)!;
        assert.equals(
            ethereum.Value.fromI32(10),
            ethereum.Value.fromI32(participant_1.numbers.length)
        );
        for (let i = 0; i < 10; i++) {
            assert.equals(
                ethereum.Value.fromI32(i + 1),
                ethereum.Value.fromI32(participant_1.numbers[i])
            );
        }
        assert.fieldEquals(
            PARTICIPANT_ENTITY_TYPE,
            participant_1_Id,
            'numberOfTicketsPurchased',
            '10'
        );
        assert.fieldEquals(PARTICIPANT_ENTITY_TYPE, participant_1_Id, 'raffle', RAFFLE_1_ADDRESS);

        const participant_2_Id = `${RAFFLE_1_ADDRESS}-${PARTICIPANT_2_ADDRESS}`;
        const participant_2 = Participant.load(participant_2_Id)!;
        assert.equals(
            ethereum.Value.fromI32(10),
            ethereum.Value.fromI32(participant_2.numbers.length)
        );
        for (let i = 0; i < 10; i++) {
            assert.equals(
                ethereum.Value.fromI32(i + 11),
                ethereum.Value.fromI32(participant_2.numbers[i])
            );
        }
        assert.fieldEquals(
            PARTICIPANT_ENTITY_TYPE,
            participant_2_Id,
            'numberOfTicketsPurchased',
            '10'
        );
        assert.fieldEquals(PARTICIPANT_ENTITY_TYPE, participant_2_Id, 'raffle', RAFFLE_1_ADDRESS);
    });
});
