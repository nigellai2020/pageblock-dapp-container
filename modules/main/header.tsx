import {
  customElements,
  Module,
  Control,
  ControlElement,
  Styles,
  Button,
  Modal,
  observable,
  Label,
  Panel,
  application,
  IEventBus,
  HStack,
  GridLayout,
  Container,
} from '@ijstech/components';
import { Wallet, WalletPlugin, WalletPluginConfig } from '@ijstech/eth-wallet';
import { formatNumber } from '@pageblock-dapp-container/utils';
import styleClass from './header.css';
import Assets from '@pageblock-dapp-container/assets';
import {
  INetwork,
  EventId,
  truncateAddress,
  isWalletConnected,
  connectWallet,
  logoutWallet,
  switchNetwork,
  hasWallet,
  getNetworkInfo,
  getSiteSupportedNetworks,
  getWalletProvider,
  getDefaultChainId,
  viewOnExplorerByAddress,
  getSupportedWallets
} from '@pageblock-dapp-container/store';

const Theme = Styles.Theme.ThemeVars;

@customElements('dapp-container-header')
export class DappContainerHeader extends Module {
  private btnNetwork: Button;
  private hsBalance: HStack;
  private lblBalance: Label;
  private pnlWalletDetail: Panel;
  private btnWalletDetail: Button;
  private mdWalletDetail: Modal;
  private btnConnectWallet: Button;
  private mdNetwork: Modal;
  private mdConnect: Modal;
  private mdAccount: Modal;
  private lblNetworkDesc: Label;
  private lblWalletAddress: Label;
  private hsViewAccount: HStack;
  private gridWalletList: GridLayout;
  private gridNetworkGroup: GridLayout;

  private $eventBus: IEventBus;
  private selectedNetwork: INetwork | undefined;
  private networkMapper: Map<number, HStack>;
  private walletMapper: Map<WalletPlugin, HStack>;
  private currActiveNetworkId: number;
  private currActiveWallet: WalletPlugin;
  private supportedNetworks: INetwork[] = [];
  @observable()
  private walletInfo = {
      address: '',
      balance: '',
      networkId: 0
  }

  constructor(parent?: Container, options?: any) {
      super(parent, options);
      this.$eventBus = application.EventBus;
      this.registerEvent();
  };

  get symbol() {
      let symbol = '';
      if (this.selectedNetwork?.chainId && this.selectedNetwork?.symbol) {
          symbol = this.selectedNetwork?.symbol;
      }
      return symbol;
  }

  get shortlyAddress() {
      const address = this.walletInfo.address;
      if (!address) return 'No address selected';
      return truncateAddress(address);
  }

  registerEvent() {
      let wallet = Wallet.getInstance();
      this.$eventBus.register(this, EventId.ConnectWallet, this.openConnectModal)
      this.$eventBus.register(this, EventId.IsWalletConnected, async (connected: boolean) => {
          if (connected) {
              this.walletInfo.address = wallet.address;
              this.walletInfo.balance = formatNumber((await wallet.balance).toFixed(), 2);
              this.walletInfo.networkId = wallet.chainId;
          }
          this.selectedNetwork = getNetworkInfo(wallet.chainId);
          this.updateConnectedStatus(connected);
          this.updateList(connected);
      })
      this.$eventBus.register(this, EventId.IsWalletDisconnected, async (connected: boolean) => {
          this.selectedNetwork = getNetworkInfo(wallet.chainId);
          this.updateConnectedStatus(connected);
          this.updateList(connected);
      })
      this.$eventBus.register(this, EventId.chainChanged, async (chainId: number) => {
          this.onChainChanged(chainId);
      })
  }

  init() {
      this.classList.add(styleClass);
      this.selectedNetwork = getNetworkInfo(getDefaultChainId());
      super.init();
      this.reloadWalletsAndNetworks();
      this.initData();
  }

  reloadWalletsAndNetworks() {
    this.renderWalletList();
    this.renderNetworks();
    this.updateConnectedStatus(isWalletConnected());
  }

