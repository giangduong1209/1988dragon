import { Default } from 'components/layouts/Default';
import { NFTBalances } from 'components/templates/balances/NFT';
import { Container } from '@chakra-ui/react';

const ERC20 = () => {
  return (
    <Default pageName="NFT Balances">
      <Container maxW="container.lg" p={3} marginTop={100} as="main" minH="70vh">
        <NFTBalances />
      </Container>
    </Default>
  );
};

export default ERC20;
