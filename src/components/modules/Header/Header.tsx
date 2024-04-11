import { Box, Container, Flex, HStack } from '@chakra-ui/react';
import { ColorModeButton, MoralisLogo, NavBar } from 'components/elements';
import { ButtonConnect } from '../ButtonConnect';

const Header = () => {
  return (
    <Box borderBottom="1px" borderBottomColor="chakra-border-color">
      <Container maxW="container.xl" p={'10px'}>
        <Flex align="center" justify="space-between">
          <div className="logo-deskt">
            <MoralisLogo />
          </div>
          <NavBar />
          <div className="logo-mobile">
            <MoralisLogo />
          </div>
          <HStack gap={'10px'}>
            <ButtonConnect />
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
