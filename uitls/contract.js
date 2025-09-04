import Web3 from "web3";
import contractabi from "../xcontractabi.json";
const CONTRACT_ADDRESS = "0xA514B0049ae5F0546b4658438bC280016B677D23";
const Xabi = contractabi.output.contracts["contracts/_X.sol"].X.abi;
let web3 = new Web3(window.ethereum);
export const Xcontract = new web3.eth.Contract(Xabi, CONTRACT_ADDRESS);
