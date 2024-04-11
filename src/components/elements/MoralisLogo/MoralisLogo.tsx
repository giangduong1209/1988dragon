import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

const MoralisLogo = () => {
  const { colorMode } = useColorMode();

  return (
    <Link href={'https://1988dragon.com/'}>
      <Image
        className="logo1988"
        src={colorMode === 'dark' ? '/1988dragon_logo_w-01.png' : '/1988dragon_logo_b-01.png'}
        height={90}
        width={180}
        alt="Moralis"
        style={{ cursor: 'pointer' }}
      />
    </Link>
  );
};

export default MoralisLogo;
