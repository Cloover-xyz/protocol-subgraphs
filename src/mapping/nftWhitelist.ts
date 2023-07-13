import { BigInt, store } from '@graphprotocol/graph-ts';
import { AddedToWhitelist, RemovedFromWhitelist } from '../../generated/NFTWhitelist/NFTWhitelist';

import { removeFromArray } from '../utils/array';
import { getOrInitNFT, getOrInitNFTWhitelist } from '../helpers/initializers';

export function handleAddedNFTToWhitelist(event: AddedToWhitelist): void {
    const nftWhitelist = getOrInitNFTWhitelist(event.address);

    const nft = getOrInitNFT(event.params.addedNftCollection);
    nft.royaltiesRecipent = event.params.royaltiesRecipent.toHexString();
    nft.save();

    nftWhitelist.collectionCount = nftWhitelist.collectionCount.plus(BigInt.fromI32(1));
    const nftArray = nftWhitelist.nfts;
    nftArray.push(nft.id);
    nftWhitelist.nfts = nftArray;
    nftWhitelist.save();
}

export function handleRemovedNFTFromWhitelist(event: RemovedFromWhitelist): void {
    const nftWhitelist = getOrInitNFTWhitelist(event.address);
    nftWhitelist.collectionCount = nftWhitelist.collectionCount.minus(BigInt.fromI32(1));
    nftWhitelist.nfts = removeFromArray(
        nftWhitelist.nfts,
        event.params.removedNftCollection.toHex()
    );
    nftWhitelist.save();

    const nft = getOrInitNFT(event.params.removedNftCollection);

    store.remove('NFT', nft.id);
}
