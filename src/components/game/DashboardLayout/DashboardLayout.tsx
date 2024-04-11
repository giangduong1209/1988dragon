import clsx from 'clsx';
import React, { FC, useState, useEffect } from 'react';
import styles from './styles.module.css';
import { LayoutItem } from './LayoutItem';
import { DashboardLayoutProps } from './types';
import { DashboardLayoutHeader } from './DashboardLayoutHeader';
import Constants from '../../../../constants';
import { Box } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { failureModal } from '../../../../helpers/modal';
import { useAccount } from 'wagmi';
import { useAppSelector } from 'store/hooks';
import { resolveIPFSByTokenURI } from '../../../utils/resolveIPFS';

export interface metadata {
  image: string;
  description: string;
  name: string;
  dna: number;
  edition: number;
}

const DashboardLayout: FC<DashboardLayoutProps> = () => {
  const { address } = useAccount();
  const [NFTs, setNFTs] = useState<metadata[]>([]);
  const show = useAppSelector((state) => state.ui.showStakingModal);

  const getNFTs = async () => {
    const nftCollection = new ethers.Contract(Constants.NFT_ADDR, Constants.NFT_ABI, Constants.PROVIDER);
    const wallet = await nftCollection.walletOfOwner(address);
    try {
      /* eslint-disable no-await-in-loop */ /* eslint-disable no-await-in-loop */
      for (const tokenId of wallet) {
        const tokenURI = await nftCollection.tokenURI(tokenId.toString());
        const metadata = await resolveIPFSByTokenURI(tokenURI);
        if (metadata) {
          setNFTs((prev) => [...prev, metadata]);
        }
      }
      /* eslint-disable no-await-in-loop */
    } catch (error) {
      failureModal('Some thing went wrong');
    }
  };

  useEffect(() => {
    if (address) {
      getNFTs();
      console.log(NFTs);
    }
  }, [address]);

  return (
    <div
      className={clsx(styles.gameLayout, styles.gameDashboardLayout, {
        [styles.show]: show,
      })}
    >
      <DashboardLayoutHeader />
      {NFTs?.length ? (
        <div className={clsx(styles.gameLayoutBody, styles.dashboardLayoutBody)}>
          {NFTs.map((items) => (
            <LayoutItem
              image={items.image}
              description={items.description}
              name={items.name}
              dna={items.dna}
              edition={items.edition}
            />
          ))}
        </div>
      ) : (
        <Box ml={2}>Looks like you do not have any NFTs</Box>
      )}
    </div>
  );
};

export default DashboardLayout;
