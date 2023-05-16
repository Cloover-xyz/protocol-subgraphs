import { Address, ethereum } from '@graphprotocol/graph-ts';
import {
  AddedToWhitelist,
  RemovedFromWhitelist,
} from '../../generated/TokenWhitelist/TokenWhitelist';
import {
  handleAddedToWhitelist,
  handleRemovedFromWhitelist,
} from '../../src/mapping/tokenWhitelist';

import { createMockedFunction, log, newMockEvent } from 'matchstick-as';
import { TokenConfig } from './tokenConfig';
import { TOKEN_WHITELIST_ADDRESS } from './constants';

export function handleAddedToWhitelists(events: AddedToWhitelist[]): void {
  events.forEach((event) => {
    handleAddedToWhitelist(event);
  });
}

export function createAddedToWhitelistEvent(token: TokenConfig): AddedToWhitelist {
  const tokenAddress = Address.fromString(token.address);
  createMockedFunction(tokenAddress, 'symbol', 'symbol():(string)').returns([
    ethereum.Value.fromString(token.symbol),
  ]);
  createMockedFunction(tokenAddress, 'decimals', 'decimals():(uint8)').returns([
    ethereum.Value.fromI32(token.decimals),
  ]);

  let newEvent = changetype<AddedToWhitelist>(newMockEvent());
  newEvent.parameters = new Array();
  let addedTokenParam = new ethereum.EventParam(
    'addedToken',
    ethereum.Value.fromAddress(tokenAddress)
  );

  newEvent.parameters.push(addedTokenParam);

  newEvent.address = Address.fromString(TOKEN_WHITELIST_ADDRESS);
  return newEvent;
}

export function handleRemovedFromWhitelists(events: RemovedFromWhitelist[]): void {
  events.forEach((event) => {
    handleRemovedFromWhitelist(event);
  });
}

export function createRemovedFromWhitelistEvent(tokenAddress: string): RemovedFromWhitelist {
  let newEvent = changetype<RemovedFromWhitelist>(newMockEvent());
  newEvent.parameters = new Array();
  let removedTokenParam = new ethereum.EventParam(
    'removedToken',
    ethereum.Value.fromAddress(Address.fromString(tokenAddress))
  );

  newEvent.parameters.push(removedTokenParam);
  newEvent.address = Address.fromString(TOKEN_WHITELIST_ADDRESS);
  return newEvent;
}
