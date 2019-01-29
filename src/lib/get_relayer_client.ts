import { HttpClient } from '@0x/connect';

import { DEFAULT_RELAYER_URL } from '../common/constants';

export const getRelayerClient = (url: string = DEFAULT_RELAYER_URL): HttpClient => {
    return new HttpClient(url);
};
