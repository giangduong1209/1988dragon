import { ChakraProvider } from '@chakra-ui/react';
import { createClient, configureChains, WagmiConfig, Chain } from 'wagmi';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import { extendTheme } from '@chakra-ui/react';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, walletConnectWallet, rainbowWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import constants from '../constants';
import Head from 'next/head';
import '../styles/globals.css';
import store from 'store';
import { Provider } from 'react-redux';

const { provider, webSocketProvider, chains } = configureChains(
  [constants.CHAIN.bscChain as Chain],
  [publicProvider()],
);
const emotionCache = createCache({
  key: 'emotion-css-cache',
  prepend: true,
});

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      rainbowWallet({ chains }),
      coinbaseWallet({ appName: 'coinbase', chains }),
    ],
  },
]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors,
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider resetCSS theme={theme}>
        <WagmiConfig client={client}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            <SessionProvider session={pageProps.session} refetchInterval={0}>
              <Head>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" 
                crossOrigin="" />
                <link
                  href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                  rel="stylesheet"
                />
                  
                {/* !Google Fonts */}
                {/* Style */}
                <link type="text/css" rel="stylesheet" href="/css/plugins.css?ver=4.1" />
                <link type="text/css" rel="stylesheet" href="/css/style.css?ver=4.1" />
                <link rel="shortcut icon" href="/img/drops/1988dragon.jpg" />
                <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
       />
              </Head>
              <Provider store={store}>
                <Component {...pageProps} />
              </Provider>
            </SessionProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  );
};

export default MyApp;
