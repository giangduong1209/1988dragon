import { Box, Link, Popover, PopoverContent, PopoverTrigger, Stack, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FC } from 'react';
import { ISubNav } from '../SubNav/SubNav';
import { SubNav } from '../SubNav';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import styles from './NavItem.module.css';
const NavItem: FC<ISubNav> = ({ label, children, href }) => {
  const linkColor = useColorModeValue('gray.600', '#9ba0b8');
  const linkActiveColor = useColorModeValue('gray.800', '#9ba0b8');
  const router = useRouter();
  const isCurrentPath = router.asPath === href || (href !== '/' && router.pathname.startsWith(href || ''));

  return (
    <div className={styles.navItem}>

    <Popover trigger={'hover'} placement={'bottom-start'}>
      <PopoverTrigger>
        <Box className={styles.subNav}>
          <Box
            fontSize={18}
            color={isCurrentPath ? linkActiveColor : linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkActiveColor,
            }}
            cursor="pointer"
            >
            {children ? (
              <>
                {label} <ChevronDownIcon />
              </>
            ) : (
              <NextLink href={href || '/'}>
                <Link
                  _hover={{
                    textDecoration: 'none',
                  }}
                  >
                  {label}
                </Link>
              </NextLink>
            )}
          </Box>
        </Box>
      </PopoverTrigger>

      {children && (
        <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} minW={'sm'}>
          <Stack>
            {children.map((child) => (
              <SubNav key={child.label} {...child} />
              ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
      </div>
  );
};

export default NavItem;
