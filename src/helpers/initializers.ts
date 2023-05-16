import { Address } from '@graphprotocol/graph-ts';

import { Token, TokenWhitelist } from '../../generated/schema';
import { IERC20Detailed } from '../../generated/TokenWhitelist/IERC20Detailed';

import { getTokenId, getTokenWhitelistId } from '../utils/id-generation';
import { zeroBI } from '../utils/converters';

export function getOrInitTokenWhitelist(tokenWhitelistAddress: Address): TokenWhitelist {
  let tokenWhitelistId = getTokenWhitelistId(tokenWhitelistAddress);
  let tokenWhitelist = TokenWhitelist.load(tokenWhitelistId);
  if (!tokenWhitelist) {
    tokenWhitelist = new TokenWhitelist(tokenWhitelistId);
    tokenWhitelist.tokenCount = zeroBI();
    tokenWhitelist.tokens = [];
    tokenWhitelist.save();
  }
  return tokenWhitelist;
}

export function getOrInitToken(tokenAddress: Address): Token {
  let tokenId = getTokenId(tokenAddress);
  let token = Token.load(tokenId);
  if (!token) {
    token = new Token(tokenId);
    let ERC20Contract = IERC20Detailed.bind(tokenAddress);
    token.symbol = ERC20Contract.symbol();
    token.decimals = ERC20Contract.decimals();
    token.save();
  }
  return token;
}
