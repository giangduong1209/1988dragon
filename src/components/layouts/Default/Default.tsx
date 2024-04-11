import { FC, ReactNode } from 'react';
import { Footer, Header } from 'components/modules';
import Head from 'next/head';

const Default: FC<{ children: ReactNode; pageName: string }> = ({ children, pageName }) => (
  <>
    <Head>
      <title>{` 1988 Dragon | ${pageName}`}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    {children}

    <Footer />
  </>
);

export default Default;