  onChainChanged = async (chainId: number) => {
      this.walletInfo.networkId = chainId;
      this.selectedNetwork = getNetworkInfo(chainId);
      let wallet = Wallet.getClientInstance();
      const isConnected = wallet.isConnected;
      this.walletInfo.balance = isConnected ? formatNumber((await wallet.balance).toFixed(), 2) : '0';
      this.updateConnectedStatus(isConnected);
      this.updateList(isConnected);
  };

  updateConnectedStatus = (isConnected: boolean) => {
      if (isConnected) {
          this.lblBalance.caption = `${this.walletInfo.balance} ${this.symbol}`;
          this.btnWalletDetail.caption = this.shortlyAddress;
          this.lblWalletAddress.caption = this.shortlyAddress;
          const networkInfo = getNetworkInfo(Wallet.getInstance().chainId);
          this.hsViewAccount.visible = !!networkInfo?.explorerAddressUrl;
      } else {
          this.hsViewAccount.visible = false;
      }
      const isSupportedNetwork = this.selectedNetwork && this.supportedNetworks.findIndex(network => network === this.selectedNetwork) !== -1;
      if (isSupportedNetwork) {
          const img = this.selectedNetwork?.img ? Assets.img.network[this.selectedNetwork.img] || application.assets(this.selectedNetwork.img) : undefined;
          this.btnNetwork.icon = img ? <i-icon width={26} height={26} image={{ url: img }} ></i-icon> : undefined;
          this.btnNetwork.caption = this.selectedNetwork?.name ?? "";
      } else {
          this.btnNetwork.icon = undefined;
          this.btnNetwork.caption = "Unsupported Network";
      }
      this.btnConnectWallet.visible = !isConnected;
      this.hsBalance.visible = isConnected;
      this.pnlWalletDetail.visible = isConnected;
  }

  updateDot(connected: boolean, type: 'network' | 'wallet') {
      const wallet = Wallet.getClientInstance();
      if (type === 'network') {
          if (this.currActiveNetworkId !== undefined && this.currActiveNetworkId !== null && this.networkMapper.has(this.currActiveNetworkId)) {
              this.networkMapper.get(this.currActiveNetworkId).classList.remove('is-actived');
          }
          if (connected && this.networkMapper.has(wallet.chainId)) {
              this.networkMapper.get(wallet.chainId).classList.add('is-actived');
          }
          this.currActiveNetworkId = wallet.chainId;
      } else {
          if (this.currActiveWallet && this.walletMapper.has(this.currActiveWallet)) {
              this.walletMapper.get(this.currActiveWallet).classList.remove('is-actived');
          }
          if (connected && this.walletMapper.has(wallet.clientSideProvider?.walletPlugin)) {
              this.walletMapper.get(wallet.clientSideProvider?.walletPlugin).classList.add('is-actived');
          }
          this.currActiveWallet = wallet.clientSideProvider?.walletPlugin;
      }
  }

  updateList(isConnected: boolean) {
      if (isConnected && getWalletProvider() !== WalletPlugin.MetaMask) {
          this.lblNetworkDesc.caption = "We support the following networks, please switch network in the connected wallet.";
      } else {
          this.lblNetworkDesc.caption = "We support the following networks, please click to connect.";
      }
      this.updateDot(isConnected, 'wallet');
      this.updateDot(isConnected, 'network');
  }

  openConnectModal = () => {
      this.mdConnect.title = "Connect wallet"
      this.mdConnect.visible = true;
  }

  openNetworkModal = () => {
      this.mdNetwork.visible = true;
  }

  openWalletDetailModal = () => {
      this.mdWalletDetail.visible = true;
  }

  openAccountModal = (target: Control, event: Event) => {
      event.stopPropagation();
      this.mdWalletDetail.visible = false;
      this.mdAccount.visible = true;
  }

  openSwitchModal = (target: Control, event: Event) => {
      event.stopPropagation();
      this.mdWalletDetail.visible = false;
      this.mdConnect.title = "Switch wallet";
      this.mdConnect.visible = true;
  }

