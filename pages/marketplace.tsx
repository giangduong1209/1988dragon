import { Container } from '@chakra-ui/react';
import { Default } from 'components/layouts/Default';
import { Marketplace } from 'components/templates/Marketplace';

const MarketPlacePage = () => {
  return (
    <Default pageName="Marketplace">
        <Container maxW="container.lg" p={3} marginTop={100} as="main" minH="70vh">
      <Marketplace />
      </Container>
    </Default>
  );
};

export default MarketPlacePage;
