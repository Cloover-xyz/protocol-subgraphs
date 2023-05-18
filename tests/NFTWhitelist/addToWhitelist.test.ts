import { assert, clearStore, test, describe, afterEach } from 'matchstick-as/assembly/index';
import { NFT_WHITELIST_ADDRESS, BORED_APE, DEGODS } from '../utils/constants';

import { NFT_WHITELIST_ENTITY_TYPE, NFT_ENTITY_TYPE } from '../utils/entities';

import { ethereum } from '@graphprotocol/graph-ts';
import {
  createAddedNFTToWhitelistEvent,
  handleAddedNFTToWhitelists,
} from '../utils/events/nftWhitelist';
import { NFTWhitelist } from '../../generated/schema';

describe('NFTWhitelist - Add new token to whitelist', () => {
  afterEach(() => {
    clearStore();
  });
  test('should add token to whitelist', () => {
    const addBoredApeEvent = createAddedNFTToWhitelistEvent(BORED_APE);
    handleAddedNFTToWhitelists([addBoredApeEvent]);

    const nftWhitelist = NFTWhitelist.load(NFT_WHITELIST_ADDRESS)!;

    assert.equals(ethereum.Value.fromI32(nftWhitelist.nfts.length), ethereum.Value.fromI32(1));
    assert.equals(
      ethereum.Value.fromString(nftWhitelist.nfts[0]),
      ethereum.Value.fromString(BORED_APE.address)
    );

    assert.entityCount(NFT_ENTITY_TYPE, 1);
    assert.fieldEquals(NFT_WHITELIST_ENTITY_TYPE, NFT_WHITELIST_ADDRESS, 'collectionCount', '1');
    assert.fieldEquals(NFT_ENTITY_TYPE, BORED_APE.address, 'creator', BORED_APE.creator);
  });

  test('should add multiple nfts to whitelist', () => {
    const addBoredApeEvent = createAddedNFTToWhitelistEvent(BORED_APE);
    const addDegodsEvent = createAddedNFTToWhitelistEvent(DEGODS);
    handleAddedNFTToWhitelists([addBoredApeEvent, addDegodsEvent]);

    const nftWhitelist = NFTWhitelist.load(NFT_WHITELIST_ADDRESS)!;

    assert.equals(ethereum.Value.fromI32(nftWhitelist.nfts.length), ethereum.Value.fromI32(2));
    assert.equals(
      ethereum.Value.fromString(nftWhitelist.nfts[0]),
      ethereum.Value.fromString(BORED_APE.address)
    );
    assert.equals(
      ethereum.Value.fromString(nftWhitelist.nfts[1]),
      ethereum.Value.fromString(DEGODS.address)
    );

    assert.fieldEquals(NFT_WHITELIST_ENTITY_TYPE, NFT_WHITELIST_ADDRESS, 'collectionCount', '2');
    assert.entityCount(NFT_ENTITY_TYPE, 2);
  });
});
