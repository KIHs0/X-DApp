import { Xcontract } from "./contract";
import { address } from "framer-motion/client";
export async function displayTweets(userAddress, tweetContainerRef) {
  const tweetsContainer = tweetContainerRef.current;
  if (!tweetsContainer) {
    return;
  }
  let tempTweets = [];
  tweetsContainer.innerHTML = "";
  try {
    tempTweets = await Xcontract.methods.getAllPost(userAddress).call({
      from: userAddress,
      function(error, transactionHash, result) {
        console.log({ result, transactionHash });
      },
    });
  } catch (error) {
    console.log(error);
  }
  let tweets = [...tempTweets];
  tweets.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
  for (let i = 0; i < tweets.length; i++) {
    const tweetElement = document.createElement("div");
    tweetElement.className = "tweet";

    const userIcon = document.createElement("img");
    userIcon.className = "user-icon";
    userIcon.src = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${tweets[i].author}`;
    userIcon.alt = "User Icon";

    tweetElement.appendChild(userIcon);

    const tweetInner = document.createElement("div");
    tweetInner.className = "tweet-inner";

    tweetInner.innerHTML += `
                <div class="author">${shortAddress(tweets[i].author)}</div>
                <div class="content">${tweets[i].content}</div>
            `;

    const likeButton = document.createElement("button");
    likeButton.className = "like-button";
    likeButton.innerHTML = `
    🤍
                <span class="likes-count">${tweets[i].likes}</span>
            `;
    likeButton.setAttribute("data-id", tweets[i].id);
    likeButton.setAttribute("data-author", tweets[i].author);

    addLikeButtonListener(likeButton, tweets[i].id, tweets[i].author);
    tweetInner.appendChild(likeButton);
    tweetElement.appendChild(tweetInner);
    tweetsContainer.appendChild(tweetElement);
  }
  return tempTweets;
}

function shortAddress(address, startLength = 6, endLength = 4) {
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}
async function likeTweets(id, userAddress) {
  try {
    Xcontract.methods
      .likepost(userAddress, id)
      .send({ from: userAddress }) // your connected wallet
      .on("transactionHash", (hash) => {
        console.log("Tx Hash:", hash);
      })
      .on("receipt", (receipt) => {
        console.log("Tx Receipt:", receipt);
      })
      .on("error", (error) => {
        console.error("Tx Error:", error);
      });
  } catch (err) {
    console.log(`err likifnalsjdfkas post`, err);
  } finally {
  }
}
export function addLikeButtonListener(likeButton, address, id) {
  likeButton.addEventListener("click", async (e) => {
    e.preventDefault();
    e.currentTarget.innerHTML = '<div class="spinner"></div>';
    e.currentTarget.disabled = true;
    try {
      await likeTweets(address, id);
    } catch (error) {
      console.error("Error liking tweet:", error);
    } finally {
    }
  });
}
