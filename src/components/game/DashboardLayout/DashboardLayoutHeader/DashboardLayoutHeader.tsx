import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Button, Grid } from 'antd';
import { ethers, Signer } from 'ethers';
import styles from './styles.module.css';
import { useAccount, useSigner } from 'wagmi';
import { MenuOutlined } from '@ant-design/icons';
import Constants from '../../../../../constants/index';
import { useAppDispatch } from 'store/hooks';
import { toggleStakingModal } from 'store/slice/ui-slice';

const { useBreakpoint } = Grid;

function DashboardLayoutHeader() {
  const { md } = useBreakpoint();
  const { address } = useAccount();
  const [usd, setUSD] = useState('0');
  const [balances, setBalance] = useState('0');
  const { data: signer } = useSigner();

  const dispatch = useAppDispatch();
  async function callData() {
    const nftCollection = new ethers.Contract(Constants.NFT_ADDR, Constants.NFT_ABI, signer as Signer);
    const cost = await nftCollection?.cost();
    const balance = await nftCollection?.balanceOf(address);
    console.log(balance?.toString());
    setUSD(ethers.utils.formatEther(cost?.mul(balance))?.toString());
    setBalance(balance?.toString());
  }

  useEffect(() => {
    if (address && signer) {
      callData();
    }
  }, [address, signer]);

  const showStakingModalHandler = () => {
    dispatch(toggleStakingModal());
  };

  return (
    <div className={clsx(styles.gameLayoutHeader)}>
      <div className={styles.gameLayoutHeaderItem}>
        <p>$USD Balance</p>
        <div className={styles.inputText}>{usd}</div>
      </div>
      <div className={styles.gameLayoutHeaderItem}>
        <p>My Total NFTs</p>
        <div className={styles.inputText}>{balances}</div>
      </div>

      {!md && (
        <div className={styles.gameLayoutHeaderItem} style={{ flex: 0 }}>
          <p style={{ opacity: 0 }}>a</p>
          <Button className={styles.btnMenuMob} icon={<MenuOutlined />} onClick={showStakingModalHandler} />
        </div>
      )}
    </div>
  );
}

export default DashboardLayoutHeader;
