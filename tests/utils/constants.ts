import { NFTConfig } from './nftConfig';
import { TokenConfig } from './tokenConfig';

// Contracts setup
export const TOKEN_WHITELIST_ADDRESS = '0x1000000000000000000000000000000000000000'.toLowerCase();
export const NFT_WHITELIST_ADDRESS = '0x0100000000000000000000000000000000000000'.toLowerCase();
export const RAFFLE_FACTORY_ADDRESS = '0x0010000000000000000000000000000000000000'.toLowerCase();
export const RAFFLE_1_ADDRESS = '0x0001000000000000000000000000000000000000'.toLowerCase();
export const RAFFLE_2_ADDRESS = '0x0001000000000000000000000000000000000001'.toLowerCase();

// Users setup
export const CREATOR_ADDRESS = '0x0000000000000000000000000000000000000001'.toLowerCase();
export const PARTICIPANT_1_ADDRESS = '0x0000000000000000000000000000000000000010'.toLowerCase();
export const PARTICIPANT_2_ADDRESS = '0x0000000000000000000000000000000000000100'.toLowerCase();

// Tokens setup
export const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'.toLowerCase();
export const jEUR_ADDRESS = '0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c'.toLowerCase();

export const USDC = new TokenConfig(USDC_ADDRESS, 'USDC', 6);
export const jEUR = new TokenConfig(jEUR_ADDRESS, 'jEUR', 18);

// NFTs setup
export const COLLECTION_1_ADDRESS = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'.toLowerCase();
export const COLLECTION_1_CREATOR = '0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03'.toLowerCase();

export const COLLECTION_2_ADDRESS = '0x8821BeE2ba0dF28761AffF119D66390D594CD280'.toLowerCase();
export const COLLECTION_2_CREATOR = '0x28b23Effa8c23E8e402E3F8516f544e6567C41F5'.toLowerCase();

export const BORED_APE = new NFTConfig(COLLECTION_1_ADDRESS, COLLECTION_1_CREATOR);
export const DEGODS = new NFTConfig(COLLECTION_2_ADDRESS, COLLECTION_2_CREATOR);
