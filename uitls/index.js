import { Xcontract } from "./contract";
import { address } from "framer-motion/client";
export async function displayTweets(userAddress, tweetContainerRef) {
  try {
    let tempTweets = await Xcontract.methods.getAllPost(userAddress).call({
      from: userAddress,
      function(error, transactionHash, result) {
        console.log({ result, transactionHash });
      },
    });
    const jstweet = normalizeTweets(tempTweets);
    jstweet.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
    return jstweet;
  } catch (error) {
    console.log(error);
  }
}
function normalizeTweets(rawTweets) {
  return rawTweets.map((tweet) => ({
    id: Number(tweet.id ?? tweet[0]),
    author: tweet.author ?? tweet[1],
    content: tweet.content ?? tweet[2],
    likes: Number(tweet.likes ?? tweet[3]),
    dislikes: Number(tweet.dislikes ?? tweet[4]),
    timestamp: Number(tweet.timestamp ?? tweet[5]),
  }));
}

export function shortAddress(address, startLength = 6, endLength = 4) {
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}
export async function likeTweets(id, userAddress) {
  return new Promise(async (resolve, reject) => {
    try {
      Xcontract.methods
        .likepost(userAddress, id)
        .send({ from: userAddress }) // connected wallet
        .on("transactionHash", (hash) => {
          console.log("Tx Hash:", hash);
        })
        .on("receipt", (receipt) => {
          resolve(receipt);
        })
        .on("error", (error) => {
          reject(error);
        });
    } catch (err) {
      console.log(`err likifnalsjdfkas post`, err);
    } finally {
    }
  });
}
