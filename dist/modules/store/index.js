define("@pageblock-dapp-container/store/walletList.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.walletList = void 0;
    exports.walletList = [
        {
            name: eth_wallet_1.WalletPlugin.MetaMask,
            displayName: 'MetaMask',
            img: 'metamask'
        },
        {
            name: eth_wallet_1.WalletPlugin.TrustWallet,
            displayName: 'Trust Wallet',
            img: 'trustwallet'
        },
        {
            name: eth_wallet_1.WalletPlugin.BinanceChainWallet,
            displayName: 'Binance Chain Wallet',
            img: 'binanceChainWallet'
        },
        {
            name: eth_wallet_1.WalletPlugin.WalletConnect,
            displayName: 'WalletConnect',
            iconFile: 'walletconnect'
        }
    ];
});
define("@pageblock-dapp-container/store", ["require", "exports", "@ijstech/components", "@pageblock-dapp-container/store/walletList.ts", "@ijstech/eth-wallet"], function (require, exports, components_1, walletList_1, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEnv = exports.getInfuraId = exports.isValidEnv = exports.getSiteSupportedNetworks = exports.getDefaultChainId = exports.getNetworkType = exports.viewOnExplorerByAddress = exports.viewOnExplorerByTxHash = exports.getNetworkList = exports.getNetworkInfo = exports.updateStore = exports.getErc20 = exports.getWalletProvider = exports.getWallet = exports.getChainId = exports.registerSendTxEvents = exports.getSupportedWallets = exports.truncateAddress = exports.hasMetaMask = exports.hasWallet = exports.logoutWallet = exports.switchNetwork = exports.connectWallet = exports.isWalletConnected = void 0;
    ;
    ;
    function isWalletConnected() {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isWalletConnected = isWalletConnected;
    async function connectWallet(walletPlugin, eventHandlers) {
        let wallet = eth_wallet_2.Wallet.getClientInstance();
        const walletOptions = '';
        let providerOptions = walletOptions[walletPlugin];
        // if (!wallet.chainId) {
        //   wallet.chainId = getDefaultChainId();
        // }
        await wallet.connect(walletPlugin, {
            onAccountChanged: (account) => {
                var _a, _b;
                if (eventHandlers && eventHandlers.accountsChanged) {
                    eventHandlers.accountsChanged(account);
                }
                const connected = !!account;
                if (connected) {
                    localStorage.setItem('walletProvider', ((_b = (_a = eth_wallet_2.Wallet.getClientInstance()) === null || _a === void 0 ? void 0 : _a.clientSideProvider) === null || _b === void 0 ? void 0 : _b.walletPlugin) || '');
                }
                components_1.application.EventBus.dispatch("isWalletConnected" /* IsWalletConnected */, connected);
            },
            onChainChanged: (chainIdHex) => {
                const chainId = Number(chainIdHex);
                if (eventHandlers && eventHandlers.chainChanged) {
                    eventHandlers.chainChanged(chainId);
                }
                components_1.application.EventBus.dispatch("chainChanged" /* chainChanged */, chainId);
            }
        }, providerOptions);
        return wallet;
    }
    exports.connectWallet = connectWallet;
    async function switchNetwork(chainId) {
        var _a;
        if (!isWalletConnected()) {
            components_1.application.EventBus.dispatch("chainChanged" /* chainChanged */, chainId);
            return;
        }
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        if (((_a = wallet === null || wallet === void 0 ? void 0 : wallet.clientSideProvider) === null || _a === void 0 ? void 0 : _a.walletPlugin) === eth_wallet_2.WalletPlugin.MetaMask) {
            await wallet.switchNetwork(chainId);
        }
    }
    exports.switchNetwork = switchNetwork;
    async function logoutWallet() {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        await wallet.disconnect();
        localStorage.setItem('walletProvider', '');
        components_1.application.EventBus.dispatch("IsWalletDisconnected" /* IsWalletDisconnected */, false);
    }
    exports.logoutWallet = logoutWallet;
    const hasWallet = function () {
        let hasWallet = false;
        for (let wallet of walletList_1.walletList) {
            if (eth_wallet_2.Wallet.isInstalled(wallet.name)) {
                hasWallet = true;
                break;
            }
        }
        return hasWallet;
    };
    exports.hasWallet = hasWallet;
    const hasMetaMask = function () {
        return eth_wallet_2.Wallet.isInstalled(eth_wallet_2.WalletPlugin.MetaMask);
    };
    exports.hasMetaMask = hasMetaMask;
    const truncateAddress = (address) => {
        if (address === undefined || address === null)
            return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
    };
    exports.truncateAddress = truncateAddress;
    const getSupportedWallets = () => {
        return state.wallets;
    };
    exports.getSupportedWallets = getSupportedWallets;
    ;
    const networks = [
        {
            name: "Ethereum",
            chainId: 1,
            img: "eth",
            rpc: "https://mainnet.infura.io/v3/{InfuraId}",
            symbol: "ETH",
            env: "mainnet",
            explorerName: "Etherscan",
            explorerTxUrl: "https://etherscan.io/tx/",
            explorerAddressUrl: "https://etherscan.io/address/"
        },
        {
            name: "Kovan Test Network",
            chainId: 42,
            img: "eth",
            rpc: "https://kovan.infura.io/v3/{InfuraId}",
            symbol: "ETH",
            env: "testnet",
            explorerName: "Etherscan",
            explorerTxUrl: "https://kovan.etherscan.io/tx/",
            explorerAddressUrl: "https://kovan.etherscan.io/address/"
        },
        {
            name: "Binance Smart Chain",
            chainId: 56,
            img: "bsc",
            rpc: "https://bsc-dataseed.binance.org/",
            symbol: "BNB",
            env: "mainnet",
            explorerName: "BSCScan",
            explorerTxUrl: "https://bscscan.com/tx/",
            explorerAddressUrl: "https://bscscan.com/address/"
        },
        {
            name: "Polygon",
            chainId: 137,
            img: "polygon",
            symbol: "MATIC",
            env: "mainnet",
            explorerName: "PolygonScan",
            explorerTxUrl: "https://polygonscan.com/tx/",
            explorerAddressUrl: "https://polygonscan.com/address/"
        },
        {
            name: "Fantom Opera",
            chainId: 250,
            img: "ftm",
            rpc: "https://rpc.ftm.tools/",
            symbol: "FTM",
            env: "mainnet",
            explorerName: "FTMScan",
            explorerTxUrl: "https://ftmscan.com/tx/",
            explorerAddressUrl: "https://ftmscan.com/address/"
        },
        {
            name: "BSC Testnet",
            chainId: 97,
            img: "bsc",
            rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            symbol: "BNB",
            env: "testnet",
            explorerName: "BSCScan",
            explorerTxUrl: "https://testnet.bscscan.com/tx/",
            explorerAddressUrl: "https://testnet.bscscan.com/address/"
        },
        {
            name: "Amino Testnet",
            chainId: 31337,
            img: "amio",
            symbol: "ACT",
            env: "testnet"
        },
        {
            name: "Avalanche FUJI C-Chain",
            chainId: 43113,
            img: "avax",
            rpc: "https://api.avax-test.network/ext/bc/C/rpc",
            symbol: "AVAX",
            env: "testnet",
            explorerName: "SnowTrace",
            explorerTxUrl: "https://testnet.snowtrace.io/tx/",
            explorerAddressUrl: "https://testnet.snowtrace.io/address/"
        },
        {
            name: "Mumbai",
            chainId: 80001,
            img: "polygon",
            rpc: "https://matic-mumbai.chainstacklabs.com",
            symbol: "MATIC",
            env: "testnet",
            explorerName: "PolygonScan",
            explorerTxUrl: "https://mumbai.polygonscan.com/tx/",
            explorerAddressUrl: "https://mumbai.polygonscan.com/address/"
        },
        {
            name: "Fantom Testnet",
            chainId: 4002,
            img: "ftm",
            rpc: "https://rpc.testnet.fantom.network/",
            symbol: "FTM",
            env: "testnet",
            explorerName: "FTMScan",
            explorerTxUrl: "https://testnet.ftmscan.com/tx/",
            explorerAddressUrl: "https://testnet.ftmscan.com/address/"
        },
        {
            name: "AminoX Testnet",
            chainId: 13370,
            img: "amio",
            symbol: "ACT",
            env: "testnet",
            explorerName: "AminoX Explorer",
            explorerTxUrl: "https://aminoxtestnet.blockscout.alphacarbon.network/tx/",
            explorerAddressUrl: "https://aminoxtestnet.blockscout.alphacarbon.network/address/"
        }
    ];
    function registerSendTxEvents(sendTxEventHandlers) {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            },
        });
    }
    exports.registerSendTxEvents = registerSendTxEvents;
    ;
    function getChainId() {
        return eth_wallet_2.Wallet.getInstance().chainId;
    }
    exports.getChainId = getChainId;
    ;
    function getWallet() {
        return eth_wallet_2.Wallet.getInstance();
    }
    exports.getWallet = getWallet;
    ;
    function getWalletProvider() {
        return localStorage.getItem('walletProvider') || '';
    }
    exports.getWalletProvider = getWalletProvider;
    ;
    function getErc20(address) {
        const wallet = getWallet();
        return new eth_wallet_2.Erc20(wallet, address);
    }
    exports.getErc20 = getErc20;
    ;
    const state = {
        networkMap: {},
        defaultChainId: 0,
        infuraId: "",
        env: "",
        wallets: []
    };
    const updateStore = (data) => {
        setNetworkList(data.networks);
        setWalletList(data.wallets);
    };
    exports.updateStore = updateStore;
    const setWalletList = (wallets) => {
        state.wallets = walletList_1.walletList.filter(v => wallets.includes(v.name));
    };
    const setNetworkList = (chainIds, infuraId) => {
        state.networkMap = {};
        const networkList = networks.filter(v => chainIds.includes(v.chainId));
        networkList.forEach(network => {
            const rpc = infuraId && network.rpc ? network.rpc.replace(/{InfuraId}/g, infuraId) : network.rpc;
            state.networkMap[network.chainId] = Object.assign(Object.assign({}, network), { isDisabled: true, rpc });
        });
        if (Array.isArray(networkList)) {
            for (let network of networkList) {
                if (infuraId && network.rpc) {
                    network.rpc = network.rpc.replace(/{InfuraId}/g, infuraId);
                }
                Object.assign(state.networkMap[network.chainId], Object.assign({ isDisabled: false }, network));
            }
        }
    };
    const getNetworkInfo = (chainId) => {
        return state.networkMap[chainId];
    };
    exports.getNetworkInfo = getNetworkInfo;
    const getNetworkList = () => {
        return Object.values(state.networkMap);
    };
    exports.getNetworkList = getNetworkList;
    const viewOnExplorerByTxHash = (chainId, txHash) => {
        let network = exports.getNetworkInfo(chainId);
        if (network && network.explorerTxUrl) {
            let url = `${network.explorerTxUrl}${txHash}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByTxHash = viewOnExplorerByTxHash;
    const viewOnExplorerByAddress = (chainId, address) => {
        let network = exports.getNetworkInfo(chainId);
        if (network && network.explorerAddressUrl) {
            let url = `${network.explorerAddressUrl}${address}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByAddress = viewOnExplorerByAddress;
    const getNetworkType = (chainId) => {
        var _a;
        let network = exports.getNetworkInfo(chainId);
        return (_a = network === null || network === void 0 ? void 0 : network.explorerName) !== null && _a !== void 0 ? _a : 'Unknown';
    };
    exports.getNetworkType = getNetworkType;
    const setDefaultChainId = (chainId) => {
        state.defaultChainId = chainId;
    };
    const getDefaultChainId = () => {
        return state.defaultChainId;
    };
    exports.getDefaultChainId = getDefaultChainId;
    const getSiteSupportedNetworks = () => {
        let networkFullList = Object.values(state.networkMap);
        let list = networkFullList.filter(network => !network.isDisabled && exports.isValidEnv(network.env));
        return list;
    };
    exports.getSiteSupportedNetworks = getSiteSupportedNetworks;
    const isValidEnv = (env) => {
        const _env = state.env === 'testnet' || state.env === 'mainnet' ? state.env : "";
        return !_env || !env || env === _env;
    };
    exports.isValidEnv = isValidEnv;
    const setInfuraId = (infuraId) => {
        state.infuraId = infuraId;
    };
    const getInfuraId = () => {
        return state.infuraId;
    };
    exports.getInfuraId = getInfuraId;
    const setEnv = (env) => {
        state.env = env;
    };
    const getEnv = () => {
        return state.env;
    };
    exports.getEnv = getEnv;
});
