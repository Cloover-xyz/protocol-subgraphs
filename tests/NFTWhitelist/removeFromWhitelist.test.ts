import {
  assert,
  clearStore,
  test,
  describe,
  afterEach,
  beforeEach,
} from 'matchstick-as/assembly/index';
import { BORED_APE, DEGODS, NFT_WHITELIST_ADDRESS } from '../utils/constants';
import {
  createAddedNFTToWhitelistEvent,
  createRemovedNFTFromWhitelistEvent,
  handleAddedNFTToWhitelists,
  handleRemovedNFTFromWhitelists,
} from '../utils/events/nftWhitelist';
import { NFT_WHITELIST_ENTITY_TYPE, NFT_ENTITY_TYPE } from '../utils/entities';
import { NFTWhitelist } from '../../generated/schema';
import { ethereum } from '@graphprotocol/graph-ts';

describe('NFTWhitelist - Remove nft from whitelist', () => {
  beforeEach(() => {
    const addBoredApeEvent = createAddedNFTToWhitelistEvent(BORED_APE);
    const addDegodsEvent = createAddedNFTToWhitelistEvent(DEGODS);
    handleAddedNFTToWhitelists([addBoredApeEvent, addDegodsEvent]);
  });
  afterEach(() => {
    clearStore();
  });
  test('should remove nft to whitelist', () => {
    const removeBoredApeEvent = createRemovedNFTFromWhitelistEvent(BORED_APE.address);

    handleRemovedNFTFromWhitelists([removeBoredApeEvent]);

    const nftWhitelist = NFTWhitelist.load(NFT_WHITELIST_ADDRESS)!;
    assert.equals(ethereum.Value.fromI32(nftWhitelist.nfts.length), ethereum.Value.fromI32(1));
    assert.equals(
      ethereum.Value.fromString(DEGODS.address),
      ethereum.Value.fromString(nftWhitelist.nfts[0])
    );
    assert.fieldEquals(NFT_WHITELIST_ENTITY_TYPE, NFT_WHITELIST_ADDRESS, 'collectionCount', '1');
    assert.entityCount(NFT_ENTITY_TYPE, 1);
    assert.notInStore(NFT_ENTITY_TYPE, BORED_APE.address);
  });

  test('should remove multiple nfts to whitelist', () => {
    const removeBoredApeEvent = createRemovedNFTFromWhitelistEvent(BORED_APE.address);
    const removeDegodsEvent = createRemovedNFTFromWhitelistEvent(DEGODS.address);

    handleRemovedNFTFromWhitelists([removeBoredApeEvent, removeDegodsEvent]);

    assert.fieldEquals(NFT_WHITELIST_ENTITY_TYPE, NFT_WHITELIST_ADDRESS, 'collectionCount', '0');
    assert.entityCount(NFT_ENTITY_TYPE, 0);
    assert.notInStore(NFT_ENTITY_TYPE, BORED_APE.address);
    assert.notInStore(NFT_ENTITY_TYPE, DEGODS.address);
  });
});
