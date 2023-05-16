import {
  assert,
  clearStore,
  test,
  describe,
  afterEach,
  beforeEach,
} from 'matchstick-as/assembly/index';
import { TOKEN_WHITELIST_ADDRESS, USDC, jEUR } from '../utils/constants';
import {
  createAddedToWhitelistEvent,
  createRemovedFromWhitelistEvent,
  handleAddedToWhitelists,
  handleRemovedFromWhitelists,
} from '../utils/events';
import { TOKENWHITELIST_ENTITY_TYPE, TOKEN_ENTITY_TYPE } from '../utils/entities';
import { TokenWhitelist } from '../../generated/schema';
import { ethereum } from '@graphprotocol/graph-ts';

describe('TokenWhitelist - Remove token from whitelist', () => {
  beforeEach(() => {
    const addUSDCEvent = createAddedToWhitelistEvent(USDC);
    const addjEUREvent = createAddedToWhitelistEvent(jEUR);
    handleAddedToWhitelists([addUSDCEvent, addjEUREvent]);
  });
  afterEach(() => {
    clearStore();
  });
  test('should remove token to whitelist', () => {
    const removeUSDCEvent = createRemovedFromWhitelistEvent(USDC.address);

    handleRemovedFromWhitelists([removeUSDCEvent]);

    const tokenWhitelist = TokenWhitelist.load(TOKEN_WHITELIST_ADDRESS)!;
    assert.equals(ethereum.Value.fromI32(tokenWhitelist.tokens.length), ethereum.Value.fromI32(1));
    assert.equals(
      ethereum.Value.fromString(jEUR.address),
      ethereum.Value.fromString(tokenWhitelist.tokens[0])
    );
    assert.fieldEquals(TOKENWHITELIST_ENTITY_TYPE, TOKEN_WHITELIST_ADDRESS, 'tokenCount', '1');
    assert.entityCount(TOKEN_ENTITY_TYPE, 1);
    assert.notInStore(TOKEN_ENTITY_TYPE, USDC.address);
  });

  test('should remove multiple tokens to whitelist', () => {
    const removeUSDCEvent = createRemovedFromWhitelistEvent(USDC.address);
    const removejEUREvent = createRemovedFromWhitelistEvent(jEUR.address);

    handleRemovedFromWhitelists([removeUSDCEvent, removejEUREvent]);

    assert.fieldEquals(TOKENWHITELIST_ENTITY_TYPE, TOKEN_WHITELIST_ADDRESS, 'tokenCount', '0');
    assert.entityCount(TOKEN_ENTITY_TYPE, 0);
    assert.notInStore(TOKEN_ENTITY_TYPE, USDC.address);
    assert.notInStore(TOKEN_ENTITY_TYPE, jEUR.address);
  });
});
