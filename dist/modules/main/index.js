var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@pageblock-dapp-container/main/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_1.Styles.Theme.ThemeVars;
    const spin = components_1.Styles.keyframes({
        "to": {
            "-webkit-transform": "rotate(360deg)"
        }
    });
    exports.default = components_1.Styles.style({
        $nest: {
            '.spinner': {
                display: "inline-block",
                width: "50px",
                height: "50px",
                border: "3px solid rgba(255,255,255,.3)",
                borderRadius: "50%",
                borderTopColor: Theme.colors.primary.main,
                "animation": `${spin} 1s ease-in-out infinite`,
                "-webkit-animation": `${spin} 1s ease-in-out infinite`
            }
        }
    });
});
define("@pageblock-dapp-container/main/body.tsx", ["require", "exports", "@ijstech/components", "@pageblock-dapp-container/interface", "@pageblock-dapp-container/utils"], function (require, exports, components_2, interface_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DappContainerBody = void 0;
    let DappContainerBody = class DappContainerBody extends components_2.Module {
        constructor() {
            super(...arguments);
            this.isLoading = false;
        }
        clear() {
            this.pnlModule.clearInnerHTML();
            this.module = null;
        }
        getModule() {
            return this.module;
        }
        async setData(data) {
            if (this.isLoading)
                return;
            this.isLoading = true;
            if (data.content && data.content.module) {
                this.clear();
                this.module = await this.loadModule(data.content.module);
                if (this.module) {
                    await this.module.setData(data.content.properties);
                    if (data.content.tag) {
                        this.module.setTag(data.content.tag);
                        components_2.application.EventBus.dispatch(interface_1.EVENT.UPDATE_TAG, data.content.tag);
                    }
                }
            }
            this.isLoading = false;
        }
        setTag(data) {
            if (this.module)
                this.module.setTag(data);
        }
        async loadModule(moduleData) {
            this.clear();
            let module = await utils_1.getModule(moduleData);
            if (module) {
                this.pnlModule.append(module);
            }
            return module;
        }
        render() {
            return (this.$render("i-panel", { id: "pnlModule" }));
        }
    };
    DappContainerBody = __decorate([
        components_2.customElements('dapp-container-body')
    ], DappContainerBody);
    exports.DappContainerBody = DappContainerBody;
});
define("@pageblock-dapp-container/main/header.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    exports.default = components_3.Styles.style({
        zIndex: 2,
        $nest: {
            '::-webkit-scrollbar-track': {
                borderRadius: '12px',
                border: '1px solid transparent',
                backgroundColor: 'unset'
            },
            '::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: 'unset'
            },
            '::-webkit-scrollbar-thumb': {
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2) 0% 0% no-repeat padding-box'
            },
            '.os-modal': {
                boxSizing: 'border-box',
                $nest: {
                    '.i-modal_header': {
                        borderRadius: '10px 10px 0 0',
                        background: 'unset',
                        borderBottom: `2px solid ${Theme.divider}`,
                        padding: '1rem',
                        fontWeight: 700,
                        fontSize: '1rem'
                    },
                    '.list-view': {
                        $nest: {
                            '.list-item:hover': {
                                $nest: {
                                    '> *': {
                                        opacity: 1
                                    }
                                }
                            },
                            '.list-item': {
                                cursor: 'pointer',
                                transition: 'all .3s ease-in',
                                $nest: {
                                    '&.disabled-network-selection': {
                                        cursor: 'default',
                                        $nest: {
                                            '&:hover > *': {
                                                opacity: '0.5 !important',
                                            }
                                        }
                                    },
                                    '> *': {
                                        opacity: .5
                                    }
                                }
                            },
                            '.list-item.is-actived': {
                                $nest: {
                                    '> *': {
                                        opacity: 1
                                    },
                                    '&:after': {
                                        content: "''",
                                        top: '50%',
                                        left: 12,
                                        position: 'absolute',
                                        background: '#20bf55',
                                        borderRadius: '50%',
                                        width: 10,
                                        height: 10,
                                        transform: 'translate3d(-50%,-50%,0)'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '.header-logo > img': {
                maxHeight: 'unset',
                maxWidth: 'unset'
            },
            '.wallet-modal > div': {
                boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 0px, rgb(0 0 0 / 10%) 0px 0px 1px 0px'
            },
            '.wallet-modal .modal': {
                minWidth: 200
            }
        }
    });
});
define("@pageblock-dapp-container/main/header.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@pageblock-dapp-container/utils", "@pageblock-dapp-container/main/header.css.ts", "@pageblock-dapp-container/assets", "@pageblock-dapp-container/store"], function (require, exports, components_4, eth_wallet_1, utils_2, header_css_1, assets_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DappContainerHeader = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let DappContainerHeader = class DappContainerHeader extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.supportedNetworks = [];
            this.walletInfo = {
                address: '',
                balance: '',
                networkId: 0
            };
            this.onChainChanged = async (chainId) => {
                this.walletInfo.networkId = chainId;
                this.selectedNetwork = store_1.getNetworkInfo(chainId);
                let wallet = eth_wallet_1.Wallet.getClientInstance();
                const isConnected = wallet.isConnected;
                this.walletInfo.balance = isConnected ? utils_2.formatNumber((await wallet.balance).toFixed(), 2) : '0';
                this.updateConnectedStatus(isConnected);
                this.updateList(isConnected);
            };
            this.updateConnectedStatus = (isConnected) => {
                var _a, _b, _c;
                if (isConnected) {
                    this.lblBalance.caption = `${this.walletInfo.balance} ${this.symbol}`;
                    this.btnWalletDetail.caption = this.shortlyAddress;
                    this.lblWalletAddress.caption = this.shortlyAddress;
                    const networkInfo = store_1.getNetworkInfo(eth_wallet_1.Wallet.getInstance().chainId);
                    this.hsViewAccount.visible = !!(networkInfo === null || networkInfo === void 0 ? void 0 : networkInfo.explorerAddressUrl);
                }
                else {
                    this.hsViewAccount.visible = false;
                }
                const isSupportedNetwork = this.selectedNetwork && this.supportedNetworks.findIndex(network => network === this.selectedNetwork) !== -1;
                if (isSupportedNetwork) {
                    const img = ((_a = this.selectedNetwork) === null || _a === void 0 ? void 0 : _a.img) ? assets_1.default.img.network[this.selectedNetwork.img] || components_4.application.assets(this.selectedNetwork.img) : undefined;
                    this.btnNetwork.icon = img ? this.$render("i-icon", { width: 26, height: 26, image: { url: img } }) : undefined;
                    this.btnNetwork.caption = (_c = (_b = this.selectedNetwork) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "";
                }
                else {
                    this.btnNetwork.icon = undefined;
                    this.btnNetwork.caption = "Unsupported Network";
                }
                this.btnConnectWallet.visible = !isConnected;
                this.hsBalance.visible = isConnected;
                this.pnlWalletDetail.visible = isConnected;
            };
            this.openConnectModal = () => {
                this.mdConnect.title = "Connect wallet";
                this.mdConnect.visible = true;
            };
            this.openNetworkModal = () => {
                this.mdNetwork.visible = true;
            };
            this.openWalletDetailModal = () => {
                this.mdWalletDetail.visible = true;
            };
            this.openAccountModal = (target, event) => {
                event.stopPropagation();
                this.mdWalletDetail.visible = false;
                this.mdAccount.visible = true;
            };
            this.openSwitchModal = (target, event) => {
                event.stopPropagation();
                this.mdWalletDetail.visible = false;
                this.mdConnect.title = "Switch wallet";
                this.mdConnect.visible = true;
            };
            this.logout = async (target, event) => {
                event.stopPropagation();
                this.mdWalletDetail.visible = false;
                await store_1.logoutWallet();
                this.updateConnectedStatus(false);
                this.updateList(false);
                this.mdAccount.visible = false;
            };
            this.connectToProviderFunc = async (walletPlugin) => {
                if (eth_wallet_1.Wallet.isInstalled(walletPlugin)) {
                    await store_1.connectWallet(walletPlugin);
                }
                else {
                    let config = eth_wallet_1.WalletPluginConfig[walletPlugin];
                    let homepage = config && config.homepage ? config.homepage() : '';
                    window.open(homepage, '_blank');
                }
                this.mdConnect.visible = false;
            };
            this.copyWalletAddress = () => {
                components_4.application.copyToClipboard(this.walletInfo.address || "");
            };
            this.renderWalletList = () => {
                this.gridWalletList.clearInnerHTML();
                this.walletMapper = new Map();
                const walletList = store_1.getSupportedWallets();
                walletList.forEach((wallet) => {
                    const isActive = this.isWalletActive(wallet.name);
                    if (isActive)
                        this.currActiveWallet = wallet.name;
                    const hsWallet = (this.$render("i-hstack", { class: isActive ? 'is-actived list-item' : 'list-item', verticalAlignment: 'center', gap: 12, background: { color: Theme.colors.secondary.light }, border: { radius: 10 }, position: "relative", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, horizontalAlignment: "space-between", onClick: () => this.connectToProviderFunc(wallet.name) },
                        this.$render("i-label", { caption: wallet.displayName, margin: { left: '1rem' }, wordBreak: "break-word", font: { size: '.875rem', bold: true, color: Theme.colors.secondary.contrastText } }),
                        this.$render("i-image", { width: 34, height: "auto", url: assets_1.default.img.wallet[wallet.img] || components_4.application.assets(wallet.img) })));
                    this.walletMapper.set(wallet.name, hsWallet);
                    this.gridWalletList.append(hsWallet);
                });
            };
            this.$eventBus = components_4.application.EventBus;
            this.registerEvent();
        }
        ;
        get symbol() {
            var _a, _b, _c;
            let symbol = '';
            if (((_a = this.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId) && ((_b = this.selectedNetwork) === null || _b === void 0 ? void 0 : _b.symbol)) {
                symbol = (_c = this.selectedNetwork) === null || _c === void 0 ? void 0 : _c.symbol;
            }
            return symbol;
        }
        get shortlyAddress() {
            const address = this.walletInfo.address;
            if (!address)
                return 'No address selected';
            return store_1.truncateAddress(address);
        }
        registerEvent() {
            let wallet = eth_wallet_1.Wallet.getInstance();
            this.$eventBus.register(this, "connectWallet" /* ConnectWallet */, this.openConnectModal);
            this.$eventBus.register(this, "isWalletConnected" /* IsWalletConnected */, async (connected) => {
                if (connected) {
                    this.walletInfo.address = wallet.address;
                    this.walletInfo.balance = utils_2.formatNumber((await wallet.balance).toFixed(), 2);
                    this.walletInfo.networkId = wallet.chainId;
                }
                this.selectedNetwork = store_1.getNetworkInfo(wallet.chainId);
                this.updateConnectedStatus(connected);
                this.updateList(connected);
            });
            this.$eventBus.register(this, "IsWalletDisconnected" /* IsWalletDisconnected */, async (connected) => {
                this.selectedNetwork = store_1.getNetworkInfo(wallet.chainId);
                this.updateConnectedStatus(connected);
                this.updateList(connected);
            });
            this.$eventBus.register(this, "chainChanged" /* chainChanged */, async (chainId) => {
                this.onChainChanged(chainId);
            });
        }
        init() {
            this.classList.add(header_css_1.default);
            this.selectedNetwork = store_1.getNetworkInfo(store_1.getDefaultChainId());
            super.init();
            this.reloadWalletsAndNetworks();
            this.initData();
        }
        reloadWalletsAndNetworks() {
            this.renderWalletList();
            this.renderNetworks();
            this.updateConnectedStatus(store_1.isWalletConnected());
        }
        updateDot(connected, type) {
            var _a, _b, _c;
            const wallet = eth_wallet_1.Wallet.getClientInstance();
            if (type === 'network') {
                if (this.currActiveNetworkId !== undefined && this.currActiveNetworkId !== null && this.networkMapper.has(this.currActiveNetworkId)) {
                    this.networkMapper.get(this.currActiveNetworkId).classList.remove('is-actived');
                }
                if (connected && this.networkMapper.has(wallet.chainId)) {
                    this.networkMapper.get(wallet.chainId).classList.add('is-actived');
                }
                this.currActiveNetworkId = wallet.chainId;
            }
            else {
                if (this.currActiveWallet && this.walletMapper.has(this.currActiveWallet)) {
                    this.walletMapper.get(this.currActiveWallet).classList.remove('is-actived');
                }
                if (connected && this.walletMapper.has((_a = wallet.clientSideProvider) === null || _a === void 0 ? void 0 : _a.walletPlugin)) {
                    this.walletMapper.get((_b = wallet.clientSideProvider) === null || _b === void 0 ? void 0 : _b.walletPlugin).classList.add('is-actived');
                }
                this.currActiveWallet = (_c = wallet.clientSideProvider) === null || _c === void 0 ? void 0 : _c.walletPlugin;
            }
        }
        updateList(isConnected) {
            if (isConnected && store_1.getWalletProvider() !== eth_wallet_1.WalletPlugin.MetaMask) {
                this.lblNetworkDesc.caption = "We support the following networks, please switch network in the connected wallet.";
            }
            else {
                this.lblNetworkDesc.caption = "We support the following networks, please click to connect.";
            }
            this.updateDot(isConnected, 'wallet');
            this.updateDot(isConnected, 'network');
        }
        viewOnExplorerByAddress() {
            store_1.viewOnExplorerByAddress(eth_wallet_1.Wallet.getInstance().chainId, this.walletInfo.address);
        }
        async switchNetwork(chainId) {
            if (!chainId)
                return;
            await store_1.switchNetwork(chainId);
            this.mdNetwork.visible = false;
        }
        isWalletActive(walletPlugin) {
            var _a;
            const provider = walletPlugin.toLowerCase();
            return eth_wallet_1.Wallet.isInstalled(walletPlugin) && ((_a = eth_wallet_1.Wallet.getClientInstance().clientSideProvider) === null || _a === void 0 ? void 0 : _a.walletPlugin) === provider;
        }
        isNetworkActive(chainId) {
            return eth_wallet_1.Wallet.getInstance().chainId === chainId;
        }
        renderNetworks() {
            this.gridNetworkGroup.clearInnerHTML();
            this.networkMapper = new Map();
            this.supportedNetworks = store_1.getSiteSupportedNetworks();
            this.gridNetworkGroup.append(...this.supportedNetworks.map((network) => {
                const img = network.img ? this.$render("i-image", { url: assets_1.default.img.network[network.img] || components_4.application.assets(network.img), width: 34, height: 34 }) : [];
                const isActive = this.isNetworkActive(network.chainId);
                if (isActive)
                    this.currActiveNetworkId = network.chainId;
                const hsNetwork = (this.$render("i-hstack", { onClick: () => this.switchNetwork(network.chainId), background: { color: Theme.colors.secondary.light }, border: { radius: 10 }, position: "relative", class: isActive ? 'is-actived list-item' : 'list-item', padding: { top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' } },
                    this.$render("i-hstack", { margin: { left: '1rem' }, verticalAlignment: "center", gap: 12 },
                        img,
                        this.$render("i-label", { caption: network.name, wordBreak: "break-word", font: { size: '.875rem', bold: true, color: Theme.colors.secondary.contrastText } }))));
                this.networkMapper.set(network.chainId, hsNetwork);
                return hsNetwork;
            }));
        }
        async initData() {
            let accountsChangedEventHandler = async (account) => {
            };
            let chainChangedEventHandler = async (hexChainId) => {
                this.updateConnectedStatus(true);
            };
            const selectedProvider = localStorage.getItem('walletProvider');
            const isValidProvider = Object.values(eth_wallet_1.WalletPlugin).includes(selectedProvider);
            if (store_1.hasWallet() && isValidProvider) {
                await store_1.connectWallet(selectedProvider, {
                    'accountsChanged': accountsChangedEventHandler,
                    'chainChanged': chainChangedEventHandler
                });
            }
        }
        render() {
            return (this.$render("i-panel", { padding: { top: '1.188rem', bottom: '0.5rem', left: '5.25rem', right: '5.25rem' } },
                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'end' },
                    this.$render("i-panel", null,
                        this.$render("i-button", { id: "btnNetwork", height: 38, margin: { right: '0.5rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { radius: 5 }, font: { color: Theme.colors.primary.contrastText }, onClick: this.openNetworkModal, caption: "Unsupported Network" })),
                    this.$render("i-hstack", { id: "hsBalance", height: 38, visible: false, horizontalAlignment: "center", verticalAlignment: "center", background: { color: Theme.colors.primary.main }, border: { radius: 5 }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' } },
                        this.$render("i-label", { id: "lblBalance", font: { color: Theme.colors.primary.contrastText } })),
                    this.$render("i-panel", { id: "pnlWalletDetail", visible: false },
                        this.$render("i-button", { id: "btnWalletDetail", height: 38, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, margin: { left: '0.5rem' }, border: { radius: 5 }, font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, onClick: this.openWalletDetailModal }),
                        this.$render("i-modal", { id: "mdWalletDetail", class: "wallet-modal", height: "auto", maxWidth: 200, showBackdrop: false, popupPlacement: "bottomRight" },
                            this.$render("i-vstack", { gap: 15, padding: { top: 10, left: 10, right: 10, bottom: 10 } },
                                this.$render("i-button", { caption: "Account", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.openAccountModal }),
                                this.$render("i-button", { caption: "Switch wallet", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.openSwitchModal }),
                                this.$render("i-button", { caption: "Logout", width: "100%", height: "auto", border: { radius: 5 }, font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: '0.5rem', bottom: '0.5rem' }, onClick: this.logout })))),
                    this.$render("i-button", { id: "btnConnectWallet", height: 38, caption: "Connect Wallet", border: { radius: 5 }, font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, onClick: this.openConnectModal })),
                this.$render("i-modal", { id: 'mdNetwork', title: 'Supported Network', class: 'os-modal', width: 440, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { height: '100%', lineHeight: 1.5, padding: { left: '1rem', right: '1rem', bottom: '2rem' } },
                        this.$render("i-label", { id: 'lblNetworkDesc', margin: { top: '1rem' }, font: { size: '.875rem' }, wordBreak: "break-word", caption: 'We support the following networks, please click to connect.' }),
                        this.$render("i-hstack", { margin: { left: '-1.25rem', right: '-1.25rem' }, height: '100%' },
                            this.$render("i-grid-layout", { id: 'gridNetworkGroup', font: { color: '#f05e61' }, height: "calc(100% - 160px)", width: "100%", overflow: { y: 'auto' }, margin: { top: '1.5rem' }, padding: { left: '1.25rem', right: '1.25rem' }, columnsPerRow: 1, templateRows: ['max-content'], class: 'list-view', gap: { row: '0.5rem' } })))),
                this.$render("i-modal", { id: 'mdConnect', title: 'Connect Wallet', class: 'os-modal', width: 440, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { padding: { left: '1rem', right: '1rem', bottom: '2rem' }, lineHeight: 1.5 },
                        this.$render("i-label", { font: { size: '.875rem' }, caption: 'Recommended wallet for Chrome', margin: { top: '1rem' }, wordBreak: "break-word" }),
                        this.$render("i-panel", null,
                            this.$render("i-grid-layout", { id: 'gridWalletList', class: 'list-view', margin: { top: '0.5rem' }, columnsPerRow: 1, templateRows: ['max-content'], gap: { row: 8 } })))),
                this.$render("i-modal", { id: 'mdAccount', title: 'Account', class: 'os-modal', width: 440, height: 200, closeIcon: { name: 'times' }, border: { radius: 10 } },
                    this.$render("i-vstack", { width: "100%", padding: { top: "1.75rem", bottom: "1rem", left: "2.75rem", right: "2.75rem" }, gap: 5 },
                        this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: 'center' },
                            this.$render("i-label", { font: { size: '0.875rem' }, caption: 'Connected with' }),
                            this.$render("i-button", { caption: 'Logout', font: { color: Theme.colors.error.contrastText }, background: { color: Theme.colors.error.light }, padding: { top: 6, bottom: 6, left: 10, right: 10 }, border: { radius: 5 }, onClick: this.logout })),
                        this.$render("i-label", { id: "lblWalletAddress", font: { size: '1.25rem', bold: true, color: Theme.colors.primary.main }, lineHeight: 1.5 }),
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "2.5rem" },
                            this.$render("i-hstack", { class: "pointer", verticalAlignment: "center", tooltip: { content: `The address has been copied`, trigger: 'click' }, gap: "0.5rem", onClick: this.copyWalletAddress },
                                this.$render("i-icon", { name: "copy", width: "16px", height: "16px", fill: Theme.text.secondary }),
                                this.$render("i-label", { caption: "Copy Address", font: { size: "0.875rem", bold: true } })),
                            this.$render("i-hstack", { id: "hsViewAccount", class: "pointer", verticalAlignment: "center", onClick: this.viewOnExplorerByAddress.bind(this) },
                                this.$render("i-icon", { name: "external-link-alt", width: "16", height: "16", fill: Theme.text.secondary, display: "inline-block" }),
                                this.$render("i-label", { caption: "View on Explorer", margin: { left: "0.5rem" }, font: { size: "0.875rem", bold: true } })))))));
        }
    };
    __decorate([
        components_4.observable()
    ], DappContainerHeader.prototype, "walletInfo", void 0);
    DappContainerHeader = __decorate([
        components_4.customElements('dapp-container-header')
    ], DappContainerHeader);
    exports.DappContainerHeader = DappContainerHeader;
});
define("@pageblock-dapp-container/main/footer.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DappContainerFooter = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let DappContainerFooter = class DappContainerFooter extends components_5.Module {
        constructor(parent) {
            super(parent);
        }
        init() {
            super.init();
        }
        get footer() {
            return this._footer;
        }
        set footer(value) {
            this._footer = value;
            this.lblFooter.clearInnerHTML();
            this.lblFooter.appendChild(value);
        }
        render() {
            return (this.$render("i-hstack", { class: "footer", horizontalAlignment: "start", verticalAlignment: "center", padding: { left: '5.25rem', right: '5.25rem', bottom: '1.25rem' } },
                this.$render("i-hstack", { id: "lblFooter", gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: "Powered By", font: { size: '0.75rem', color: '#000' } }),
                    this.$render("i-label", { caption: "SECURE", font: { size: '0.875rem', color: '#F99E43', weight: 700 } }),
                    this.$render("i-label", { caption: "COMPUTE", font: { size: '0.875rem', color: '#000', weight: 700 } }))));
        }
    };
    DappContainerFooter = __decorate([
        components_5.customElements('dapp-container-footer')
    ], DappContainerFooter);
    exports.DappContainerFooter = DappContainerFooter;
});
define("@pageblock-dapp-container/main", ["require", "exports", "@ijstech/components", "@pageblock-dapp-container/interface", "@pageblock-dapp-container/main/index.css.ts", "@pageblock-dapp-container/store", "@pageblock-dapp-container/main/body.tsx", "@pageblock-dapp-container/main/header.tsx", "@pageblock-dapp-container/main/footer.tsx"], function (require, exports, components_6, interface_2, index_css_1, store_2, body_1, header_1, footer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DappContainer = exports.DappContainerFooter = exports.DappContainerHeader = exports.DappContainerBody = void 0;
    Object.defineProperty(exports, "DappContainerBody", { enumerable: true, get: function () { return body_1.DappContainerBody; } });
    Object.defineProperty(exports, "DappContainerHeader", { enumerable: true, get: function () { return header_1.DappContainerHeader; } });
    Object.defineProperty(exports, "DappContainerFooter", { enumerable: true, get: function () { return footer_1.DappContainerFooter; } });
    const Theme = components_6.Styles.Theme.ThemeVars;
    let DappContainer = class DappContainer extends components_6.Module {
        async init() {
            super.init();
            components_6.application.EventBus.register(this, interface_2.EVENT.UPDATE_TAG, this.setTag);
        }
        async getData() {
            return this._data;
        }
        async setData(data) {
            this.pnlLoading.visible = true;
            this.gridMain.visible = false;
            this._data = data;
            store_2.updateStore(this._data);
            this.dappContainerHeader.reloadWalletsAndNetworks();
            if (!this._data) {
                this.dappContainerBody.clear();
                return;
            }
            await this.renderPageByConfig();
            this.pnlLoading.visible = false;
            this.gridMain.visible = true;
        }
        getActions() {
            let module = this.dappContainerBody.getModule();
            let actions;
            if (module && module.getActions) {
                actions = module.getActions();
            }
            return actions;
        }
        getTag() {
            return this.tag;
        }
        setTag(value) {
            this.tag = value;
            this.dappContainerBody.setTag(value);
            this.updateTheme();
        }
        updateTheme() {
            var _a, _b, _c, _d;
            if ((_a = this.tag) === null || _a === void 0 ? void 0 : _a.fontColor)
                this.style.setProperty('--text-primary', this.tag.fontColor);
            if ((_b = this.tag) === null || _b === void 0 ? void 0 : _b.backgroundColor)
                this.style.setProperty('--background-main', this.tag.backgroundColor);
            if ((_c = this.tag) === null || _c === void 0 ? void 0 : _c.inputFontColor)
                this.style.setProperty('--input-font_color', this.tag.inputFontColor);
            if ((_d = this.tag) === null || _d === void 0 ? void 0 : _d.inputBackgroundColor)
                this.style.setProperty('--input-background', this.tag.inputBackgroundColor);
        }
        async renderPageByConfig() {
            await this.dappContainerBody.setData(this._data);
        }
        render() {
            return (this.$render("i-vstack", { class: index_css_1.default, width: "100%", height: "100%", background: { color: Theme.background.main } },
                this.$render("dapp-container-header", { id: "dappContainerHeader" }),
                this.$render("i-panel", { stack: { grow: "1" }, overflow: "hidden" },
                    this.$render("i-vstack", { id: "pnlLoading", height: "100%", horizontalAlignment: "center", verticalAlignment: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                        this.$render("i-panel", { class: 'spinner' })),
                    this.$render("i-grid-layout", { id: "gridMain", height: "100%", templateColumns: ["1fr"] },
                        this.$render("dapp-container-body", { id: "dappContainerBody", overflow: "auto" }))),
                this.$render("dapp-container-footer", null)));
        }
    };
    DappContainer = __decorate([
        components_6.customModule
    ], DappContainer);
    exports.DappContainer = DappContainer;
});
