import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';

import { createNewRaffleEvent, handeNewRaffles } from '../utils/events/raffleFactory';

import { RaffleConfig } from '../utils/raffleConfig';
import { BORED_APE, CREATOR_ADDRESS, RAFFLE_1_ADDRESS, USDC } from '../utils/constants';
import {
    createAddedTokenToWhitelistEvent,
    handleAddedTokenToWhitelists,
} from '../utils/events/tokenWhitelist';
import {
    createAddedNFTToWhitelistEvent,
    handleAddedNFTToWhitelists,
} from '../utils/events/nftWhitelist';
import { createRaffleCancelledEvent } from '../utils/events/raffle';
import { RAFFLE_ENTITY_TYPE, USER_ENTITY_TYPE } from '../utils/entities';
import { handleRaffleCancelled } from '../../src/mapping/raffle';

describe('Raffle - Raffle Cancelled', () => {
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
    });
    afterEach(() => {
        clearStore();
    });
    test('should move raffle status to cancelled', () => {
        const newCancelEvent = createRaffleCancelledEvent(RAFFLE_1_ADDRESS);
        handleRaffleCancelled(newCancelEvent);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'CANCELLED');
        assert.fieldEquals(USER_ENTITY_TYPE, CREATOR_ADDRESS, 'rafflesCreatedCancelledCount', '1');
    });
});
