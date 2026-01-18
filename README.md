# 🟣 Mini Wallet Web3

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-blue?style=for-the-badge)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> Uma carteira digital descentralizada (dApp) construída para explorar a fundo a integração entre Front-end moderno e a Blockchain Ethereum.

🔗 **Demo Online:** [Acesse aqui na Vercel](https://mini-wallet-web3.vercel.app)

---

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como um desafio técnico pessoal para migrar conhecimentos de Backend/Cloud para o ecossistema **Web3**. O objetivo não era apenas "fazer funcionar", mas sim criar uma experiência de usuário (UX) robusta, segura e transparente, lidando com as assincronicidades e incertezas típicas da Blockchain.

A aplicação permite conectar-se à rede Ethereum (foco na **Sepolia Testnet**), visualizar saldos em tempo real, estimar custos de Gas e realizar transferências de ETH.

## ✨ Funcionalidades Principais

* 🦊 **Integração com MetaMask:** Detecção automática de provider e contas.
* 🔄 **Troca de Redes (Chain Switching):** Suporte dinâmico para alternar entre Mainnet e Sepolia via interface.
* 💰 **Estimativa de Gas em Tempo Real:** Cálculo automático de taxas (`estimateGas * gasPrice`) antes do envio, garantindo transparência financeira ao usuário.
* ⚡ **Event Listeners:** Atualização automática da interface ao trocar de conta ou rede no MetaMask (sem necessidade de refresh manual).
* 🎨 **UI/UX Refinada:** Interface Dark Mode moderna desenvolvida com Chakra UI, com feedback visual de carregamento, validação de inputs e Toasts de notificação.

## 🛠️ Stack Tecnológica

* **Core:** React.js (Vite)
* **Blockchain Interaction:** Ethers.js v6
* **Styling:** Chakra UI (Component Library)
* **Deploy:** Vercel

## 🏗️ Decisões de Arquitetura

Para garantir a escalabilidade e manutenção do código, adotei uma arquitetura baseada em **Custom Hooks**:

### 1. Separação de Responsabilidades (SoC)
Toda a lógica de conexão, estado da blockchain e listeners foi isolada no hook `useWallet`. Isso mantém os componentes visuais (`TransferForm`, `WalletInfo`) puros e focados apenas em renderização.

### 2. Gestão de Estado Assíncrono
O uso de `useEffect` e `useCallback` foi crucial para gerenciar o ciclo de vida das conexões Web3, evitando memory leaks nos listeners de eventos (`accountsChanged`, `chainChanged`) e garantindo que o saldo seja atualizado após a mineração de cada bloco.

### 3. UX Otimista e Feedback
Implementação de *Debounce* na estimativa de Gas para evitar requisições excessivas ao nó RPC enquanto o usuário digita, além de tratamento de erros amigável (Try/Catch) para falhas de transação.

## 🚀 Como Rodar Localmente

Pré-requisitos: Node.js instalado e extensão MetaMask no navegador.

```bash
# 1. Clone o repositório
git clone [https://github.com/GuiRBeira/mini-wallet-web3.git](https://github.com/GuiRBeira/mini-wallet-web3.git)

# 2. Instale as dependências
cd mini-wallet-web3
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
