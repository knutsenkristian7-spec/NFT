import { ethers } from "ethers"
import { NFT_ADDRESS, NFT_ABI, MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "./constants"
import NFTABI from "./../backend/artifacts/contracts/NFT.sol/NFT.json";
export async function getProvider() {
  return new ethers.BrowserProvider(window.ethereum)
}

export async function getSigner() {
  const provider = await getProvider()
  return await provider.getSigner()
}

export const getNFTContract = async (withSigner = false) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = withSigner ? await provider.getSigner() : provider;

  return new ethers.Contract(NFT_ADDRESS, NFTABI.abi, signer);
};

export async function getMarketplaceContract(signer = false) {
  const provider = await getProvider()
  if (signer) {
    const signerObj = await provider.getSigner()
    return new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signerObj)
  }
  return new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
}
