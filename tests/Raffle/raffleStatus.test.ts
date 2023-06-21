import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';

import { createNewRaffleEvent, handleNewRaffles } from '../utils/events/raffleFactory';

import { RaffleConfig } from '../utils/raffleConfig';
import { BORED_APE, CREATOR_ADDRESS, RAFFLE_1_ADDRESS, Status, USDC } from '../utils/constants';
import {
    createAddedTokenToWhitelistEvent,
    handleAddedTokenToWhitelists,
} from '../utils/events/tokenWhitelist';
import {
    createAddedNFTToWhitelistEvent,
    handleAddedNFTToWhitelists,
} from '../utils/events/nftWhitelist';
import { createRaffleStatusEvent } from '../utils/events/raffle';
import { RAFFLE_ENTITY_TYPE } from '../utils/entities';
import { handleRaffleStatus } from '../../src/mapping/raffle';

describe('Raffle - RaffleStatus', () => {
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
    test('should move raffle status to DRAWNING', () => {
        const newStatusEvent = createRaffleStatusEvent(RAFFLE_1_ADDRESS, Status.DRAWNING);
        handleRaffleStatus(newStatusEvent);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'DRAWNING');
    });
    test('should move raffle status to DRAWN', () => {
        const newStatusEvent = createRaffleStatusEvent(RAFFLE_1_ADDRESS, Status.DRAWN);
        handleRaffleStatus(newStatusEvent);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'DRAWN');
    });
    test('should move raffle status to REFUNDABLE', () => {
        const newStatusEvent = createRaffleStatusEvent(RAFFLE_1_ADDRESS, Status.REFUNDABLE);
        handleRaffleStatus(newStatusEvent);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'REFUNDABLE');
    });
    test('should move raffle status to CANCELLED', () => {
        const newStatusEvent = createRaffleStatusEvent(RAFFLE_1_ADDRESS, Status.CANCELLED);
        handleRaffleStatus(newStatusEvent);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'CANCELLED');
    });
});
