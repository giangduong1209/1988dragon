import React, { FC, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { Button } from 'antd';
import { metadata } from '../DashboardLayout';
import { ethers, Signer } from 'ethers';
import { useSigner } from 'wagmi';
import { failureModal, successModal } from '../../../../../helpers/modal';
import Constants from '../../../../../constants';
import { useRouter } from "next/router";


const LayoutItem: FC<metadata> = ({ image, name, edition }) => {
  const { data: signer } = useSigner();
  const [loadingStaking, setLoadingStaking] = useState(false);
  const router = useRouter();
  const staking = async () => {
    const nftCollection = new ethers.Contract(Constants.NFT_ADDR, Constants.NFT_ABI, signer as Signer);
    const stakingContract = new ethers.Contract(Constants.STAKING_ADDR, Constants.STAKING_ABI, signer as Signer);
    try {
      setLoadingStaking(true);
      const approveTx = await nftCollection.approve(Constants.STAKING_ADDR, edition);
      console.log(approveTx);
      await approveTx.wait();
      const stakeTx = await stakingContract.stake([edition]);
      console.log(stakeTx);
      await stakeTx.wait();
      setLoadingStaking(false);
      successModal('Staking success');
      router.reload();
    } catch (error) {
      setLoadingStaking(false);
      failureModal('Stake failed');
    }
  };

  return (
    <div className={clsx([styles.layoutItem])}>
      <img alt="" src={image} loading="lazy"/>
      <div className={styles.layoutItemRight}>
        <div>
          <p className={styles.title}>1988 Dragon {name}</p>

          <Button
            style={{ marginBottom: 5, marginTop: 'auto' }}
            className={styles.startStakingBtn}
            loading={loadingStaking}
            onClick={() => staking()}
            block
          >
            Start Staking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LayoutItem;
