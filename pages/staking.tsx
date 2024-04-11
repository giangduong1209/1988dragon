import { Game } from 'components/game';
import { Footer, Header } from 'components/modules';
import Head from 'next/head';

const Staking = () => {
  return (
    <>
      <Head>
        <title>{`Staking | ETH Boilerplate`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Game />
      <Footer />
    </>
  );
};

export default Staking;
