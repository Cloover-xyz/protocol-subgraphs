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

export function getTokenWhitelistId(deployerAddress: Address): string {
  return deployerAddress.toHexString();
}

export function getTokenId(tokenAddress: Address): string {
  return tokenAddress.toHexString();
}

export function getUserId(userAddress: Address): string {
  return userAddress.toHexString();
}
