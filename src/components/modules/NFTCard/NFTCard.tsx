/* eslint-env browser */
import { Eth } from '@web3uikit/icons';
import { ethers, Signer } from 'ethers';

import React, { useState, FC } from 'react';
import { Button, Input, Modal } from 'antd';
import { Box, HStack, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { EvmNft } from '@moralisweb3/common-evm-utils';
import { resolveIPFSByPinata, resolveIPFSByPublicGateway } from 'utils/resolveIPFS';
import constants from '../../../../constants';
import { useSigner, useAccount } from 'wagmi';
import { failureModal, successModal } from '../../../../helpers/modal';
import { useRouter } from 'next/router';
import { getExplorer } from '../../../../helpers/networks';

export interface NFTCardParams {
  key: number;
  nft: EvmNft;
}

const NFTCard: FC<NFTCardParams> = ({ nft: { amount, contractType, symbol, metadata, result, tokenAddress } }) => {
  const bgColor = useColorModeValue('#555', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const [price, setPrice] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [formValid, setFormValid] = useState({
    priceErr: false,
    priceFormatErr: false,
  });
  const [visible, setVisibility] = useState<boolean>(false);
  const [visibleTransferModal, setVisibilityTransferModal] = useState<boolean>(false);
  const [receiver, setReceiver] = useState<string>('');
  const [validReceiver, setValidReceiver] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState<boolean>(false);

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const marketPlace = new ethers.Contract(constants.MRKPLACE_ADDR, constants.MRKPLACE_ABI, signer as Signer);

  const txHash = `${getExplorer(constants.CHAIN.bscChain.id)}address/${tokenAddress.format()}`;
  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
    setFormValid({ ...formValid, priceFormatErr: false });
  };

  const isFormValid = () => {
    if (price === undefined || price === '') {
      setFormValid({ ...formValid, priceErr: true });
      return false;
    }

    if (parseFloat(price) <= 0) {
      setFormValid({ ...formValid, priceFormatErr: true });
      return false;
    }
    return true;
  };

  const onSell = async () => {
    setLoading(true);
    if (!isFormValid()) {
      return;
    }
    if (signer) {
      try {
        const priceValue: string = ethers.utils.parseEther(price as string).toString();
        const collectionAddr = tokenAddress?.format();
        const tokenId = result?.tokenId;
        const approveABI = ['function approve(address, uint256)'];
        const approveFunction = new ethers.Contract(collectionAddr as string, approveABI, signer as Signer);
        const approveFunc = await approveFunction.approve(constants.MRKPLACE_ADDR, tokenId);
        await approveFunc.wait();
        const sellTx = await marketPlace.createMarketItem(collectionAddr, tokenId, priceValue);
        await sellTx.wait();
        setVisibility(false);
        setLoading(false);
        successModal('Success', 'Sell successfully');
        if (tokenAddress.lowercase === constants.NFT_ADDR.toLowerCase()) {
          router.push('/mint');
        } else {
          router.push('/marketplace');
        }
      } catch (e) {
        failureModal('Fail', 'Something went wrong');
        setLoading(false);
      }
    } else {
      failureModal('Error', 'Please connect your wallet first');
    }
  };

  const checkValidAddress = (input: string) => {
    const format = /^0x[a-fA-F0-9]{40}$/g;
    return format.test(input) ? true : false;
  };

  const handleInputAddress = (input: string) => {
    if (checkValidAddress(input)) {
      setValidReceiver(true);
      setReceiver(input);
    } else {
      setValidReceiver(false);
    }
  };

  const onTransfer = async () => {
    if (validReceiver) {
      try {
        setLoadingTransfer(true);
        const approveABI = ['function approve(address, uint256)'];
        const nftAddress = tokenAddress.format();
        const tokenIdTranfer = result?.tokenId.toString();
        const nftCollection = new ethers.Contract(nftAddress, approveABI, signer as Signer);
        const approveTx = await nftCollection.approve(receiver, tokenIdTranfer);
        await approveTx.wait();
        const transferABI = ['function transferFrom(address, address, uint256)'];
        const nftTransfer = new ethers.Contract(nftAddress, transferABI, signer as Signer);
        const transferTx = await nftTransfer.transferFrom(address, receiver, tokenIdTranfer);
        await transferTx.wait();
        setLoadingTransfer(false);
        setVisibilityTransferModal(false);
        successModal('Success', 'Transfer successfully');
      } catch (err) {
        setLoadingTransfer(false);
        failureModal('Fail', 'Somthing went wrong');
      }
      setLoadingTransfer(false);
    }
  };

  const errorMessageTransfer = () => {
    if (validReceiver) {
      return (
        <div>
          <p style={{ color: 'green' }}> Valid address</p>
        </div>
      );
    }
    return (
      <div>
        <p style={{ color: 'red' }}> Invalid address</p>
      </div>
    );
  };

  const transferModal = (
    <Modal
      title={`Transfer ${(metadata as { name?: string })?.name}`}
      open={visibleTransferModal}
      onCancel={() => setVisibilityTransferModal(false)}
      footer={[
        <Button key="1" className="btnCancel" onClick={() => setVisibilityTransferModal(false)}>
          Cancel
        </Button>,
        <Button key="3" type="primary" className="btnAution" onClick={onTransfer} loading={loadingTransfer}>
          Transfer
        </Button>,
      ]}
    >
      <Input
        placeholder="Receiver"
        onChange={(e) => {
          handleInputAddress(e.currentTarget.value);
        }}
      ></Input>
      {errorMessageTransfer()}
      <Input placeholder="Amount to send" defaultValue={1}></Input>
    </Modal>
  );

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

  const listModal = (
    <Modal
      title={`Sell ${(metadata as { name?: string })?.name}`}
      open={visible}
      onCancel={() => setVisibility(false)}
      footer={[
        <Button key="1" className="btnCancel" onClick={() => setVisibility(false)}>
          Cancel
        </Button>,
        <Button key="3" type="primary" className="btnAution" onClick={onSell} loading={loading}>
          Sell
        </Button>,
      ]}
    >
      <div
        style={{
          width: '260px',
          margin: 'auto',
          borderRadius: '10px',
          marginBottom: '15px',
        }}
      >
        <MedHTML />
        <Input
          autoFocus
          placeholder="Set Price in BNB"
          onChange={onChangePrice}
          min={0}
          type="number"
          style={{ width: '100%', margin: '10px 0' }}
        />
        <div style={{ color: 'red' }}>{!price ? 'Please input your price' : ''}</div>
        <div style={{ color: 'red' }}>{price && formValid.priceFormatErr ? 'Price must greater than 0' : ''}</div>
      </div>
    </Modal>
  );

  return (
    <>
      {visible ? listModal : null}

      <Box maxWidth="315px" bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
        <Box maxHeight="260px" overflow={'hidden'} borderRadius="xl">
          <MedHTML />
        </Box>
        <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
          {(metadata as { name?: string })?.name}
        </Box>
        <HStack alignItems={'center'}>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="smaller">
            {contractType}
          </Box>

          <Eth fontSize="20px" />
        </HStack>
        <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
          <Box>
            <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
              Symbol
            </Box>
            <Box as="h4" noOfLines={1} fontSize="sm">
              {symbol}
            </Box>
          </Box>
          <Box>
            <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
              Amount
            </Box>
            <Box as="h4" noOfLines={1} fontSize="sm">
              {amount}
            </Box>
          </Box>
        </SimpleGrid>
        <SimpleGrid columns={3} spacing={4} padding={2.5} borderRadius="xl" marginTop={2}>
          <Button
            onClick={() => {
              window.open(txHash, '_blank');
            }}
          >
            Tx info
          </Button>
          <Button onClick={() => setVisibilityTransferModal(true)}>
            <span>Transfer</span>
          </Button>
          <Button onClick={() => setVisibility(true)}>
            <span>List</span>
          </Button>
        </SimpleGrid>
      </Box>
      {visible ? listModal : null}
      {visibleTransferModal ? transferModal : null}
    </>
  );
};

export default NFTCard;
