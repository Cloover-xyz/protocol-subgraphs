import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';

import { createNewRaffleEvent, handleNewRaffles } from '../utils/events/raffleFactory';
import {
    RAFFLE_ENTITY_TYPE,
    RAFFLE_FACTORY_ENTITY_TYPE,
    USER_ENTITY_TYPE,
} from '../utils/entities';
import { RaffleFactory, Raffle } from '../../generated/schema';
import { ethereum } from '@graphprotocol/graph-ts';
import { RaffleConfig } from '../utils/raffleConfig';
import {
    BORED_APE,
    CREATOR_ADDRESS,
    DEGODS,
    RAFFLE_2_ADDRESS,
    RAFFLE_1_ADDRESS,
    RAFFLE_FACTORY_ADDRESS,
    USDC,
    jEUR,
} from '../utils/constants';
import {
    createAddedTokenToWhitelistEvent,
    handleAddedTokenToWhitelists,
} from '../utils/events/tokenWhitelist';
import {
    createAddedNFTToWhitelistEvent,
    handleAddedNFTToWhitelists,
} from '../utils/events/nftWhitelist';

describe('RaffleFactory - New Raffle created', () => {
    beforeEach(() => {
        const addUSDCEvent = createAddedTokenToWhitelistEvent(USDC);
        const addjEUREvent = createAddedTokenToWhitelistEvent(jEUR);
        handleAddedTokenToWhitelists([addUSDCEvent, addjEUREvent]);

        const addBoredApeEvent = createAddedNFTToWhitelistEvent(BORED_APE);
        const addDegodsEvent = createAddedNFTToWhitelistEvent(DEGODS);
        handleAddedNFTToWhitelists([addBoredApeEvent, addDegodsEvent]);
    });
    afterEach(() => {
        clearStore();
    });

    test('should handle new raffle', () => {
        const raffleConfig = new RaffleConfig(
            CREATOR_ADDRESS,
            RAFFLE_1_ADDRESS,
            USDC.address,
            BORED_APE.address
        );
        const newRaffleEvent = createNewRaffleEvent(raffleConfig);
        handleNewRaffles([newRaffleEvent]);
        const raffleFactory = RaffleFactory.load(RAFFLE_FACTORY_ADDRESS)!;
        assert.fieldEquals(RAFFLE_FACTORY_ENTITY_TYPE, RAFFLE_FACTORY_ADDRESS, 'raffleCount', '1');
        // assert.equals(
        //     ethereum.Value.fromI32(raffleFactory.raffles.length),
        //     ethereum.Value.fromI32(1)
        // );
        // assert.equals(
        //     ethereum.Value.fromString(raffleFactory.raffles[0]),
        //     ethereum.Value.fromString(RAFFLE_1_ADDRESS)
        // );

        assert.entityCount(RAFFLE_ENTITY_TYPE, 1);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'id', RAFFLE_1_ADDRESS);
        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'OPEN');
        assert.fieldEquals(USER_ENTITY_TYPE, CREATOR_ADDRESS, 'overallCreatedRaffle', '1');
    });

    test('should handle multi new raffle', () => {
        const raffleConfig_1 = new RaffleConfig(
            CREATOR_ADDRESS,
            RAFFLE_1_ADDRESS,
            USDC.address,
            BORED_APE.address
        );
        const newRaffle1Event = createNewRaffleEvent(raffleConfig_1);
        const raffleConfig_2 = new RaffleConfig(
            CREATOR_ADDRESS,
            RAFFLE_2_ADDRESS,
            jEUR.address,
            DEGODS.address
        );
        const newRaffle2Event = createNewRaffleEvent(raffleConfig_2);
        handleNewRaffles([newRaffle1Event, newRaffle2Event]);
        const raffleFactory = RaffleFactory.load(RAFFLE_FACTORY_ADDRESS)!;
        assert.fieldEquals(USER_ENTITY_TYPE, CREATOR_ADDRESS, 'overallCreatedRaffle', '2');
        assert.fieldEquals(RAFFLE_FACTORY_ENTITY_TYPE, RAFFLE_FACTORY_ADDRESS, 'raffleCount', '2');
        // assert.equals(
        //     ethereum.Value.fromI32(raffleFactory.raffles.length),
        //     ethereum.Value.fromI32(2)
        // );
        // assert.equals(
        //     ethereum.Value.fromString(raffleFactory.raffles[0]),
        //     ethereum.Value.fromString(RAFFLE_1_ADDRESS)
        // );
        // assert.equals(
        //     ethereum.Value.fromString(raffleFactory.raffles[1]),
        //     ethereum.Value.fromString(RAFFLE_2_ADDRESS)
        // );

        assert.entityCount(RAFFLE_ENTITY_TYPE, 2);
    });
});
