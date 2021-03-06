import Web3 from "web3";
import { ARTTOKENADDRESS, ARTTOKENABI } from '../artTokenConfig';

const Moralis = require('moralis');

export const getArtTokenContract = () => async (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || "http:localhost:8545");
    const accounts = await web3.eth.getAccounts();
    const contractInstance = new web3.eth.Contract(ARTTOKENABI, ARTTOKENADDRESS, { from: accounts[0] });

    dispatch({
        type: "GET_CONTRACTDATA",
        contractInstance: contractInstance,
        accounts: accounts
    });
}

export const mint = (hash, url, name) => async (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || "http:localhost:8545");
    const accounts = await web3.eth.getAccounts();
    const contractInstance = new web3.eth.Contract(ARTTOKENABI, ARTTOKENADDRESS, { from: accounts[0] });

    console.log(name);

    contractInstance.methods
        .mint(url)
        .send()
        .on(("transactionHash"), (hash) => {
            console.log(hash);
        })
        .on(("receipt"), (receipt) => {
            const tokenId = receipt.events.Transfer.returnValues[2];
            console.log(tokenId);
            const nft = new Moralis.Object('Nft');
            nft.set('TokenId', tokenId);
            nft.set('Account', accounts[0]);
            nft.set('IpfsHash', hash);
            nft.set('IpfsUrl', url);
            nft.set('Name', name);
            nft.save();

            dispatch({
                type: "IPFS_CLEAR",
            })
        });
}

export const updateIsSell = (objectId) => async (dispatch) => {
    const Nft = new Moralis.Object.extend("Nft");
    const query = new Moralis.Query(Nft);
    query.get(objectId)
        .then((result) => {
            result.set("IsSelled", true);
            result.save();
        }, (error) => {
            console.log("Error occured", error);
        })

    dispatch({
        type: "CLOSE_MODAL",
        title: "", 
        functionType: "",
    });
}

export const getToken = (tokenId) => async (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || "http:localhost:8545");
    const accounts = await web3.eth.getAccounts();
    const contractInstance = new web3.eth.Contract(ARTTOKENABI, ARTTOKENADDRESS, { from: accounts[0] });

    contractInstance.methods
        .getTokenDetail(tokenId)
        .call()
        .then((res) => {
            console.log(res);
        })
}

