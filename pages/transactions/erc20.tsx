import { Default } from 'components/layouts/Default';
import { ERC20Transfers } from 'components/templates/transactions/ERC20';
import { Container } from '@chakra-ui/react';

const ERC20 = () => {
  return (
    <Default pageName="ERC20 Transfers">
      <Container maxW="container.lg" p={3} marginTop={100} as="main" minH="70vh">
        <ERC20Transfers />
      </Container>
    </Default>
  );
};

export default ERC20;
