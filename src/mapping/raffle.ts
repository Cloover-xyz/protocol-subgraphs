import { TicketsPurchased } from '../../generated/RaffleFactory/RaffleEvents';
import { getOrInitParticipant, getRaffle } from '../helpers/initializers';

export function handleTicketsPurchased(event: TicketsPurchased): void {
    let raffle = getRaffle(event.address);

    raffle.currentSupply = raffle.currentSupply + event.params.nbOfTicketsPurchased;
    let participant = getOrInitParticipant(event.address, event.params.user);
    participant.numberOfTicketsPurchased =
        participant.numberOfTicketsPurchased + event.params.nbOfTicketsPurchased;
    const participantsNumber = participant.numbers;
    for (let i = 0; i < event.params.nbOfTicketsPurchased; i++) {
        participantsNumber.push(event.params.firstTicketnumber + i);
    }
    participant.numbers = participantsNumber;

    participant.save();
    raffle.save();
}
