import { assert, clearStore, test, describe, afterEach } from 'matchstick-as/assembly/index';
import { TOKEN_WHITELIST_ADDRESS, USDC, jEUR } from '../utils/constants';
import {
  createAddedTokenToWhitelistEvent,
  handleAddedTokenToWhitelists,
} from '../utils/events/tokenWhitelist';
import { TOKEN_WHITELIST_ENTITY_TYPE, TOKEN_ENTITY_TYPE } from '../utils/entities';
import { TokenWhitelist } from '../../generated/schema';
import { ethereum } from '@graphprotocol/graph-ts';

describe('TokenWhitelist - Add new token to whitelist', () => {
  afterEach(() => {
    clearStore();
  });
  test('should add token to whitelist', () => {
    const addUSDCEvent = createAddedTokenToWhitelistEvent(USDC);
    handleAddedTokenToWhitelists([addUSDCEvent]);

    const tokenWhitelist = TokenWhitelist.load(TOKEN_WHITELIST_ADDRESS)!;

    assert.equals(ethereum.Value.fromI32(tokenWhitelist.tokens.length), ethereum.Value.fromI32(1));
    assert.equals(
      ethereum.Value.fromString(tokenWhitelist.tokens[0]),
      ethereum.Value.fromString(USDC.address)
    );

    assert.entityCount(TOKEN_ENTITY_TYPE, 1);
    assert.fieldEquals(TOKEN_WHITELIST_ENTITY_TYPE, TOKEN_WHITELIST_ADDRESS, 'tokenCount', '1');
    assert.fieldEquals(TOKEN_ENTITY_TYPE, USDC.address, 'symbol', USDC.symbol);
    assert.fieldEquals(TOKEN_ENTITY_TYPE, USDC.address, 'decimals', USDC.decimals.toString());
  });

  test('should add multiple tokens to whitelist', () => {
    const addUSDCEvent = createAddedTokenToWhitelistEvent(USDC);
    const addjEUREvent = createAddedTokenToWhitelistEvent(jEUR);
    handleAddedTokenToWhitelists([addUSDCEvent, addjEUREvent]);

    const tokenWhitelist = TokenWhitelist.load(TOKEN_WHITELIST_ADDRESS)!;
    assert.equals(ethereum.Value.fromI32(tokenWhitelist.tokens.length), ethereum.Value.fromI32(2));
    assert.equals(
      ethereum.Value.fromString(tokenWhitelist.tokens[0]),
      ethereum.Value.fromString(USDC.address)
    );
    assert.equals(
      ethereum.Value.fromString(tokenWhitelist.tokens[1]),
      ethereum.Value.fromString(jEUR.address)
    );

    assert.fieldEquals(TOKEN_WHITELIST_ENTITY_TYPE, TOKEN_WHITELIST_ADDRESS, 'tokenCount', '2');
    assert.entityCount(TOKEN_ENTITY_TYPE, 2);
  });
});
