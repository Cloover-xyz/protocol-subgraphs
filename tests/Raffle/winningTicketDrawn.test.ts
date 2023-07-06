import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';

import { createNewRaffleEvent, handleNewRaffles } from '../utils/events/raffleFactory';
import { RAFFLE_ENTITY_TYPE, USER_ENTITY_TYPE } from '../utils/entities';
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
    createWinningTicketDrawnEvent,
    handeTicketsPurchases,
} from '../utils/events/raffle';
import { handleWinningTicketDrawn } from '../../src/mapping/raffle';

describe('Raffle - WinningTicketDrawn', () => {
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

    test('should handle winning ticket drawn and find the winner as first participant', () => {
        let newWinningTicket = createWinningTicketDrawnEvent(RAFFLE_1_ADDRESS, 10);
        handleWinningTicketDrawn(newWinningTicket);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'winningTicketNumber', '10');
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'winner', PARTICIPANT_1_ADDRESS);
        assert.fieldEquals(USER_ENTITY_TYPE, PARTICIPANT_1_ADDRESS, 'overallRafflesWon', '1');
        assert.fieldEquals(USER_ENTITY_TYPE, CREATOR_ADDRESS, 'overallCreatedRaffleEnded', '1');
        newWinningTicket = createWinningTicketDrawnEvent(RAFFLE_1_ADDRESS, 1);
        handleWinningTicketDrawn(newWinningTicket);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'winningTicketNumber', '1');
        assert.fieldEquals(USER_ENTITY_TYPE, PARTICIPANT_1_ADDRESS, 'overallRafflesWon', '2');
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'winner', PARTICIPANT_1_ADDRESS);
        assert.fieldEquals(USER_ENTITY_TYPE, CREATOR_ADDRESS, 'overallCreatedRaffleEnded', '2');
    });
    test('should handle winning ticket drawn and find the winnner as second participant', () => {
        const newWinningTicket = createWinningTicketDrawnEvent(RAFFLE_1_ADDRESS, 11);
        handleWinningTicketDrawn(newWinningTicket);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'winningTicketNumber', '11');
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'winner', PARTICIPANT_2_ADDRESS);
    });
});
