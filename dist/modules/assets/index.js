define("@pageblock-dapp-container/assets", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_1.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        logo: fullPath('img/sc-logo.png'),
        img: {
            network: {
                bsc: fullPath('img/network/bsc.svg'),
                eth: fullPath('img/network/eth.svg'),
                amio: fullPath('img/network/amio.svg'),
                avax: fullPath('img/network/avax.svg'),
                ftm: fullPath('img/network/ftm.svg'),
                polygon: fullPath('img/network/polygon.svg'),
            },
            wallet: {
                metamask: fullPath('img/wallet/metamask.png'),
                trustwallet: fullPath('img/wallet/trustwallet.svg'),
                binanceChainWallet: fullPath('img/wallet/binance-chain-wallet.svg'),
                walletconnect: fullPath('img/wallet/walletconnect.svg')
            }
        },
        fullPath
    };
});
