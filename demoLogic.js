// Demo Trading Logic - Quotex Style Enhancement
// This file contains additional logic to make the platform behave more like Quotex

class QuotexDemoLogic {
    constructor() {
        this.balanceKey = 'quotex_demo_balance_v1';
        this.disclaimerKey = 'quotex_demo_disclaimer_accepted';
        this.tradeHistoryKey = 'quotex_demo_history';
        this.initialize();
    }

    initialize() {
        this.loadBalance();
        this.showDisclaimerIfNeeded();
        this.setupChartEnhancements();
        this.setupTradeLogic();
        this.setupNavigation();
        this.startPriceEngine();
    }

    // Balance Management
    loadBalance() {
        const saved = localStorage.getItem(this.balanceKey);
        if (saved) {
            document.querySelector('.balance').textContent = '₹' + parseFloat(saved).toLocaleString('en-IN');
        } else {
            // Set initial balance
            localStorage.setItem(this.balanceKey, '1000000');
        }
    }

    updateBalance(amount) {
        const current = parseFloat(localStorage.getItem(this.balanceKey) || '1000000');
        const newBalance = Math.max(0, current + amount);
        localStorage.setItem(this.balanceKey, newBalance.toString());
        document.querySelector('.balance').textContent = '₹' + newBalance.toLocaleString('en-IN');
        return newBalance;
    }

    // Legal Disclaimer
    showDisclaimerIfNeeded() {
        const accepted = localStorage.getItem(this.disclaimerKey);
        if (!accepted) {
            this.showDisclaimerModal();
        }
    }

    showDisclaimerModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-title">⚠️ Important Notice</div>
                <div class="modal-text">
                    <p>This is a <strong>DEMO trading simulator</strong> for educational purposes only.</p>
                    <ul style="text-align: left; margin: 15px 0;">
                        <li>No real money involved</li>
                        <li>No real trading occurs</li>
                        <li>All results are simulated</li>
                        <li>For learning and practice only</li>
                    </ul>
                    <p>By continuing, you confirm you are 18+ and understand this is demo only.</p>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="location.href='index.html'">Exit</button>
                    <button class="modal-btn primary" id="acceptDisclaimer">I Understand - Continue</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('acceptDisclaimer').addEventListener('click', () => {
            localStorage.setItem(this.disclaimerKey, 'true');
            modal.remove();
        });
    }

    // Chart Enhancements
    setupChartEnhancements() {
        // Add price scale on right
        this.addPriceScale();

        // Add trade markers and labels
        this.setupTradeMarkers();
    }

    addPriceScale() {
        const chartContainer = document.querySelector('.chart-container');
        const priceScale = document.createElement('div');
        priceScale.className = 'price-scale';
        priceScale.innerHTML = `
            <div class="price-level">0.6600</div>
            <div class="price-level">0.6590</div>
            <div class="price-level">0.6580</div>
            <div class="price-level">0.6570</div>
            <div class="price-level">0.6560</div>
        `;
        chartContainer.appendChild(priceScale);
    }

    setupTradeMarkers() {
        // This will be called when trades are active
        this.tradeMarkers = [];
    }

    // Enhanced Trade Logic
    setupTradeLogic() {
        // Override existing trade functions with enhanced logic
        const originalStartTrade = window.startTrade;
        window.startTrade = (direction) => {
            this.startEnhancedTrade(direction);
        };

        const originalCompleteTrade = window.completeTrade;
        window.completeTrade = () => {
            this.completeEnhancedTrade();
        };
    }

    startEnhancedTrade(direction) {
        const expiry = 60; // 1 minute

        activeTrade = {
            direction,
            entryPrice: price,
            expiryTime: Date.now() + expiry * 1000,
            stake: selectedAmount,
            id: Date.now()
        };

        // Disable buttons
        document.getElementById('upBtn').disabled = true;
        document.getElementById('downBtn').disabled = true;

        // Add entry marker to chart
        this.addEntryMarker(activeTrade.entryPrice);

        // Start countdown with enhanced display
        document.getElementById('countdown').style.display = 'block';
        this.updateEnhancedCountdown();

        countdownInterval = setInterval(() => this.updateEnhancedCountdown(), 100);
    }

    addEntryMarker(price) {
        // Add visual marker on chart for entry price
        const marker = document.createElement('div');
        marker.className = 'trade-marker entry-marker';
        marker.innerHTML = `<span>Entry: ${price.toFixed(4)}</span>`;
        document.querySelector('.chart-container').appendChild(marker);
        this.tradeMarkers.push(marker);
    }

    updateEnhancedCountdown() {
        if (!activeTrade) return;

        const remaining = Math.max(0, activeTrade.expiryTime - Date.now());
        const seconds = Math.ceil(remaining / 1000);

        // Format as MM:SS
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        document.getElementById('countdown').textContent = timeString;

        // Update result display
        document.getElementById('resultAmount').textContent = `${timeString} remaining`;
        document.getElementById('resultText').textContent = `Entry: ${activeTrade.entryPrice.toFixed(4)}`;

        if (remaining <= 0) {
            this.completeEnhancedTrade();
        }
    }

    completeEnhancedTrade() {
        clearInterval(countdownInterval);
        const finalPrice = price;

        // Determine result
        const isWin = activeTrade.direction === 'up' ?
            finalPrice > activeTrade.entryPrice :
            finalPrice < activeTrade.entryPrice;

        let profit;
        if (isWin) {
            profit = activeTrade.stake * 0.65; // 65% payout
        } else if (finalPrice === activeTrade.entryPrice) {
            profit = 0; // Tie - refund stake
        } else {
            profit = -activeTrade.stake; // Loss
        }

        // Update balance
        this.updateBalance(profit);

        // Enhanced result display
        this.showTradeResult(isWin, profit, finalPrice);

        // Add to history
        this.addToHistory({
            id: activeTrade.id,
            asset: currentAsset,
            direction: activeTrade.direction,
            stake: activeTrade.stake,
            entryPrice: activeTrade.entryPrice,
            finalPrice: finalPrice,
            profit: profit,
            timestamp: new Date().toLocaleString()
        });

        // Clean up
        this.clearTradeMarkers();
        activeTrade = null;
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('upBtn').disabled = false;
        document.getElementById('downBtn').disabled = false;

        // Reset display after delay
        setTimeout(() => {
            this.resetResultDisplay();
        }, 5000);
    }

    showTradeResult(isWin, profit, finalPrice) {
        const resultIcon = document.getElementById('resultIcon');
        const resultAmount = document.getElementById('resultAmount');
        const resultText = document.getElementById('resultText');

        if (isWin) {
            resultIcon.innerHTML = '<i class="fas fa-check-circle" style="color: #00aa00;"></i>';
            resultAmount.textContent = `+₹${profit.toFixed(2)}`;
            resultAmount.style.color = '#00aa00';
            resultText.textContent = `Won! ${activeTrade.entryPrice.toFixed(4)} → ${finalPrice.toFixed(4)}`;
        } else if (profit === 0) {
            resultIcon.innerHTML = '<i class="fas fa-minus-circle" style="color: #ffaa00;"></i>';
            resultAmount.textContent = '₹0.00';
            resultAmount.style.color = '#ffaa00';
            resultText.textContent = `Tie! Stake refunded`;
        } else {
            resultIcon.innerHTML = '<i class="fas fa-times-circle" style="color: #cc0000;"></i>';
            resultAmount.textContent = `-₹${Math.abs(profit).toFixed(2)}`;
            resultAmount.style.color = '#cc0000';
            resultText.textContent = `Lost! ${activeTrade.entryPrice.toFixed(4)} → ${finalPrice.toFixed(4)}`;
        }
    }

    resetResultDisplay() {
        document.getElementById('resultIcon').innerHTML = '<i class="fas fa-play-circle"></i>';
        document.getElementById('resultAmount').textContent = 'Ready to Trade';
        document.getElementById('resultAmount').style.color = '';
        document.getElementById('resultText').textContent = 'Select amount and direction to start trading';
    }

    clearTradeMarkers() {
        this.tradeMarkers.forEach(marker => marker.remove());
        this.tradeMarkers = [];
    }

    // Trade History
    addToHistory(trade) {
        const history = this.getTradeHistory();
        history.unshift(trade); // Add to beginning
        if (history.length > 50) history.pop(); // Keep only last 50
        localStorage.setItem(this.tradeHistoryKey, JSON.stringify(history));
        this.updateHistoryDisplay();
    }

    getTradeHistory() {
        const saved = localStorage.getItem(this.tradeHistoryKey);
        return saved ? JSON.parse(saved) : [];
    }

    updateHistoryDisplay() {
        const history = this.getTradeHistory();
        const historyList = document.getElementById('tradeHistoryList');

        if (history.length === 0) {
            historyList.innerHTML = '<div class="no-history">You don\'t have a trade history yet</div>';
            return;
        }

        historyList.innerHTML = history.slice(0, 10).map(trade => `
            <div class="history-item ${trade.profit > 0 ? 'win' : trade.profit < 0 ? 'loss' : 'tie'}">
                <div class="history-asset">${trade.asset}</div>
                <div class="history-direction">${trade.direction.toUpperCase()}</div>
                <div class="history-stake">₹${trade.stake}</div>
                <div class="history-result">${trade.profit > 0 ? '+' : ''}₹${trade.profit.toFixed(2)}</div>
                <div class="history-time">${trade.timestamp}</div>
            </div>
        `).join('');
    }

    // Navigation Setup
    setupNavigation() {
        // Update sidebar menu items to match Quotex
        const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
        menuItems.forEach((item, index) => {
            const icons = ['fas fa-chart-line', 'fas fa-headset', 'fas fa-user', 'fas fa-trophy', 'fas fa-ellipsis-h'];
            const texts = ['Trade', 'Support', 'Account', 'Tournaments', 'More'];

            item.innerHTML = `
                <i class="${icons[index]}"></i>
                ${texts[index]}
            `;
        });
    }

    // Price Engine
    startPriceEngine() {
        // Enhanced price simulation with more realistic movement
        setInterval(() => {
            this.updatePrice();
        }, 2000 + Math.random() * 3000); // 2-5 second intervals
    }

    updatePrice() {
        const data = assetData[currentAsset];
        const volatility = data.volatility;

        // Add trend + randomness
        const trend = Math.random() > 0.5 ? 1 : -1;
        const randomChange = (Math.random() - 0.5) * volatility * 0.1;
        const trendChange = trend * volatility * 0.05;

        const change = randomChange + trendChange;
        price += change;

        // Update current candle
        if (currentCandle) {
            currentCandle.high = Math.max(currentCandle.high, price);
            currentCandle.low = Math.min(currentCandle.low, price);
            currentCandle.close = price;
        }

        // Update display
        updatePriceDisplay();
        drawCandles();

        // Update asset prices in sidebar
        this.updateAssetPrices();
    }

    updateAssetPrices() {
        Object.keys(assetData).forEach(symbol => {
            const data = assetData[symbol];
            const change = (Math.random() - 0.5) * data.volatility * 0.1;
            data.price += change;

            const priceElement = document.getElementById(symbol.toLowerCase().replace('/', '') + '-price');
            const changeElement = document.getElementById(symbol.toLowerCase().replace('/', '') + '-change');

            if (priceElement) {
                priceElement.textContent = this.formatPrice(data.price, symbol);
            }
            if (changeElement) {
                const changePercent = (change / data.price) * 100;
                changeElement.textContent = `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
                changeElement.className = `asset-change ${changePercent > 0 ? 'positive' : 'negative'}`;
            }
        });
    }

    formatPrice(price, symbol) {
        if (symbol.includes('JPY')) return price.toFixed(2);
        if (symbol.includes('BTC') || symbol.includes('ETH')) return price.toFixed(0);
        return price.toFixed(4);
    }
}

// Deposit/Withdraw Enhancements
function enhanceDepositWithdraw() {
    // Update deposit button to green
    const depositBtn = document.getElementById('depositBtn');
    depositBtn.className = 'btn-primary';
    depositBtn.textContent = 'Deposit';

    // Update withdraw button styling
    const withdrawBtn = document.getElementById('withdrawBtn');
    withdrawBtn.className = 'btn-secondary';

    // Enhanced deposit modal
    document.getElementById('depositBtn').addEventListener('click', () => {
        const modal = document.getElementById('depositModal');
        modal.querySelector('.modal-text').innerHTML = `
            <p>Demo wallet connection required.</p>
            <p>This will redirect to Trust Wallet for demo purposes only.</p>
            <p><strong>No real funds will be transferred.</strong></p>
        `;
        modal.classList.add('show');
    });

    // Enhanced withdraw modal
    document.getElementById('withdrawBtn').addEventListener('click', () => {
        const modal = document.getElementById('withdrawModal');
        modal.querySelector('.modal-text').innerHTML = `
            <p>Demo withdrawal simulation.</p>
            <p>This will redirect to Trust Wallet for demo purposes only.</p>
            <p><strong>No real funds will be transferred.</strong></p>
        `;
        modal.classList.add('show');
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quotexDemo = new QuotexDemoLogic();
    enhanceDepositWithdraw();

    // Update history display initially
    window.quotexDemo.updateHistoryDisplay();
});

// Add to global scope for access from HTML
window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('show');
};

window.simulateDeposit = function() {
    window.open('https://trustwallet.com/', '_blank');
    closeModal('depositModal');
    setTimeout(() => {
        alert('Demo funds added! ₹100,000 has been credited to your account.');
        window.quotexDemo.updateBalance(100000);
    }, 2000);
};

window.simulateWithdraw = function() {
    window.open('https://trustwallet.com/', '_blank');
    closeModal('withdrawModal');
    setTimeout(() => {
        alert('Demo withdrawal processed. Funds remain in your demo account.');
    }, 2000);
};
