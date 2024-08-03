document.getElementById('connect-button').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Create an ethers.js provider using MetaMask's provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // Get the signer
            const signer = provider.getSigner();

            // Get the latest block number
            const latestBlockNumber = await provider.getBlockNumber();
            console.log('Latest Block Number:', latestBlockNumber);

            // Fetch the latest block details
            const latestBlock = await provider.getBlock(latestBlockNumber);
            console.log('Latest Block:', latestBlock);

            // Display block details
            displayBlockDetails(latestBlock);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this app.');
    }
});

function displayBlockDetails(block) {
    const blockDetailsDiv = document.getElementById('block-details');
    blockDetailsDiv.innerHTML = `
        <h2>Block ${block.number}</h2>
        <p><strong>Hash:</strong> ${block.hash}</p>
        <p><strong>Parent Hash:</strong> ${block.parentHash}</p>
        <p><strong>Miner:</strong> ${block.miner}</p>
        <p><strong>Timestamp:</strong> ${new Date(block.timestamp * 1000).toLocaleString()}</p>
        <p><strong>Transactions:</strong> ${block.transactions.length}</p>
    `;
}