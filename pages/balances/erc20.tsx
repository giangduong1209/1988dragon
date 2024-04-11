import { Default } from 'components/layouts/Default';
import { ERC20Balances } from 'components/templates/balances/ERC20';
import { Container } from '@chakra-ui/react';

const ERC20 = () => {
  return (
    <Default pageName="ERC20 Balances">
      <Container maxW="container.lg" p={3} marginTop={100} as="main" minH="70vh">
      <ERC20Balances />
      </Container>
    </Default>
  );
};

export default ERC20;
