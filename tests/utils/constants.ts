import { TokenConfig } from './tokenConfig';

export const TOKEN_WHITELIST_ADDRESS = '0x1000000000000000000000000000000000000000'.toLowerCase();

export const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'.toLowerCase();
export const jEUR_ADDRESS = '0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c'.toLowerCase();

export const USDC = new TokenConfig(USDC_ADDRESS, 'USDC', 6);
export const jEUR = new TokenConfig(jEUR_ADDRESS, 'jEUR', 18);
