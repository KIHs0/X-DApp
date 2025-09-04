import React, { useCallback, useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Headmotion } from '../uitls/motion.js';
import toast, { Toaster } from 'react-hot-toast';

const Home = ({ setWallet, wallet }) => {
    const [init, setInit] = useState(false);
    const [status, setStatus] = useState(null); // "connecting" | "connected" | null

    const handleClick = async () => {
        setStatus("connecting");
        try {
            if (!window.ethereum) {
                console.log("No web3 provider detected");
                toast.error("No MetaMask detected!");
                setStatus(null);
                return;
            }
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setWallet(accounts[0]);
            setStatus("connected");

            toast.success("Wallet connected!");
        } catch (err) {
            if (err.code === 4001) {
                console.log("User rejected the connection request.");
                toast.error("Connection rejected.");
            } else {
                console.log("Error connecting to MetaMask:", err);
                toast.error("Error connecting wallet.");
            }
            setStatus(null);
        }
    };

    // Particles init
    const callInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    useEffect(() => {
        initParticlesEngine(callInit).then(() => {
            setInit(true);
        });
    }, [callInit]);

    const particlesLoaded = () => { };

    // If wallet connected → go to <X />


    return (
        <AnimatePresence>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="relative min-h-screen w-full overflow-hidden text-white">
                {/* Particles */}
                {init && (
                    <div id="particles-js">
                        <Particles
                            id="tsparticles"
                            particlesLoaded={particlesLoaded}
                            options={{
                                fpsLimit: 120,
                                interactivity: {
                                    events: {
                                        onClick: { enable: true, mode: "push" },
                                        onHover: { enable: true, mode: "repulse" },
                                        resize: true,
                                    },
                                    modes: {
                                        push: { quantity: 4 },
                                        repulse: { distance: 200, duration: 0.4 },
                                    },
                                },
                                particles: {
                                    color: { value: "#FFFF00" },
                                    links: { color: "#FFFFFF", distance: 150, enable: true, opacity: 0, width: 1 },
                                    move: {
                                        direction: "none",
                                        enable: true,
                                        outModes: { default: "bounce" },
                                        speed: 6,
                                    },
                                    number: {
                                        density: { enable: true, area: 800 },
                                        value: 80,
                                    },
                                    opacity: { value: 0.5 },
                                    shape: { type: "circle" },
                                    size: { value: { min: 1, max: 5 } },
                                },
                                detectRetina: true,
                            }}
                            className="absolute top-0 left-0 h-full w-full"
                        />
                    </div>
                )}

                {/* Wallet Modal */}
                {status && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="w-80 h-40 flex items-center justify-center bg-white text-black rounded-2xl shadow-lg text-xl font-semibold">
                            {status === "connecting" && "Connecting..."}
                            {status === "connected" && "Connected ✅"}
                        </div>
                    </div>
                )}

                {/* Header */}
                <header className="relative z-10 flex justify-between items-center px-8 py-6">
                    <h1 className="text-2xl font-bold tracking-wide">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYdXuZIWN75tUhTFOEJOwL0JeL8Y0cjjI38Q&s"
                            className="w-28 h-28 rounded-full border-none outline-none bg-transparent"
                        />
                    </h1>
                    <button
                        className="rounded-2xl px-6 py-2 text-lg shadow-lg bg-sky-400"
                        onClick={handleClick}
                    >
                        Connect Wallet
                    </button>
                </header>

                {/* Hero Section */}
                <main className="relative flex flex-col items-center justify-center text-center px-6 pt-20 z-10">
                    <Motion.h2 {...Headmotion} className="text-4xl md:text-6xl sm:text-3xl font-extrabold mb-6">
                        Welcome to <span className="text-cyan-400">X Contract</span>
                    </Motion.h2>
                    <Motion.p {...Headmotion} className="max-w-2xl text-lg text-gray-300">
                        X is a Solidity smart contract deployed on the Sepolia Testnet.
                        This DApp will allow you to interact with it directly through your browser.
                    </Motion.p>
                </main>

                {/* About Section */}
                <Motion.section
                    {...Headmotion}
                    className="relative z-10 px-8 py-20 max-w-4xl mx-auto"
                >
                    <h3 className="text-3xl font-bold mb-4">About</h3>
                    <p className="text-gray-300 leading-relaxed">
                        The <strong>X Contract</strong> demonstrates Solidity inheritance using OpenZeppelin’s
                        <code> Ownable </code> contract. It’s deployed on the Sepolia Testnet and serves as a
                        foundation for building decentralized applications with access control features.
                    </p>
                </Motion.section>
            </div>
        </AnimatePresence>
    );
};

export default Home;
