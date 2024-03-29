import { Address, ethereum } from '@graphprotocol/graph-ts';

export function getHistoryEntityId(event: ethereum.Event): string {
  return (
    event.block.number.toString() +
    ':' +
    event.transaction.index.toString() +
    ':' +
    event.transaction.hash.toHexString() +
    ':' +
    event.logIndex.toString() +
    ':' +
    event.transactionLogIndex.toString()
  );
}

export function getFactoryId(factoryAddress: Address): string {
  return factoryAddress.toHexString();
}

export function getRaffleId(raffleAddress: Address): string {
  return raffleAddress.toHexString();
}

export function getTokenWhitelistId(contractAddress: Address): string {
  return contractAddress.toHexString();
}

export function getNFTWhitelistId(contractAddress: Address): string {
  return contractAddress.toHexString();
}

export function getTokenId(tokenAddress: Address): string {
  return tokenAddress.toHexString();
}

export function getNFTId(nftCollectionAddress: Address): string {
  return nftCollectionAddress.toHexString();
}

export function getUserId(userAddress: Address): string {
  return userAddress.toHexString();
}

export function getParticipantId(raffleAddress: Address, userAddress: Address): string {
  return raffleAddress.toHexString() + '-' + userAddress.toHexString();
}
