import { useState } from 'react'
import { NFTCard } from './components/nftCard';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  //fetch NFT function
  const fetchNFTs = async() =>{
    let nfts;
    console.log("Fetching NFTs.");
    const api_key = "<api_key_here>";
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
    let requestOptions = {
      method:"GET"
    };

    if(!collection.length){
      //if collection is not provided then we can only fetch by wallet address
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(response => response.json());
    }
    else{
      //fetch by wallet address and specific collection address
      console.log("Fetching NFTs for collection owned by address.");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    //check whether we have the NFTs or not
    if(nfts){
      console.log("NFTs :",nfts);
      setNFTs(nfts.ownedNfts);
    }
  }
  
  //function to fetch NFTs solely by the collection name -> wallet address is not known in this case
  const fetchNFTsByCollection = async() => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "<api_key_here>";
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
      <input disabled = {fetchForCollection} onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input><br></br>
      <input onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input><br></br>
        <label className="text-gray-600 "><input type={"checkbox"} onChange = {(e) => {
          setFetchForCollection(e.target.checked)
        }} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if(fetchForCollection){
              fetchNFTsByCollection()
            }
            else{
              fetchNFTs()
            }
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home