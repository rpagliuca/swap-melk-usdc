import './App.css';
import { darkTheme, SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import { useState, useEffect } from 'react';
import { Navbar, Button } from 'reactstrap';

const MELK_POLYGON_ADDRESS = "0x9Fd41F6f67D4438f0e3Dc3951eAE0ad2093492Dd";
const USDC_POLYGON_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const POLYGON_CHAIN_ID = 137;
const POLYGON_CHAIN_ID_HEX = "0x89";

const MY_TOKEN_LIST = [
    {
    "name": "MELK",
    "address": MELK_POLYGON_ADDRESS,
    "symbol": "$MELK",
    "decimals": 18,
    "chainId": POLYGON_CHAIN_ID,
    "logoURI": "https://web3dev-forem-production.s3.amazonaws.com/uploads/user/profile_image/11/9bb532c5-70a8-4e23-bb08-8a019f67e9be.jpeg"
  },
  {
    "name": "USDC",
    "address": USDC_POLYGON_ADDRESS,
    "symbol": "USDC",
    "decimals": 6,
    "chainId": POLYGON_CHAIN_ID,
    "logoURI": "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023"
  },
]

function App() {
  return (
    <center>

      <Navbar className="my-nav-bar">
        Comprar e vender $MELK por dólares (USDC)
        <a href="https://github.com/rpagliuca/swap-melk-usdc">Fork me on GitHub</a>
      </Navbar>

      <div className="inner">
        <Inner/>
      </div>

      <hr/>
      <div className="footer">
        <p>Atenção: Este dApp não possui nenhum vínculo com a organização WEB3DEV. $MELK é um token com propósito educativo. Os valores de compra e venda são simbólicos e podem ser menores que as próprias taxas da rede. Para saber mais sobre o $MELK, acesse <a target="_blank" rel="noreferrer" href="https://www.web3dev.com.br/web3melk/melk-primeiro-token-learn-to-earn-do-brasil-2pj7">esse artigo da WEB3DEV</a>. Os preços de compra e venda de $MELK são calculados automaticamente pelo <a target="_blank" rel="noreferrer" href="https://academy.binance.com/pt/articles/what-is-uniswap-and-how-does-it-work">algoritmo de liquidez infinita do Uniswap</a>. Para reduzir a volatilidade de preço, é possível <a target="_blank" rel="noreferrer" href="https://support.uniswap.org/hc/en-us/articles/7423194619661-How-to-provide-liquidity-on-Uniswap-V3">adicionar liquidez ao par</a>.</p>
      </div>

    </center>
  )
}

function Inner() {

  const [isPolygon, setIsPolygon] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const eth = window.ethereum

  useEffect(() => {

    // If there is no Metamask installed, quit before setting up event listeners
    if (!eth) {
      return;
    }

    const accountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    }

    const chainChanged = (chainId) => {
      if (chainId === POLYGON_CHAIN_ID_HEX) {
        setIsPolygon(true)
      } else {
        setIsPolygon(false)
      }
    }

    // Initial lookup
    eth.request({ method: 'eth_accounts' }).then((accounts) => accountsChanged(accounts));
    eth.request({ method: 'eth_chainId' }).then((chainId) => chainChanged(chainId));

    // Event listener
    eth.on('accountsChanged', accountsChanged);
    eth.on('chainChanged', chainChanged);

    return () => {
      // Remove listeners when unmounting component
      eth.removeListener("accountsChanged", accountsChanged);
      eth.removeListener("chainChanged", chainChanged)
    }

  })

  if (!eth) {
    return <NoMetamask/>
  }

  if (!isConnected) {
    return <NotConnected/>
  }

  if (!isPolygon) {
    return <NoPolygon/>
  }

  return (
    <>
      <div className="Uniswap">
        <SwapWidget
          hideConnectionUI={true}
          theme={darkTheme}
          tokenList={MY_TOKEN_LIST}
          defaultInputTokenAddress={MELK_POLYGON_ADDRESS}
          defaultInputAmount={10}
          defaultOutputTokenAddress={USDC_POLYGON_ADDRESS}
        />
      </div>
    </>
  )
}

function NoMetamask() {
  return (
    <>
      <h2>O Metamask é necessário!</h2>
      <p>Por favor, instale a extensão Metamask no seu navegador de internet.</p>
    </>
  );
}

function connectToMetamask() {
  window.ethereum.request({ method: 'eth_requestAccounts' });
}

function NotConnected() {
  return (
    <>
      <h2>Conecte-se ao Metamask para continuar!</h2>
      <Button onClick={() => connectToMetamask()}>Conectar ao Metamask</Button>
    </>
  );
}

async function switchToPolygon() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_CHAIN_ID_HEX }],
    });
  } catch (switchError) {
    alert("Erro ao trocar rede para Polygon. Verifique se a rede está devidamente configurada.")
  }
}

function NoPolygon() {
  return (
    <>
      <h2>Conecte-se à rede Polygon</h2>
      <p>O swap (compra e venda) entre $MELK e USDC está disponível apenas na rede Polygon.</p>
      <Button onClick={() => switchToPolygon()}>Conectar à rede Polygon</Button>
    </>
  );
}


export default App;
