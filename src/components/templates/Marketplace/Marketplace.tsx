import { Grid, useColorModeValue } from '@chakra-ui/react';
import { ItemCard } from 'components/modules';
import { Input, Select, Space } from 'antd';
import { useEvmWalletNFTs } from '@moralisweb3/next';

import constants from '../../../../constants';
import { useEffect, useState } from 'react';
import { EvmNft } from 'moralis/common-evm-utils';

const Marketplace = () => {
  const { Search } = Input;
  const color1 = useColorModeValue('#000', '#fff');

  const { data: items } = useEvmWalletNFTs({
    address: constants.MRKPLACE_ADDR,
    chain: constants.CHAIN.bscChain.id,
  });
  console.log('Items', items);
  const [collectionItems, setCollectionItems] = useState<EvmNft[] | undefined>([]);
  const dragonAddress = '0x98331decd9de4b3261c00068057ce5c3a8de7e04' as string;
  const filterHandle = (e: any) => {
    if (e.currentTarget.value) {
      setCollectionItems(
        collectionItems?.filter((item) => item?.result.tokenId.toString().includes(e.currentTarget.value)),
      );
    } else {
      setCollectionItems(items?.filter((item) => item?.tokenAddress.format() !== dragonAddress));
    }
  };
  useEffect(() => {
    setCollectionItems(items?.filter((item) => item?.tokenAddress.format() !== dragonAddress));
  }, [items]);
  return (
    <>
      <div className="metaportal_fn_mintpage">
        <div className="container small" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div className="rightBlock">
            <div>
              <Space style={{ height: '44px' }}>
                <Search placeholder="Search Token ID" allowClear size="small" onChange={filterHandle} />
              </Space>
            </div>
            <div>
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                className="filter-sec"
                placeholder="Recently  listed"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={[
                  {
                    value: '1',
                    label: 'Lowest total price',
                  },
                  {
                    value: '2',
                    label: 'Highest total price',
                  },
                  {
                    value: '3',
                    label: 'Lowest fixed price',
                  },
                  {
                    value: '4',
                    label: 'Highest fixed price',
                  },
                ]}
              />
            </div>
          </div>
          <div className="nft">
            <Grid className="NFT">
              {collectionItems ? (
                collectionItems.map((item, key) => <ItemCard nft={item} key={key} />)
              ) : (
                <p style={{ color: `${color1}` }}>No NFT</p>
              )}
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;
