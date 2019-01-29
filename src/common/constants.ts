// DEFAULT_RELAYER_URL will adopt the corresponding value when running
// create-react-app build script. Its default value is localhost:3001/api/v2
// because setupProxy is configured to proxy requests to /api to a running
// instance of 0x-launch-kit (check comment in file).
const DEFAULT_RELAYER_HOST = process.env.REACT_APP_LAUNCH_KIT_BACKEND_URL || 'http://localhost:3001/api';
export const DEFAULT_RELAYER_URL = `${DEFAULT_RELAYER_HOST}/v2`;

// Must be the same a as 0x-launch-kit
export const NETWORK_ID = 42; // Kovan

// For Kovan network
// https://github.com/0xProject/0x-monorepo/blob/4b95e3d684/packages/contract-addresses/src/index.ts
export const EXCHANGE_ADDRESS = '0x35dd2932454449b14cee11a94d3674a936d5d7b2';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DEFAULT_EXPIRATION_TIME_SECS = '3600';

export const DEFAULT_UI_UNIT_AMOUNT_DECIMALS = 4;
