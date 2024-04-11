import React, { FC, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { Button, Statistic } from 'antd';
import { metadata } from '../../GameDashboardContent/GameDashboardContent';
import Constants from '../../../../../constants';
import moment from 'moment';
import { ethers, Signer } from 'ethers';
import { failureModal, successModal } from '../../../../../helpers/modal';
import { countdownValueType } from 'antd/es/statistic/utils';
import { useSigner } from 'wagmi';
import { useColorModeValue } from '@chakra-ui/react';

const LayoutItemContent: FC<metadata> = ({ image, title, date, tokenId }) => {
  const { Countdown } = Statistic;
  const color1 = useColorModeValue('#000', '#fff');

  const stakeTime = moment.unix(date).toDate();
  const stakingTimeDuration = Constants.staking.duration;
  const deadline = moment(stakeTime).add(stakingTimeDuration.VALUE, 'minute').toDate();
  let flag = false;
  if (Date.now() >= deadline.valueOf()) {
    flag = true;
  }
  const [isHitToDeadline, setIsHitToDeadline] = useState(flag);
  const [loadingUnStaking, setLoadingUnStaking] = useState(false);

  const [format, setFormat] = useState('D [days] H [hours] m [minutes]');
  const { data: signer } = useSigner();
  const unstaking = async () => {
    const stakingContract = new ethers.Contract(Constants.STAKING_ADDR, Constants.STAKING_ABI, signer as Signer);
    setLoadingUnStaking(true);
    try {
      const unStakeTx = await stakingContract.unStake([tokenId]);
      await unStakeTx.wait();
      setLoadingUnStaking(false);
      successModal('Unstaking success');
    } catch (error) {
      setLoadingUnStaking(false);
      failureModal('Unstaking failed');
    }
  };

  function handleChangeTimeCountDown(time: countdownValueType | undefined) {
    if (time) {
      if (time <= 60 * 60 * 24 * 1000) {
        setFormat('H [hours] m [minutes] s [seconds]');
      }
    }
  }

  return (
    <div className={clsx([styles.layoutItem])}>
      <img src={image} alt="img" />

      <div className={styles.layoutItemRight}>
        <div>
          {/* {item.title && <p className={styles.title}>{item.title}</p>} */}
          <p style={{ color: `${color1}` }}>1988 Dragon {title}</p>
        </div>

        {/* <div
      className={clsx("input-text")}
      style={{ marginBottom: 5, marginTop: "auto" }}
    >
      2
    </div> */}
        {isHitToDeadline ? (
          <Button
            className={styles.unStakingBtn}
            onClick={() => unstaking()}
            loading={loadingUnStaking}
            style={{ marginBottom: 5, marginTop: 'auto' }}
            block
          >
            UnStaking
          </Button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <div className={styles.description} style={{ color: `${color1}` }}>
              Available for un-staking after:
            </div>
            <Countdown
              onChange={(time) => handleChangeTimeCountDown(time)}
              onFinish={() => setIsHitToDeadline(true)}
              value={deadline.valueOf()}
              format={format}
              valueStyle={{
                paddingLeft: '10px',
                color: '#36a920',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutItemContent;
