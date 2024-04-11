/* eslint-env browser */

import React, { FC, useEffect, useState } from 'react';
import { Box, Image, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { EvmNft } from '@moralisweb3/common-evm-utils';
import { getEllipsisTxt } from 'utils/format';
import { resolveIPFSByPinata, resolveIPFSByPublicGateway } from 'utils/resolveIPFS';
import { ethers } from 'ethers';
import constants from '../../../../constants';

export interface ItemCardParams {
  key: number;
  nft: EvmNft;
}

const ItemCard: FC<ItemCardParams> = ({ nft: { tokenAddress, result, metadata } }) => {
  const bgColor = useColorModeValue('#555', 'gray.700');
  const color1 = useColorModeValue('#000', '#fff');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const marketplace = new ethers.Contract(constants.MRKPLACE_ADDR, constants.MRKPLACE_ABI, constants.PROVIDER);
  const [price, setPrice] = useState<string>('1');

  async function getPrice() {
    console.log('address', tokenAddress.format());
    console.log('tokenId', result.tokenId);
    const tokenPrice = await marketplace.fetchMarketItem(tokenAddress.format(), result.tokenId);
    const priceString = ethers.utils.formatEther(tokenPrice.price);
    setPrice(priceString);
  }

  useEffect(() => {
    getPrice();
  }, [tokenAddress]);

  const media1988Dragon = () => {
    let medURL: string | undefined;
    if (tokenAddress.lowercase === constants.NFT_ADDR.toLowerCase()) {
      medURL = resolveIPFSByPinata((metadata as { image?: string })?.image);
    } else {
      medURL = resolveIPFSByPublicGateway((metadata as { image?: string })?.image);
    }
    return medURL;
  };

  const MedHTML = () => {
    const typeMed = (metadata as { type?: string })?.type;
    if (typeMed?.includes('video')) {
      return (
        <video autoPlay style={{ height: '260px' }}>
          <source src={media1988Dragon()} type="video/mp4" />
        </video>
      );
    }
    if (typeMed?.includes('audio')) {
      return <audio src={media1988Dragon()}></audio>;
    }
    return <Image src={media1988Dragon()} alt={'nft'} minH="260px" minW="260px" boxSize="100%" objectFit="fill" />;
  };

  return (
    <>
      <Box maxWidth="375px" bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
        <div className="featured-card1">
          <div className="featured-img">
            <img src="./img/BNBToken.svg" className="bnb-img" alt="BNB" />
            <MedHTML />
            <div className="card-overlay">
              <Link href={`/nft/${tokenAddress.format()}/${result.tokenId}`}>
                <a className="eg-btn btn--fill-white">View Details</a>
              </Link>
            </div>
          </div>
          <div className="featured-content">
            <div className="featured-meta">
              <div className="f-author">
                <img src="/img/author-details.png" alt="" />
                <p style={{ color: `${color1}` }}>{getEllipsisTxt(tokenAddress.format())}</p>
              </div>
            </div>
            <h5>
              <Link href="">
                <a style={{ color: `${color1}` }}>{(metadata as { name?: string })?.name}</a>
              </Link>
            </h5>
            <div className="featured-card-bttm">
              <span style={{ color: `${color1}` }}>Price:</span>
              <span style={{ color: `${color1}` }}>{price} BNB</span>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default ItemCard;
