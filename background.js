importScripts('config.js');

async function fetchAndSaveRate() {
    const authToken = typeof CONFIG !== 'undefined' ? CONFIG.API_AUTH_TOKEN : '';
    if (!authToken) {
        console.warn("Authorization token is missing. Please define CONFIG.API_AUTH_TOKEN in config.js");
        return;
    }
    try {
        const response = await fetch('https://chalysh.pro/shop/api/exchange_rates/', {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'authorization': authToken
            }
        });
        if (response.ok) {
            const result = await response.json();
            if (result && result.data && Array.isArray(result.data)) {
                const usdToKzt = result.data.find(item => item.currency === 'USD' && item.toCurrency === 'KZT');
                if (usdToKzt && usdToKzt.sell) {
                    await chrome.storage.local.set({ exchangeRate: usdToKzt.sell });
                    console.log("Background exchange rate updated successfully:", usdToKzt.sell);
                }
            }
        }
    } catch (e) {
        console.error("Failed to fetch exchange rate in background:", e);
    }
}

// On install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['autoConvert', 'exchangeRate'], (result) => {
        if (result.autoConvert === undefined) {
            chrome.storage.local.set({ autoConvert: true });
        }
        if (result.exchangeRate === undefined) {
            chrome.storage.local.set({ exchangeRate: 455 });
        }
    });
    fetchAndSaveRate();
});

// On startup
chrome.runtime.onStartup.addListener(() => {
    fetchAndSaveRate();
});

// Refresh rate when user opens kolesa.kz page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && (tab.url.includes('kolesa.kz'))) {
        fetchAndSaveRate();
    }
});