  logout = async (target: Control, event: Event) => {
      event.stopPropagation();
      this.mdWalletDetail.visible = false;
      await logoutWallet();
      this.updateConnectedStatus(false);
      this.updateList(false);
      this.mdAccount.visible = false;
  }

  viewOnExplorerByAddress() {
      viewOnExplorerByAddress(Wallet.getInstance().chainId, this.walletInfo.address)
  }

  async switchNetwork(chainId: number) {
      if (!chainId) return;
      await switchNetwork(chainId);
      this.mdNetwork.visible = false;
  }

  connectToProviderFunc = async (walletPlugin: WalletPlugin) => {
      if (Wallet.isInstalled(walletPlugin)) {
          await connectWallet(walletPlugin);
      }
      else {
          let config = WalletPluginConfig[walletPlugin];
          let homepage = config && config.homepage ? config.homepage() : '';
          window.open(homepage, '_blank');
      }
      this.mdConnect.visible = false;
  }

  copyWalletAddress = () => {
      application.copyToClipboard(this.walletInfo.address || "");
  }

  isWalletActive(walletPlugin) {
      const provider = walletPlugin.toLowerCase();
      return Wallet.isInstalled(walletPlugin) && Wallet.getClientInstance().clientSideProvider?.walletPlugin === provider;
  }

  isNetworkActive(chainId: number) {
      return Wallet.getInstance().chainId === chainId;
  }

  renderWalletList = () => {
      this.gridWalletList.clearInnerHTML();
      this.walletMapper = new Map();
      const walletList = getSupportedWallets();
      walletList.forEach((wallet) => {
          const isActive = this.isWalletActive(wallet.name);
          if (isActive) this.currActiveWallet = wallet.name;
          const hsWallet = (
              <i-hstack
                  class={isActive ? 'is-actived list-item' : 'list-item'}
                  verticalAlignment='center'
                  gap={12}
                  background={{ color: Theme.colors.secondary.light }}
                  border={{ radius: 10 }} position="relative"
                  padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                  horizontalAlignment="space-between"
                  onClick={() => this.connectToProviderFunc(wallet.name)}
              >
                  <i-label
                      caption={wallet.displayName}
                      margin={{ left: '1rem' }}
                      wordBreak="break-word"
                      font={{ size: '.875rem', bold: true, color: Theme.colors.secondary.contrastText }}
                  />
                  <i-image width={34} height="auto" url={Assets.img.wallet[wallet.img] || application.assets(wallet.img)} />
              </i-hstack>
          );
          this.walletMapper.set(wallet.name, hsWallet);
          this.gridWalletList.append(hsWallet);
      })
  }

