import React, { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Search, Home, Bell, Mail, User, Hash } from "lucide-react";
import { Xcontract } from '../../uitls/contract';
import { displayTweets } from "../../uitls/index";
import { addLikeButtonListener } from "../../uitls/index";
const X = ({ wallet, setWallet }) => {
    const [text, settext] = useState('')
    const [res, setres] = useState('')
    const [loader, setLoader] = useState(false)
    const tweetContainerRef = useRef(null)
    useEffect(() => {
        const fetchData = async () => {
            let val = await displayTweets(wallet, tweetContainerRef);
            setres(val)
        };
        fetchData();
    }, [])

    const post = async () => {
        try {
            setLoader(true)
            await Xcontract.methods.Post(text).send({ from: wallet }, (error, transactionHash) => {
                console.log(error, transactionHash);
            })
        }
        catch (error) {
            toast.error("Please Succedd Transaction")
            console.log('transaction err', error)
        } finally {
            settext("")
            setLoader(false)
            const res = await displayTweets(wallet, tweetContainerRef)
            console.log(res)
        }
    }
    const inputtake = (e) => {
        settext(e.target.value)
    }
    const disconnectWallet = async () => {
        try {
            await window.ethereum.request({
                method: "wallet_revokePermissions",
                params: [{ eth_accounts: {} }],
            });
            toast.success('Wallet disconnected')
            setWallet(null);
        } catch (err) {
            console.log("Error disconnecting wallet:", err);
            toast.error('cant disconnect wallet')
        }
    };
    return (
        <div className="bg-black text-white min-h-screen flex">
            <Toaster position="top-right" reverseOrder={false} />
            {/* Left Sidebar */}
            <aside className="w-1/5 border-r border-gray-800 p-4 hidden md:flex flex-col space-y-2 ">
                <h1 className="text-3xl font-bold text-cyan-400">𝕏</h1>
                <nav className="flex flex-col space-y-5 text-lg">
                    <a href="#" className="flex items-center gap-3 hover:text-cyan-400">
                        <Home /> Home
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:text-cyan-400">
                        <Hash /> Explore
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:text-cyan-400">
                        <Bell /> Notifications
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:text-cyan-400">
                        <Mail /> Messages
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:text-cyan-400">
                        <User /> Profile
                    </a>
                </nav>
                <button className="bg-cyan-500 rounded-full py-2 absolute bottom-19 w-40 h-min font-bold hover:bg-cyan-600 transition" onClick={disconnectWallet}>
                    Disconnect Wallet
                </button>
            </aside>

            {/* Main Feed */}
            <main className="w-full md:w-3/5 border-r border-gray-800">
                {/* Post box */}
                <div className="border-b border-gray-800 p-4 flex space-x-3">
                    <img
                        src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${wallet}`}
                        alt="profile"
                        className="rounded-full w-6 h-8"
                    />
                    <textarea
                        value={text}
                        placeholder="What is happening?!"
                        className="bg-transparent w-full resize-none outline-none text-lg placeholder-gray-400"
                        onChange={inputtake}
                    />
                    <button className="bg-cyan-500 rounded-full py-4  bottom-19 w-40 h-min font-bold hover:bg-cyan-600 transition" onClick={post}>
                        {loader ? (<div className="spinner"></div>) : (<h1>Post</h1>)}
                    </button>
                </div>

                {/* Feed posts */}
                <Motion.div
                    ref={tweetContainerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="p-4 border-b border-gray-800 hover:bg-gray-900 transition tweetsContainer"
                >
                    {res && tweets.map(tweet => {
                        <div className="tweet" key={tweet.id}>
                            <img
                                className="user-icon"
                                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${tweet.author}`}
                                alt="User Icon"
                            />
                            <div className="tweet-inner">
                                <div className="author">{shortAddress(tweet.author)}</div>
                                <div className="content">{tweet.content}</div>
                                <button
                                    className="like-button"
                                    onClick={() => handleLike(tweet.id, tweet.author)}
                                    disabled={likeState?.loading}
                                >
                                    {likeState?.loading ? (
                                        <div className="spinner"></div>
                                    ) : (
                                        <>
                                            🤍 <span className="likes-count">{likeState?.likes}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    })}
                </Motion.div>
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:flex w-1/4 flex-col space-y-6 p-4">
                <div className="bg-gray-900 rounded-2xl p-3">
                    <div className="flex items-center bg-gray-800 p-2 rounded-full">
                        <Search className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none ml-2 w-full"
                        />

                    </div>
                </div>
                {/* // right sidebar */}
                <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
                    <h2 className="font-bold text-xl">What’s happening</h2>
                    <p className="text-gray-400">#ReactJS · Trending</p>
                    <p className="text-gray-400">#Ethereum · Trending</p>
                    <p className="text-gray-400">#AI · Trending</p>
                </div>

                <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
                    <h2 className="font-bold text-xl">Who to follow</h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold">Dev Guy</p>
                            <p className="text-gray-400">@devguy</p>
                        </div>
                        <button className="bg-white text-black rounded-full px-3 py-1 text-sm font-bold">
                            Follow
                        </button>
                    </div>
                </div>
            </aside>
        </div >
    );
};

export default X;
