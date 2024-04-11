import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Flex, HStack, IconButton } from '@chakra-ui/react';
import { Button } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { NavItem } from '../NavItem';
import NAV_LINKS from './paths';

const NavBar = () => {
  const [display, changeDisplay] = useState('none');
  return (
    <HStack gap={'15px'}>
      <Flex>
        <Flex>
          <Flex display={['none', 'none', 'flex', 'flex']}>
            <div className="nav">
              <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center', alignItems: 'center' }}>
                <li>
                  <Link href="/">
                    <a className="creative_link">Explore</a>
                  </Link>
                </li>
                {NAV_LINKS.map((link, index) => (
                  <li key={index}>
                    <NavItem key={`link-${link.label}`} {...link} />
                  </li>
                ))}
                {/* <li>
                  <Link href="/transactions">
                    <a className="creative_link">Transaction</a>
                  </Link>
                </li> */}
                <li>
                  <Link href="/staking">
                    <a className="creative_link">Staking</a>
                  </Link>
                </li>
                <li>
                  <Link href="/createnft">
                    <Button className="creBtn">
                      <p style={{ marginBottom: '0' }}>Create</p>
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>
          </Flex>
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr="2"
            icon={<HamburgerIcon />}
            display={['flex', 'flex', 'none', 'none']}
            onClick={() => changeDisplay('flex')}
          ></IconButton>
        </Flex>

        <Flex
          w="100vw"
          bgColor="gray.700"
          zIndex={20}
          h="100vh"
          pos="fixed"
          top="0"
          left="0"
          overflowX="hidden"
          flexDir="column"
          display={display}
        >
          <Flex justify="flex-end">
            <IconButton
              mt={2}
              mr={2}
              aria-label="Close Menu"
              size="lg"
              icon={<CloseIcon />}
              onClick={() => changeDisplay('none')}
            />
          </Flex>
          <Flex gap={5} flexDir="column" align="center">
            <Link href="/" passHref>
              <li style={{ listStyle: 'none' }}>
                <a className="creative_link">Explore</a>
              </li>
            </Link>
            {NAV_LINKS.map((link, index) => (
              <li style={{ listStyle: 'none' }} key={index}>
                <NavItem key={`link-${link.label}`} {...link} />
              </li>
            ))}
            <Link href="staking" passHref>
              <li style={{ listStyle: 'none' }}>
                <a className="creative_link">Staking</a>
              </li>
            </Link>

            <Link href="/createnft">
              <Button className="creBtn">
                <p style={{ marginBottom: '0' }}>Create</p>
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </HStack>
  );
};

export default NavBar;
