import { BigInt, store } from '@graphprotocol/graph-ts';
import {
  AddedToWhitelist,
  RemovedFromWhitelist,
} from '../../generated/TokenWhitelist/TokenWhitelist';
import { getOrInitToken, getOrInitTokenWhitelist } from '../helpers/initializers';
import { removeFromArray } from '../utils/array';

export function handleAddedToWhitelist(event: AddedToWhitelist): void {
  const tokenWhitelist = getOrInitTokenWhitelist(event.address);
  const token = getOrInitToken(event.params.addedToken);

  tokenWhitelist.tokenCount = tokenWhitelist.tokenCount.plus(BigInt.fromI32(1));
  const tokenArray = tokenWhitelist.tokens;
  tokenArray.push(token.id);
  tokenWhitelist.tokens = tokenArray;
  tokenWhitelist.save();
}

export function handleRemovedFromWhitelist(event: RemovedFromWhitelist): void {
  const tokenWhitelist = getOrInitTokenWhitelist(event.address);
  tokenWhitelist.tokenCount = tokenWhitelist.tokenCount.minus(BigInt.fromI32(1));
  tokenWhitelist.tokens = removeFromArray(tokenWhitelist.tokens, event.params.removedToken.toHex());
  tokenWhitelist.save();

  const token = getOrInitToken(event.params.removedToken);
  store.remove('Token', token.id);
}
