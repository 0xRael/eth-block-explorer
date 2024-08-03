// Bootstrap alerts

const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  alertPlaceholder.innerHTML += `<div class="alert alert-${type} alert-dismissible" role="alert">
       <div>${message}</div>
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

// Block Explorer

let blocks = [];
let provider;
let signer;


document.getElementById('connect-button').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Create an ethers.js provider using MetaMask's provider
            provider = new ethers.providers.Web3Provider(window.ethereum);

            // Get the signer
            signer = provider.getSigner();
            console.log('Account:', signer);

            // Display block details
            await updateBlocks(5);

            // Hide the connect button after successful connection
            document.getElementById('connect-alert').style.display = 'none';

            appendAlert(`Succefully connected to Metamask account ${signer.getAddress()}!`, 'success');
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            appendAlert('An internal error ocurred...', 'danger');
        }
    } else {
        appendAlert('MetaMask is not installed. Please install it to use this app.', 'warning');
    }
});

document.getElementById('fetch-more').addEventListener('click', async () => {
    await updateBlocks(5, blocks.length, false);
});

// Shows latest blocks
async function updateBlocks(depth, startFrom=0, clear=true) {
    if(provider === null){
        return;
    }
    const latestBlockNumber = await provider.getBlockNumber();
    const blockDetailsDiv = document.getElementById('block-details');
    if(clear){
        blockDetailsDiv.innerHTML = '';
        blocks = [];
    }

    for(let i = startFrom; i < (depth + startFrom); i++){
        // Get block
        let block = await provider.getBlock(latestBlockNumber - i);
        let blockN = blocks.length;
        blocks.push(block.number);
    
        // Display block
        blockDetailsDiv.innerHTML += `
            <div class="block card shadow-lg p-3 mb-3 mt-3 rounded bg-secondary-subtle" id="block-${blockN}">
                <h5 class="card-header" id="block-${blockN}-title">Block ${block.number}</h5>
                <div class="card-body">
                    <p class="card-text"><strong>${block.transactions.length}</strong> txns. <strong>Hash:</strong> ${block.hash}.</p>
                    <p class="card-text"><strong>By:</strong> ${block.miner}. <strong>At </strong> ${new Date(block.timestamp * 1000).toLocaleString()}</li>
                </div>
                <ul id="block-${blockN}-txns" class="list-group list-group-flush">
                </ul>
            </div>
        `;
        
        document.getElementById(`block-${blockN}-title`).addEventListener('click', showTransactions(blockN))
    }
}

async function showTransactions(blockN) {
    let blockTxns = document.getElementById(`block-${blockN}`);
    let blockId = blocks[blockN];
    let updBlock = await provider.getBlockWithTransactions(blockId);
    
    blockTxns.innerHTML = '';

    for(let i = 0; i < updBlock.transactions.length; i++) {
        let tx = updBlock.transactions[i];
        let content = '';
        
        if(tx.data === '0x' && tx.to){
            content = `${ethers.utils.formatEther(tx.value)} ETH.
            <strong>From:</strong> ${tx.from}. To:</strong> ${tx.to ? tx.to : 'Contract Creation'}`;
        } else {
            content = `${ethers.utils.formatEther(tx.value)} ETH. <strong>Contract interaction!</strong>.
            <strong>From:</strong> ${tx.from}. To:</strong> ${tx.to ? tx.to : 'Contract Creation'}`;
        }

        blockTxns.innerHTML += `
            <li class="list-group-item">|
                ${content}
            </li>
        `;
    }
}