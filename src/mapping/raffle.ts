import { Address, log } from '@graphprotocol/graph-ts';
import {
    CreatorClaimed,
    CreatorClaimedRefund,
    RaffleCancelled,
    RaffleStatus,
    TicketsPurchased,
    UserClaimedRefund,
    WinnerClaimed,
    WinningTicketDrawn,
} from '../../generated/RaffleFactory/RaffleEvents';
import { getOrInitParticipant, getOrInitUser, getRaffle } from '../helpers/initializers';
import { store } from '@graphprotocol/graph-ts';
import { Participant } from '../../generated/schema';

export function handleTicketsPurchased(event: TicketsPurchased): void {
    const raffle = getRaffle(event.address);

    raffle.currentTicketSold = raffle.currentTicketSold + event.params.nbOfTicketsPurchased;
    const participant = getOrInitParticipant(event.address, event.params.user);
    participant.numberOfTicketsPurchased =
        participant.numberOfTicketsPurchased + event.params.nbOfTicketsPurchased;
    const participantsNumber = participant.numbers;
    for (let i = 0; i < event.params.nbOfTicketsPurchased; i++) {
        participantsNumber.push(event.params.firstTicketnumber + i + 1);
    }
    participant.numbers = participantsNumber;

    const user = getOrInitUser(event.params.user);
    user.overallTicketPurchase = user.overallTicketPurchase + event.params.nbOfTicketsPurchased;
    user.save();
    participant.save();
    raffle.save();
}

export function handleWinningTicketDrawn(event: WinningTicketDrawn): void {
    const raffle = getRaffle(event.address);
    raffle.chainlinkVRFTxHash = event.transaction.hash;
    raffle.winningTicketNumber = event.params.winningTicket;
    raffle.status = 'DRAWN';
    const participantsArray: Participant[] = raffle.participants.load();
    for (let i = 0; i < participantsArray.length; i++) {
        const participantAddress = Address.fromString(participantsArray[i].id.split('-')[1]);
        const participant = getOrInitParticipant(event.address, participantAddress);
        const index = participant.numbers.indexOf(event.params.winningTicket);
        if (index != -1) {
            raffle.winner = participant.user;
            break;
        }
    }
    const creator = getOrInitUser(Address.fromString(raffle.creator));
    creator.overallCreatedRaffleEnded = creator.overallCreatedRaffleEnded + 1;

    const user = getOrInitUser(Address.fromString(raffle.winner!));
    user.overallRaffleWins = user.overallRaffleWins + 1;

    creator.save();
    user.save();
    raffle.save();
}

export function handleWinnerClaimed(event: WinnerClaimed): void {
    const raffle = getRaffle(event.address);
    raffle.winnerClaimed = true;
    if (raffle.creatorClaimed) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
}

export function handleCreatorClaimed(event: CreatorClaimed): void {
    const raffle = getRaffle(event.address);
    raffle.creatorClaimed = true;
    raffle.creatorAmountEarned = event.params.creatorAmountReceived;
    raffle.treasuryAmountEarned = event.params.protocolFeeAmount;
    raffle.royaltiesAmountSent = event.params.royaltiesAmount;
    if (raffle.winnerClaimed) {
        raffle.status = 'FINISHED';
    }
    raffle.save();
}

export function handleUserClaimedRefund(event: UserClaimedRefund): void {
    const raffle = getRaffle(event.address);
    raffle.participantsAmountRefunded = raffle.participantsAmountRefunded + 1;
    const participantsArray = raffle.participants.load();
    if (raffle.participantsAmountRefunded == participantsArray.length && raffle.creatorClaimed) {
        raffle.status = 'FINISHED';
    }
    const participant = getOrInitParticipant(event.address, event.params.user);
    participant.claimedRefund = true;
    participant.refundAmount = event.params.amountReceived;

    const user = getOrInitUser(event.params.user);
    user.overallParticipationsRefunded = user.overallParticipationsRefunded + 1;

    user.save();
    participant.save();
    raffle.save();
}

export function handleCreatorClaimedRefund(event: CreatorClaimedRefund): void {
    const raffle = getRaffle(event.address);
    raffle.creatorClaimed = true;
    const participantsArray = raffle.participants.load();
    if (raffle.participantsAmountRefunded == participantsArray.length) {
        raffle.status = 'FINISHED';
    }
    const creator = getOrInitUser(Address.fromString(raffle.creator));
    creator.overallCreatedRaffleRefunded = creator.overallCreatedRaffleRefunded + 1;

    creator.save();
    raffle.save();
}

export function handleRaffleCancelled(event: RaffleCancelled): void {
    const raffle = getRaffle(event.address);
    raffle.status = 'CANCELLED';

    const creator = getOrInitUser(Address.fromString(raffle.creator));
    creator.overallCreatedRaffleCancelled = creator.overallCreatedRaffleCancelled + 1;

    creator.save();
    raffle.save();
}

export function handleRaffleStatus(event: RaffleStatus): void {
    const raffle = getRaffle(event.address);
    switch (event.params.status) {
        case 1:
            raffle.status = 'DRAWING';
            break;
        case 2:
            raffle.status = 'DRAWN';
            break;
        case 3:
            raffle.status = 'REFUNDABLE';
            break;
        case 4:
            raffle.status = 'CANCELLED';
            break;
        default:
            raffle.status = 'OPEN';
            break;
    }
    raffle.save();
}
