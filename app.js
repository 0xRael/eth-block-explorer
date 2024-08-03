document.getElementById('connect-button').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Create an ethers.js provider using MetaMask's provider
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Get the signer
            const signer = provider.getSigner();
            console.log('Account:', signer);

            // Display block details
            await updateBlocks(5);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this app.');
    }
});

async function updateBlocks(depth) {
    //let blocks = [];

    const latestBlockNumber = await provider.getBlockNumber();
    const blockDetailsDiv = document.getElementById('block-details');
    blockDetailsDiv.innerHTML = '';

    for(let i = 0; i < depth; i++){
        // Get block
        let block = await provider.getBlock(latestBlockNumber - i);
        //blocks.push(block);

        // Display block
        blockDetailsDiv.innerHTML += `
            <div class="block">
                <h2>Block ${block.number}</h2>
                <p><strong>Hash:</strong> ${block.hash}</p>
                <p><strong>Parent Hash:</strong> ${block.parentHash}</p>
                <p><strong>Miner:</strong> ${block.miner}</p>
                <p><strong>Timestamp:</strong> ${new Date(block.timestamp * 1000).toLocaleString()}</p>
                <p><strong>Transactions:</strong> ${block.transactions.length}</p>
            </div>
        `;
    }

    // Display blocks
    
}