import {
    assert,
    clearStore,
    test,
    describe,
    afterEach,
    beforeEach,
} from 'matchstick-as/assembly/index';
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
    createCreatorClaimedInsuranceEvent,
    createTicketsPurchasedEvent,
    handeTicketsPurchases,
} from '../utils/events/raffle';
import { handleCreatorClaimedInsurance } from '../../src/mapping/raffle';
import { Raffle } from '../../generated/schema';

describe('Raffle - CreatorClaimedInsurance', () => {
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

    test('should handle creator claimed insurance event', () => {
        const newCreatorClaimedInsuranceEvent =
            createCreatorClaimedInsuranceEvent(RAFFLE_1_ADDRESS);

        handleCreatorClaimedInsurance(newCreatorClaimedInsuranceEvent);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'creatorClaimed', 'true');
    });
    test('should set raffle status to FINISHED when creator claim insurance after users', () => {
        const raffle = Raffle.load(RAFFLE_1_ADDRESS)!;
        raffle.amountOfParticipantsRefunded = 2;
        raffle.save();

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'DEFAULT');

        const newCreatorClaimedInsuranceEvent =
            createCreatorClaimedInsuranceEvent(RAFFLE_1_ADDRESS);

        handleCreatorClaimedInsurance(newCreatorClaimedInsuranceEvent);

        assert.fieldEquals(RAFFLE_ENTITY_TYPE, RAFFLE_1_ADDRESS, 'status', 'FINISHED');
    });
});
