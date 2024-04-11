export const resolveIPFSByPublicGateway = (url?: string) => {
  if (!url || !url.includes('ipfs://')) {
    return url;
  }
  return url.replace('ipfs://', 'https://cf-ipfs.com/ipfs/');
};

export const resolveIPFSByTokenURI = async (tokenURIInput?: string) => {
  if (!tokenURIInput) {
    return tokenURIInput;
  }
  let tokenURI: string;
  if (tokenURIInput.includes('https')) {
    tokenURI = tokenURIInput.replace('https://ipfs.moralis.io:2053', 'https://myipfs.mypinata.cloud');
  } else {
    tokenURI = tokenURIInput.replace('ipfs://', 'https://myipfs.mypinata.cloud/ipfs/');
  }
  const response = await fetch(tokenURI);
  if (!response.ok) {
    throw new Error('Can not fetch item data by token uri!');
  }
  const itemData = await response.json();
  return { ...itemData, image: resolveIPFSByPinata(itemData.image) };
};

export const resolveIPFSByPinata = (url?: string) => {
  if (!url || !url.includes('ipfs://')) {
    return url;
  }
  return url.replace('ipfs://', 'https://myipfs.mypinata.cloud/ipfs/');
};

export const resolveIPFSPubliccByTokenURI = async (tokenURIInput?: string) => {
  if (!tokenURIInput) {
    return tokenURIInput;
  }

  const response = await fetch(tokenURIInput);
  if (!response.ok) {
    throw new Error('Can not fetch item data by token uri!');
  }
  const itemData = await response.json();
  return { ...itemData, image: resolveIPFSByPublicGateway(itemData.image) };
};
