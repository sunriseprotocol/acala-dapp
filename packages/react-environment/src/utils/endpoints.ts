import { WsProvider } from '@polkadot/api';

export type EndpointType = 'testnet' | 'production' | 'development';

export interface EndpointConfigItem {
  name: string;
  url: string;
}

export type EndpointConfig = Record<EndpointType, EndpointConfigItem[]>;

export const DEFAULT_ENDPOINTS: EndpointConfig = {
  development: [
    {
      name: 'Local',
      url: 'ws://127.0.0.1:9944'
    }
  ],
  production: [],
  testnet: [
    {
      name: 'Rococo Mandala',
      url: 'wss://rococo-1.acala.laminar.one'
    }
  ]
};

export const createProvider = (endpoint: string): WsProvider => {
  const ws = new WsProvider(endpoint);

  return ws;
};