import { Address, ethereum } from '@graphprotocol/graph-ts';

import {
  handleAddedNFTToWhitelist,
  handleRemovedNFTFromWhitelist,
} from '../../../src/mapping/nftWhitelist';

import { newMockEvent } from 'matchstick-as';
import { NFTConfig } from '../nftConfig';
import { NFT_WHITELIST_ADDRESS } from '../constants';
import {
  AddedToWhitelist,
  RemovedFromWhitelist,
} from '../../../generated/NFTWhitelist/NFTWhitelist';

export function handleAddedNFTToWhitelists(events: AddedToWhitelist[]): void {
  events.forEach((event) => {
    handleAddedNFTToWhitelist(event);
  });
}

export function createAddedNFTToWhitelistEvent(nftCollection: NFTConfig): AddedToWhitelist {
  let newEvent = changetype<AddedToWhitelist>(newMockEvent());
  newEvent.parameters = new Array();
  let addedNftCollection = new ethereum.EventParam(
    'addedNftCollection',
    ethereum.Value.fromAddress(Address.fromString(nftCollection.address))
  );
  let creator = new ethereum.EventParam(
    'creator',
    ethereum.Value.fromAddress(Address.fromString(nftCollection.creator))
  );

  newEvent.parameters.push(addedNftCollection);
  newEvent.parameters.push(creator);

  newEvent.address = Address.fromString(NFT_WHITELIST_ADDRESS);
  return newEvent;
}

export function handleRemovedNFTFromWhitelists(events: RemovedFromWhitelist[]): void {
  events.forEach((event) => {
    handleRemovedNFTFromWhitelist(event);
  });
}

export function createRemovedNFTFromWhitelistEvent(
  nftCollectionAddress: string
): RemovedFromWhitelist {
  let newEvent = changetype<RemovedFromWhitelist>(newMockEvent());
  newEvent.parameters = new Array();
  let removedNftCollectionParam = new ethereum.EventParam(
    'removedNftCollection',
    ethereum.Value.fromAddress(Address.fromString(nftCollectionAddress))
  );

  newEvent.parameters.push(removedNftCollectionParam);
  newEvent.address = Address.fromString(NFT_WHITELIST_ADDRESS);
  return newEvent;
}
