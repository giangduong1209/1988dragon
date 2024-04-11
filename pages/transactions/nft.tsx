import { Default } from 'components/layouts/Default';
import { NFTTransfers } from 'components/templates/transactions/NFT';
import { Container } from '@chakra-ui/react';

const NFTTransfersPage = () => {
  return (
    <Default pageName="NFT Transfers">
      <Container maxW="container.lg" p={3} marginTop={100} as="main" minH="70vh">
        <NFTTransfers />
      </Container>
    </Default>
  );
};

export default NFTTransfersPage;