  renderNetworks() {
      this.gridNetworkGroup.clearInnerHTML();
      this.networkMapper = new Map();
      this.supportedNetworks = getSiteSupportedNetworks();
      this.gridNetworkGroup.append(...this.supportedNetworks.map((network) => {
          const img = network.img ? <i-image url={Assets.img.network[network.img] || application.assets(network.img)} width={34} height={34} /> : [];
          const isActive = this.isNetworkActive(network.chainId);
          if (isActive) this.currActiveNetworkId = network.chainId;
          const hsNetwork = (
              <i-hstack
                  onClick={() => this.switchNetwork(network.chainId)}
                  background={{ color: Theme.colors.secondary.light }}
                  border={{ radius: 10 }}
                  position="relative"
                  class={isActive ? 'is-actived list-item' : 'list-item'}
                  padding={{ top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' }}
              >
                  <i-hstack margin={{ left: '1rem' }} verticalAlignment="center" gap={12}>
                      {img}
                      <i-label caption={network.name} wordBreak="break-word" font={{ size: '.875rem', bold: true, color: Theme.colors.secondary.contrastText }} />
                  </i-hstack>
              </i-hstack>
          );
          this.networkMapper.set(network.chainId, hsNetwork);
          return hsNetwork;
      }));
  }

  async initData() {
      let accountsChangedEventHandler = async (account: string) => {
      }
      let chainChangedEventHandler = async (hexChainId: number) => {
          this.updateConnectedStatus(true);
      }
      const selectedProvider = localStorage.getItem('walletProvider') as WalletPlugin;
      const isValidProvider = Object.values(WalletPlugin).includes(selectedProvider);
      if (hasWallet() && isValidProvider) {
          await connectWallet(selectedProvider, {
              'accountsChanged': accountsChangedEventHandler,
              'chainChanged': chainChangedEventHandler
          });
      }
  }

  render() {
      return (
          <i-panel padding={{ top: '1.188rem', bottom: '0.5rem', left: '5.25rem', right: '5.25rem' }}>
              <i-hstack verticalAlignment='center' horizontalAlignment='end'>
                  <i-panel>
                      <i-button
                          id="btnNetwork"
                          height={38}
                          margin={{ right: '0.5rem' }}
                          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                          border={{ radius: 5 }}
                          font={{ color: Theme.colors.primary.contrastText }}
                          onClick={this.openNetworkModal}
                          caption={"Unsupported Network"}
                      ></i-button>
                  </i-panel>
                  <i-hstack
                      id="hsBalance"
                      height={38}
                      visible={false}
                      horizontalAlignment="center"
                      verticalAlignment="center"
                      background={{ color: Theme.colors.primary.main }}
                      border={{ radius: 5 }}
                      padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                  >
                      <i-label id="lblBalance" font={{ color: Theme.colors.primary.contrastText }}></i-label>
                  </i-hstack>
                  <i-panel id="pnlWalletDetail" visible={false}>
                      <i-button
                          id="btnWalletDetail"
                          height={38}
                          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                          margin={{ left: '0.5rem' }}
                          border={{ radius: 5 }}
                          font={{ color: Theme.colors.error.contrastText }}
                          background={{ color: Theme.colors.error.light }}
                          onClick={this.openWalletDetailModal}
                      ></i-button>
                      <i-modal
                          id="mdWalletDetail"
                          class="wallet-modal"
                          height="auto"
                          maxWidth={200}
                          showBackdrop={false}
                          popupPlacement="bottomRight"
                      >
                          <i-vstack gap={15} padding={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                              <i-button
                                  caption="Account"
                                  width="100%"
                                  height="auto"
                                  border={{ radius: 5 }}
                                  font={{ color: Theme.colors.error.contrastText }}
                                  background={{ color: Theme.colors.error.light }}
                                  padding={{ top: '0.5rem', bottom: '0.5rem' }}
                                  onClick={this.openAccountModal}
                              ></i-button>
                              <i-button
                                  caption="Switch wallet"
                                  width="100%"
                                  height="auto"
                                  border={{ radius: 5 }}
                                  font={{ color: Theme.colors.error.contrastText }}
                                  background={{ color: Theme.colors.error.light }}
                                  padding={{ top: '0.5rem', bottom: '0.5rem' }}
                                  onClick={this.openSwitchModal}
                              ></i-button>
                              <i-button
                                  caption="Logout"
                                  width="100%"
                                  height="auto"
                                  border={{ radius: 5 }}
                                  font={{ color: Theme.colors.error.contrastText }}
                                  background={{ color: Theme.colors.error.light }}
                                  padding={{ top: '0.5rem', bottom: '0.5rem' }}
                                  onClick={this.logout}
                              ></i-button>
                          </i-vstack>
                      </i-modal>
                  </i-panel>
                  <i-button
                      id="btnConnectWallet"
                      height={38}
                      caption="Connect Wallet"
                      border={{ radius: 5 }}
                      font={{ color: Theme.colors.error.contrastText }}
                      background={{ color: Theme.colors.error.light }}
                      padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                      onClick={this.openConnectModal}
                  ></i-button>
              </i-hstack>
              <i-modal
                  id='mdNetwork'
                  title='Supported Network'
                  class='os-modal'
                  width={440}
                  closeIcon={{ name: 'times' }}
                  border={{ radius: 10 }}
              >
                  <i-vstack
                      height='100%' lineHeight={1.5}
                      padding={{ left: '1rem', right: '1rem', bottom: '2rem' }}
                  >
                      <i-label
                          id='lblNetworkDesc'
                          margin={{ top: '1rem' }}
                          font={{ size: '.875rem' }}
                          wordBreak="break-word"
                          caption='We support the following networks, please click to connect.'
                      ></i-label>
                      <i-hstack
                          margin={{ left: '-1.25rem', right: '-1.25rem' }}
                          height='100%'
                      >
                          <i-grid-layout
                              id='gridNetworkGroup'
                              font={{ color: '#f05e61' }}
                              height="calc(100% - 160px)"
                              width="100%"
                              overflow={{ y: 'auto' }}
                              margin={{ top: '1.5rem' }}
                              padding={{ left: '1.25rem', right: '1.25rem' }}
                              columnsPerRow={1}
                              templateRows={['max-content']}
                              class='list-view'
                              gap={{ row: '0.5rem' }}
                          ></i-grid-layout>
                      </i-hstack>
                  </i-vstack>
              </i-modal>
              <i-modal
                  id='mdConnect'
                  title='Connect Wallet'
                  class='os-modal'
                  width={440}
                  closeIcon={{ name: 'times' }}
                  border={{ radius: 10 }}
              >
                  <i-vstack padding={{ left: '1rem', right: '1rem', bottom: '2rem' }} lineHeight={1.5}>
                      <i-label
                          font={{ size: '.875rem' }}
                          caption='Recommended wallet for Chrome'
                          margin={{ top: '1rem' }}
                          wordBreak="break-word"
                      ></i-label>
                      <i-panel>
                          <i-grid-layout
                              id='gridWalletList'
                              class='list-view'
                              margin={{ top: '0.5rem' }}
                              columnsPerRow={1}
                              templateRows={['max-content']}
                              gap={{ row: 8 }}
                          >
                          </i-grid-layout>
                      </i-panel>
                  </i-vstack>
              </i-modal>
              <i-modal
                  id='mdAccount'
                  title='Account'
                  class='os-modal'
                  width={440}
                  height={200}
                  closeIcon={{ name: 'times' }}
                  border={{ radius: 10 }}
              >
                  <i-vstack width="100%" padding={{ top: "1.75rem", bottom: "1rem", left: "2.75rem", right: "2.75rem" }} gap={5}>
                      <i-hstack horizontalAlignment="space-between" verticalAlignment='center'>
                          <i-label font={{ size: '0.875rem' }} caption='Connected with' />
                          <i-button
                              caption='Logout'
                              font={{ color: Theme.colors.error.contrastText }}
                              background={{ color: Theme.colors.error.light }}
                              padding={{ top: 6, bottom: 6, left: 10, right: 10 }}
                              border={{ radius: 5 }}
                              onClick={this.logout}
                          />
                      </i-hstack>
                      <i-label id="lblWalletAddress" font={{ size: '1.25rem', bold: true, color: Theme.colors.primary.main }} lineHeight={1.5} />
                      <i-hstack verticalAlignment="center" gap="2.5rem">
                          <i-hstack
                              class="pointer"
                              verticalAlignment="center"
                              tooltip={{ content: `The address has been copied`, trigger: 'click' }}
                              gap="0.5rem"
                              onClick={this.copyWalletAddress}
                          >
                              <i-icon
                                  name="copy"
                                  width="16px"
                                  height="16px"
                                  fill={Theme.text.secondary}
                              ></i-icon>
                              <i-label caption="Copy Address" font={{ size: "0.875rem", bold: true }} />
                          </i-hstack>
                          <i-hstack id="hsViewAccount" class="pointer" verticalAlignment="center" onClick={this.viewOnExplorerByAddress.bind(this)}>
                              <i-icon name="external-link-alt" width="16" height="16" fill={Theme.text.secondary} display="inline-block" />
                              <i-label caption="View on Explorer" margin={{ left: "0.5rem" }} font={{ size: "0.875rem", bold: true }} />
                          </i-hstack>
                      </i-hstack>
                  </i-vstack>
              </i-modal>
          </i-panel>
      )
  }
}

declare global {
  namespace JSX {
      interface IntrinsicElements {
          ['dapp-container-header']: ControlElement;
      }
  }
}
