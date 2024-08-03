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
            document.getElementById('connect-button').style.display = 'none';
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this app.');
    }
});

document.getElementById('fetch-more').addEventListener('click', async () => {
    await updateBlocks(5, blocks.length);
});

// Shows latest blocks
async function updateBlocks(depth, startFrom=0) {
    if(provider === null){
        return;
    }
    const latestBlockNumber = await provider.getBlockNumber();
    const blockDetailsDiv = document.getElementById('block-details');
    blockDetailsDiv.innerHTML = '';

    for(let i = startFrom; i < (depth + startFrom); i++){
        // Get block
        let block = await provider.getBlock(latestBlockNumber - i);
        blocks.push(block); // So we can have them loaded

        // Display block
        blockDetailsDiv.innerHTML += `
            <div class="block" id="block-${blocks.length-1}">
                <h2>Block ${block.number}</h2>
                <p><strong>Hash:</strong> ${block.hash}</p>
                <p><strong>Parent Hash:</strong> ${block.parentHash}</p>
                <p><strong>Miner:</strong> ${block.miner}</p>
                <p><strong>Timestamp:</strong> ${new Date(block.timestamp * 1000).toLocaleString()}</p>
                <p><strong>Transactions:</strong> ${block.transactions.length}</p>
            </div>
        `;
    }
}