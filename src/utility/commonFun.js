import { ethers } from "ethers";

export const getContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contractABI = require("../contract_abi.json");
  const contract = new ethers.Contract(
    process.env.REACT_APP_ADDRESS,
    contractABI,
    signer
  );
  return contract;
};

export const connectWallet = async () => {
  const chainId = process.env.REACT_APP_chainId;
  if (window.ethereum) {
    try {
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      if (parseInt(chain, 16) == chainId) {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Your wallet is connected to the site.",
          };
        } else {
          return {
            address: "",
            status: "😥 Connect your wallet account to the site.",
          };
        }
      } else {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainId }],
        });
        return {
          address: "",
          status: "😥 Connect your wallet account to the site.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            {/* <a target="_blank" href={`https://metamask.io/download.html`}> */}
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.(https://metamask.io/download.html)
            {/* </a> */}
          </p>
        </span>
      ),
    };
  }
};
