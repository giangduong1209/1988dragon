import Link from 'next/link';
import { IMint } from './types';
import { FC, useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers';
import { Image, Spinner, useColorModeValue } from '@chakra-ui/react';
import { useAccount, useSigner } from 'wagmi';
import { failureModal, successModal } from '../../../../helpers/modal';
import { Avatar, Card, Col, Row, Select, Pagination } from 'antd';
import { COLLECTIONS } from '../../../../constants/CollectionsData/collections';
import { nftCollectionAddr, paymentTokenAddr } from '../../../../constants/address';
import constants from '../../../../constants';
import { resolveIPFSByTokenURI } from 'utils/resolveIPFS';
import { FilterType, SortType } from '../../../../enum';
const { Meta } = Card;

interface NFTMetadata {
  name: string;
  tokenId: string;
  description: string;
  image: string;
  price: string;
}

const Mint: FC<IMint> = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [quantity, setQuantity] = useState(1);
  const color = useColorModeValue('#fff', '#000');
  const color1 = useColorModeValue('#000', '#fff');

  const [loadingMint, setLoadingMint] = useState<boolean>(false);
  const paymentTokenAddress = paymentTokenAddr.testnet;
  const collectionAddress = nftCollectionAddr.testnet;
  const [sortType, setSortType] = useState<SortType>(SortType.DEFAULT);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [nftPerPage, setPerPage] = useState<NFTMetadata[]>([]);
  const [currentUnit, setCurrentUnit] = useState<string>('');
  const [totalSupply, setTotalSupply] = useState<string>('');
  const [total, setTotal] = useState<number>(1479);

  useEffect(() => {
    loadNFT(1, 12, {
      sort: sortType,
      filter: filterType,
    });
    getTotalSupply();
  }, [sortType, filterType]);

  const getTotalSupply = async () => {
    const nftContract = new ethers.Contract(constants.NFT_ADDR, constants.NFT_ABI, constants.PROVIDER);
    const totalSupplyCon = await nftContract.totalSupply();
    setTotalSupply(totalSupplyCon.toString());
  };

  const handleFilter = (type: FilterType, tokenIds: string[]) => {
    let tokenIdFiltered: string[] = [];
    switch (type) {
      case FilterType.LERMER:
        tokenIdFiltered = tokenIds.filter((tokenId) => parseFloat(tokenId) < 9);
        break;
      case FilterType.COOL:
        tokenIdFiltered = tokenIds.filter((tokenId) => parseFloat(tokenId) > 9 && parseFloat(tokenId) < 188);
        break;
      case FilterType.NGER:
        tokenIdFiltered = tokenIds.filter((tokenId) => parseFloat(tokenId) > 188 && parseFloat(tokenId) < 1988);
        break;
      default:
        tokenIdFiltered = tokenIds;
        break;
    }
    return tokenIdFiltered;
  };
  const handleSort = (
    type: SortType,
    tokens: {
      tokenId: string;
      price: number;
    }[],
  ) => {
    let tokenIdSorted: string[] = [];
    switch (type) {
      case SortType.HIGHEST_PRICE:
        tokenIdSorted = tokens.sort((a, b) => b.price - a.price).map((token) => token.tokenId);
        break;
      case SortType.LOWEST_PRICE:
        tokenIdSorted = tokens.sort((a, b) => a.price - b.price).map((token) => token.tokenId);
        break;
      default:
        tokenIdSorted = tokens.map((token) => token.tokenId);
        break;
    }
    return tokenIdSorted;
  };
  // eslint-disable-next-line no-undef
  const selectCurrent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // eslint-disable-next-line no-undef
    setCurrentUnit((event.target as HTMLSelectElement).value);
  };

  const loadNFT = async (
    page: number,
    pageSize: number,
    {
      sort,
      filter,
    }: {
      sort: SortType;
      filter: FilterType;
    },
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      const marketplaceContract = new ethers.Contract(
        constants.MRKPLACE_ADDR,
        constants.MRKPLACE_ABI,
        constants.PROVIDER,
      );
      const marketItems = await marketplaceContract.fetchMarketItems(constants.NFT_ADDR);
      // get listed NFTs
      const nftContract = new ethers.Contract(constants.NFT_ADDR, constants.NFT_ABI, constants.PROVIDER);
      const listedNFTs = marketItems.map((item: any) => {
        return {
          tokenId: item.tokenId.toString(),
          price: ethers.utils.formatEther(item.price.toString()).toString(),
        };
      });
      const tokenIdListeds = marketItems.map((item: any) => item?.tokenId?.toString());
      const remainTokenIds = Array.from(Array(1479).keys())
        .map((x) => x + 1)
        .filter((tokenId) => !tokenIdListeds.includes(tokenId.toString()));
      const allTokenIds = [...tokenIdListeds, ...remainTokenIds];

      const tokenIdFiltered = handleFilter(filter, allTokenIds);
      setTotal(tokenIdFiltered.length);
      const tokenIdSorted = handleSort(
        sort,
        tokenIdFiltered.map((tokenId) => {
          const price = listedNFTs.find((nft: { tokenId: string }) => nft.tokenId === tokenId.toString());
          return {
            tokenId: tokenId.toString(),
            price: price ? parseFloat(price.price) : 0,
          };
        }),
      );
      const tokenIdPaging = tokenIdSorted.slice(skip, skip + limit);
      const baseURI = await nftContract.baseTokenURI();
      const baseExt = await nftContract.baseExtension();
      const tokenURIs = tokenIdPaging.map((tokenId) => {
        return {
          tokenId: tokenId.toString(),
          tokenURI: `${baseURI}${tokenId}${baseExt}`,
        };
      });
      console.log('tokenURIs', tokenURIs);
      console.log('list', listedNFTs);
      const nftPaging: NFTMetadata[] = await Promise.all(
        tokenURIs.map(async (token) => {
          const metadata = await resolveIPFSByTokenURI(token.tokenURI);
          const price = listedNFTs.find((nft: { tokenId: string }) => nft.tokenId === token.tokenId)?.price ?? '0';
          const nft: NFTMetadata = {
            name: metadata?.name?.toString() ?? '',
            tokenId: token?.tokenId ?? '',
            description: metadata?.description ?? '',
            image: metadata?.image ?? '',
            price: price ?? '0',
          };
          return nft;
        }),
      );
      console.log(nftPaging);
      // get remainning NFTs
      setPerPage(nftPaging);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = async () => {
    setLoadingMint(true);
    const nftCollection = new ethers.Contract(
      collectionAddress,
      ['function cost() view returns(uint256)', 'function mint(address, uint256) external'],
      signer as Signer,
    );
    const paymentToken = new ethers.Contract(
      paymentTokenAddress,
      ['function approve(address, uint256) external'],
      signer as Signer,
    );
    const cost = await nftCollection.cost();
    try {
      const paymentTokenTx = await paymentToken.approve(collectionAddress, cost.mul(ethers.BigNumber.from(quantity)));
      await paymentTokenTx.wait();
      console.log(paymentTokenTx);
      const mintTx = await nftCollection.mint(address, quantity);
      await mintTx.wait();
      console.log('mint tx', mintTx);
      setLoadingMint(false);
      successModal('Minted successfully!', 'Your NFT is minted!');
    } catch (error) {
      setLoadingMint(false);
      failureModal('Minting failed!', 'Please try again!.');
      console.log(error);
    }
  };

  const updateQuantity = (type: string) => {
    if (type === '+') {
      setQuantity(quantity + 1);
    } else if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }
  };

  const handleChange = (event: any) => {
    setQuantity(+event.target.value);
  };

  const Collection1988 = () => {
    return (
      <>
        <Row gutter={[16, 16]}>
          {nftPerPage?.map((obj: NFTMetadata) => {
            const name = '1988 Dragon '.concat(obj.name);
            return (
              <Col span={6} key={obj.tokenId}>
                <Card
                  hoverable
                  style={{
                    position: 'relative',
                    width: 280,
                  }}
                  cover={<Image width={280} height={280} alt="example" src={obj.image} loading="lazy" />}
                >
                  {obj.price !== '0' && (
                    <div className="price">
                      <span>{obj.price} BNB</span>
                    </div>
                  )}
                  <Meta avatar={<Avatar src="./images/dragon_ava.jpg" />} title={name}></Meta>

                  <Link href={`/nft/${collectionAddress}/${obj.tokenId}`}>
                    <a
                      className="eg-btn-dragon-view btn--fill-white-dragon"
                      style={{ display: 'block', margin: '20px auto 0 auto', background: 'rgba(0,0,0,0.1)' }}
                    >
                      View Details
                    </a>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>

        <div className="pagination-dragon">
          <Pagination
            total={total}
            hideOnSinglePage={true}
            onChange={(page, pageSize) =>
              loadNFT(page, pageSize, {
                sort: sortType,
                filter: filterType,
              })
            }
            defaultCurrent={1}
            defaultPageSize={12}
          />
        </div>
      </>
    );
  };

  return (
    <div className="metaportal_fn_mintpage">
      <div className="container small">
        <div className="metaportal_fn_mint_top">
          <div className="mint_left">
            <div className="img">
              <div className="img_in" style={{ backgroundImage: `url(${COLLECTIONS[1] && COLLECTIONS[1].image})` }}>
                <Image width={500} height={500} src="/img/1x1.jpg" alt="" />
              </div>
            </div>
          </div>
          <div className="mint_right">
            <div className="metaportal_fn_breadcrumbs">
              <p>
                <Link href="/">
                  <a style={{ color: `${color1}` }}>Home</a>
                </Link>
                <span className="separator">/</span>
                <Link href="/collection">
                  <a style={{ color: `${color1}` }}>Collection</a>
                </Link>
                <span className="separator">/</span>
                <span style={{ color: `${color1}` }} className="current">
                  {COLLECTIONS[1] && COLLECTIONS[1].title}
                </span>
              </p>
            </div>
            <h3
              style={{ color: `${color1}` }}
              className="fn__maintitle"
              data-text={COLLECTIONS[1] && COLLECTIONS[1].title}
              data-align="left"
            >
              {COLLECTIONS[1] && COLLECTIONS[1].title}
            </h3>
            <div className="desc">
              <p style={{ color: `${color1}` }}>
                1988 Dragon includes the NFT 1988 collection of unique dragon drawings with completely different shades.
                NFTs are classified into three groups LERMER, COOL and NGER, with their privileges for users to
                experience the services in this ecosystem.
              </p>
              <p style={{ color: `${color1}` }}>
                A 1% NFT transaction fee will be collected; this fee comes from NFT trading and transfer activities
                between e-wallets.
              </p>
            </div>
          </div>
        </div>

        <div className="metaportal_fn_mintbox">
          <div className="mint_right">
            <Card
              hoverable
              cover={<Image className="imageBox" width={600} height={425} alt="example" src="./1988dragon_box.gif" />}
            ></Card>
          </div>
          <div className="mint_left">
            <div className="mint_title">
              <span style={{ color: `${color}` }}>Public Mint is Live</span>
            </div>
            <div className="mint_list">
              <ul>
                <li>
                  <div className="item">
                    <h4 style={{ color: `${color1}` }}>Price</h4>
                    <div className="price-sec">
                      <span>1</span>
                      <select style={{ border: 'none' }} onChange={selectCurrent}>
                        <option value="BNB">BNB</option>
                        <option value="BUSD">BUSD</option>
                        <option value="USDT">USDT</option>
                      </select>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <h4 style={{ color: `${color1}` }}>Remaining</h4>
                    <h3 style={{ color: `${color1}` }}>{1988 - +totalSupply}/1988</h3>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <h4 style={{ color: `${color1}` }}>Quantity</h4>
                    <div className="qnt">
                      <span className="decrease" onClick={() => updateQuantity('-')}>
                        -
                      </span>
                      <input
                        style={{
                          margin: '0 10px',
                          textAlign: 'center',
                          border: `1px solid transparent`,
                          height: '30px',
                          minWidth: 'unset',
                          color: `${color1}`,
                        }}
                        className="inputQuantity"
                        type="number"
                        pattern="[0-9]*"
                        min={0}
                        onChange={handleChange}
                        value={quantity}
                      />

                      <span className="increase" onClick={() => updateQuantity('+')}>
                        +
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <h4 style={{ color: `${color1}` }}>Total Price</h4>
                    <h3>
                      <span style={{ color: `${color1}` }} className="total_price">
                        {(Number(COLLECTIONS[1].price) * quantity).toFixed(2)}
                      </span>
                      <span style={{ color: `${color1}` }}> {currentUnit ? currentUnit : 'BNB'} + GAS</span>
                    </h3>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mint_desc" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleClick}
                className="metaportal_fn_button"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {loadingMint ? <Spinner color={color1} size="md" label="" /> : <></>}
                <span style={{ color: `${color1}`, margin: '0 10px' }}>UNBOX</span>
              </button>
              <p style={{ color: `${color1}`, marginTop: '0', marginLeft: '20px' }}>
                By clicking UNBOX button, you agree to our{' '}
                <a style={{ color: `${color1}` }} href="#">
                  Terms of Service
                </a>{' '}
                and our{' '}
                <a style={{ color: `${color1}` }} href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="rightBlock">
          {/* <div className="fetch">
            <button onClick={fetchData}>
              <i className="fas fa-sync-alt iconcycle"></i>
            </button>
          </div> */}
          <div>
            <Select
              showSearch
              style={{
                width: 200,
                marginTop: 4,
              }}
              className="filter-sec"
              optionFilterProp="children"
              defaultValue={FilterType.ALL}
              onChange={(value) => setFilterType(value)}
              options={[
                {
                  value: FilterType.ALL,
                  label: 'All Types',
                },
                {
                  value: FilterType.LERMER,
                  label: 'Lermer Dragon',
                },
                {
                  value: FilterType.COOL,
                  label: 'Cool Dragon',
                },
                {
                  value: FilterType.NGER,
                  label: 'Nger Dragon',
                },
              ]}
            />
            <Select
              showSearch
              style={{
                width: 200,
                marginTop: 4,
              }}
              className="filter-sec"
              optionFilterProp="children"
              defaultValue={SortType.DEFAULT}
              onChange={(value) => setSortType(value)}
              options={[
                {
                  value: SortType.DEFAULT,
                  label: 'Order Default',
                },
                {
                  value: SortType.HIGHEST_PRICE,
                  label: 'Highest fixed price',
                },
                {
                  value: SortType.LOWEST_PRICE,
                  label: 'Lowest fixed price',
                },
              ]}
            />
          </div>
        </div>
        <div className="nft">
          <Collection1988 />
        </div>
        <div className="metaportal_fn_similar">
          <h3 className="fn__maintitle" data-text="Feature Items">
            Feature Items
          </h3>

          <div className="fn_cs_divider">
            <div className="divider">
              <span />
              <span />
            </div>
          </div>
          <div className="metaportal_fn_drops">
            <ul className="grid">
              {COLLECTIONS &&
                COLLECTIONS.map(
                  (nft) =>
                    nft.id < 8 && (
                      <li key={nft.id}>
                        <div className="nft__item">
                          <div className="img_holder">
                            <Image width={350} height={350} src={nft.image} alt="" />
                            <Link href={`/${nft.link}`}>
                              <a className="full_link"></a>
                            </Link>
                          </div>
                          <div className="title_holder">
                            <h3 className="fn_title">
                              <a style={{ color: `${color1}` }} href="#">
                                {nft.title}
                              </a>
                            </h3>
                          </div>
                        </div>
                      </li>
                    ),
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
