import clsx from 'clsx';
import { Button } from 'antd';
import { ethers, Signer } from 'ethers';
import React, { useEffect, useState } from 'react';
import { DashboardLayoutHeader } from '../DashboardLayout/DashboardLayoutHeader';
import { LayoutItemContent } from '../DashboardLayout/LayoutItemContent';
import styles from './styles.module.css';
import { failureModal, successModal } from '../../../../helpers/modal';
import { useAccount, useSigner } from 'wagmi';
import Constants from '../../../../constants';
import { useAppSelector } from 'store/hooks';
import { useColorModeValue } from '@chakra-ui/react';
import { resolveIPFSByTokenURI } from 'utils/resolveIPFS';

export interface metadata {
  image: string;
  description: string;
  title: string;
  dna: number;
  tokenId: number;
  date: number;
}

function GameDashboardContent() {
  const bg = useColorModeValue('#000', '#000');
  const color1 = useColorModeValue('#000', '#fff');
  const color2 = useColorModeValue('#fff', '#fff');

  const { address } = useAccount();
  const [NFTs, setNFTs] = useState<metadata[]>([]);
  const [reward, setReward] = useState('');
  const [loadingClaim, setLoadingClaim] = useState(false);
  const { data: signer } = useSigner();
  const show = useAppSelector((state) => state.ui.showStakingModal);

  const getNFTs = async () => {
    const stakingContract = new ethers.Contract(Constants.STAKING_ADDR, Constants.STAKING_ABI, Constants.PROVIDER);
    const nftCollection = new ethers.Contract(Constants.NFT_ADDR, Constants.NFT_ABI, Constants.PROVIDER);
    const stakedIds = await stakingContract.stakedIds(address);
    const stakers = await stakingContract.userStakeInfo(address);
    setReward(ethers.utils.formatEther(stakers[1]));
    try {
      /* eslint-disable no-await-in-loop */
      for (const tokenId of stakedIds) {
        const tokenURI = await nftCollection.tokenURI(tokenId.toString());
        const timeStaked = await stakingContract.timeStaked(tokenId.toString());
        const metadata = await resolveIPFSByTokenURI(tokenURI);
        if (metadata) {
          const item = {
            image: metadata.image,
            description: metadata.description,
            title: metadata.name,
            dna: metadata.dna,
            tokenId: metadata.edition,
            date: timeStaked,
          };
          setNFTs((prev) => [...prev, item]);
        }
      }
      /* eslint-disable no-await-in-loop */
    } catch (error) {
      failureModal('Some thing went wrong');
    }
  };

  const claimReward = async () => {
    setLoadingClaim(true);
    const stakingContract = new ethers.Contract(Constants.STAKING_ADDR, Constants.STAKING_ABI, signer as Signer);
    if (address && signer) {
      try {
        const claimTx = await stakingContract.claimRewards();
        console.log(claimTx);
        await claimTx.wait();
        setLoadingClaim(false);
        successModal('Claim succeeded.');
      } catch (error) {
        setLoadingClaim(false);
        failureModal('Claim failed.');
      }
    } else {
      setLoadingClaim(false);
      failureModal('Missing provider.');
    }
  };

  useEffect(() => {
    if (address) {
      getNFTs();
      console.log(NFTs);
    }
  }, [address]);

  return (
    <div className={styles.gameDashboard}>
      <div className={styles.gameDashboardHeaderMobile}>
        <DashboardLayoutHeader />
      </div>
      <div style={{ color: `${color1}` }} className={styles.gameDashboardTitle}>
        Staking
      </div>
      <div className={styles.gameDashboardContent}>
        {NFTs.map((item) => (
          <LayoutItemContent
            image={item.image}
            description={item.description}
            title={item.title}
            dna={item.dna}
            date={item.date}
            tokenId={item.tokenId}
          />
        ))}
      </div>
      <div
        className={clsx(styles.gameDashboardFooter, {
          [styles.show]: show,
        })}
      >
        <div>
          <p style={{ color: `${color1}` }} className={styles.gameDashboardFooterTitle}>
            Total Rewards
          </p>
          <div style={{ background: `${bg}`, color: `${color2}` }} className={styles.inputCollectible}>
            {reward}
          </div>
        </div>
        <div>
          <p style={{ color: `${color1}` }} className={styles.gameDashboardFooterTitle}>
            Daily NFTs Staking
          </p>
          <Button
            loading={loadingClaim}
            style={{ width: '100%' }}
            block
            disabled={reward ? false : true}
            onClick={() => claimReward()}
          >
            Claim
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GameDashboardContent;
