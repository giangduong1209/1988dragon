import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import { getEllipsisTxt } from 'utils/format';
import styless from './ListedBox.module.css';
import { useSigner } from 'wagmi';
import { ethers, Signer } from 'ethers';
import constants from '../../../../../constants';
import { failureModal, successModal } from '../../../../../helpers/modal';
import { useRouter } from 'next/router';
import { getExplorer } from '../../../../../helpers/networks';

interface ListedBoxParams {
  address: string | undefined;
  price: string | undefined;
  item: string | undefined;
  tokenAddress: string | undefined;
}

const ListedBox = ({ address, price, item, tokenAddress }: ListedBoxParams) => {
  const { data: signer } = useSigner();
  const marketplace = new ethers.Contract(constants.MRKPLACE_ADDR, constants.MRKPLACE_ABI, signer as Signer);
  const router = useRouter();
  const [loadingBuy, setLoadingBuy] = useState<boolean>(false);
  const buyItem = async () => {
    if (signer) {
      try {
        setLoadingBuy(true);
        const transferPrice = ethers.utils.parseEther(price as string);
        const createSale = await marketplace.createMarketSale(address, item, { value: transferPrice });
        const tx = await createSale.wait();
        console.log('Tx', tx.events);
        setLoadingBuy(false);
        successModal();
        router.push('/balances/nft');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      failureModal('Error', 'Please connect your wallet first');
    }
  };

  const txHash = `${getExplorer(constants.CHAIN.bscChain.id)}address/${tokenAddress}`;
  return (
    <div className={styless.cardListedbox}>
      <div className={styless.description}>
        Contract by:
        <br />
        <a className={styless.viewAddress} style={{ color: '#000', fontWeight: 'bold' }}>
          {getEllipsisTxt(address ? address : '')}
        </a>
      </div>
      <div
        className={styless.prices}
        style={{
          borderTop: 'solid 1px gray',
          borderBottom: 'solid 1px gray',
        }}
      >
        {price === '0.0' ? '--' : price} <span style={{ fontSize: '50%' }}> BNB </span>
      </div>
      <div className={styless.content}>
        <Row justify="space-between" gutter={16}>
          <Col span={12}>
            <Button
              className={styless.exploreBtn}
              style={{ marginTop: '10px' }}
              disabled={price === '0.0'}
              onClick={() => {
                window.open(txHash, '_blank');
              }}
            >
              <span>Trx Info</span>
            </Button>
          </Col>
          <Col span={12}>
            <Button
              className={styless.btnInfo}
              style={{
                fontFamily: 'GILROY',
                fontWeight: 700,
                marginTop: '10px',
              }}
              disabled={price === '0.0'}
              onClick={buyItem}
              loading={loadingBuy}
            >
              <span>Buy</span>
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ListedBox;
