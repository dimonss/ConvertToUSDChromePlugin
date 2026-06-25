const setBtn = document.getElementById("setBtn");
const resetBtn = document.getElementById("resetBtn");
const rateInput = document.getElementById("rateInput");
const rateStatus = document.getElementById("rateStatus");

// Fetch exchange rate on load
fetchExchangeRate();

// Check initial status on active tab
async function init() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            await checkExchangeStatus(tab);
        } else {
            console.warn("No active tab found");
        }
    } catch (e) {
        console.error("Initialization error:", e);
    }
}
init();

setBtn.addEventListener("click", async () => {
    setBtn.classList.add("disable");
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            await setUSD(tab);
        } else {
            alert("No active tab found");
        }
    } catch (e) {
        console.error("Error in convert button click:", e);
        setBtn.classList.remove("disable");
    }
});

resetBtn.addEventListener("click", async () => {
    setBtn.classList.remove("disable");
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            await resetUSD(tab);
        } else {
            alert("There are no active tabs");
        }
    } catch (e) {
        console.error("Error in reset button click:", e);
    }
});

async function fetchExchangeRate() {
    if (rateStatus) {
        rateStatus.textContent = "Updating...";
        rateStatus.style.color = "var(--accent)";
    }
    
    const authToken = typeof CONFIG !== 'undefined' ? CONFIG.API_AUTH_TOKEN : '';
    if (!authToken) {
        handleFetchError("Authorization token is missing. Please define CONFIG.API_AUTH_TOKEN in config.js");
        return;
    }

    try {
        const response = await fetch('https://chalysh.pro/shop/api/exchange_rates/', {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'expires': '0',
                'authorization': authToken
            }
        });
        if (!response.ok) {
            handleFetchError(`HTTP error! status: ${response.status}`);
            return;
        }
        const result = await response.json();
        if (result && result.data && Array.isArray(result.data)) {
            const usdToKzt = result.data.find(item => item.currency === 'USD' && item.toCurrency === 'KZT');
            if (usdToKzt && usdToKzt.sell) {
                rateInput.value = usdToKzt.sell;
                if (rateStatus) {
                    rateStatus.textContent = "Auto-updated";
                    rateStatus.style.color = "var(--accent-2)";
                }
            } else {
                handleFetchError("USD to KZT rate not found in API response");
            }
        } else {
            handleFetchError("Invalid API response format");
        }
    } catch (error) {
        handleFetchError(error);
    }
}

function handleFetchError(error) {
    console.error("Failed to fetch exchange rate:", error);
    if (rateStatus) {
        rateStatus.textContent = "Offline (using default)";
        rateStatus.style.color = "var(--danger)";
    }
}

async function checkExchangeStatus(tab) {
    try {
        const results = await chrome.scripting.executeScript(
            {
                target: {tabId: tab.id, allFrames: false},
                func: checkExchangeStatusScript,
            },
        );
        if (results && results[0] && results[0].result) {
            setBtn.classList.add("disable");
        }
    } catch (e) {
        console.error("Error checking exchange status:", e);
    }
}

async function setUSD(tab) {
    const rate = parseFloat(rateInput.value) || 455;
    await chrome.scripting.executeScript(
        {
            target: {tabId: tab.id, allFrames: false},
            args: [rate],
            func: setUsdScript,
        },
    );
}

async function resetUSD(tab) {
    await chrome.scripting.executeScript(
        {
            target: {tabId: tab.id, allFrames: false},
            func: resetUsdScript,
        },
    );
}

function checkExchangeStatusScript() {
    const availableExchange = document.getElementById('invisibleCheckbox');
    return !!availableExchange;
}

function setUsdScript(rate) {
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    const input = document.createElement("input");
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'invisibleInput');
    input.setAttribute('style', 'display: none');
    const availableExchange = document.createElement("input");
    availableExchange.setAttribute('type', 'checkbox');
    availableExchange.setAttribute('id', 'invisibleCheckbox');
    availableExchange.setAttribute('style', 'display: none');
    const parent = document.getElementsByTagName("body")[0];
    parent.appendChild(input);
    parent.appendChild(availableExchange);

    Array.prototype.slice.call(document.getElementsByClassName('a-card__price')).forEach(item => {
        input.value = input.value + item.innerText + ", ";
    });
    Array.prototype.slice.call(document.getElementsByClassName('a-card__price')).forEach(item => {
        const numericPrice = parseInt(item.innerText.replace(/\D/g, ''));
        if (!isNaN(numericPrice)) {
            item.innerText = numberWithSpaces(Math.round(numericPrice / rate)) + ' $';
        }
    });
}

function resetUsdScript() {
    const oldValues = document.getElementById('invisibleInput');
    const availableExchange = document.getElementById('invisibleCheckbox');
    if (oldValues) {
        const massWithOldValues = oldValues.value.slice(0, -2).split(', ');
        Array.prototype.slice.call(document.getElementsByClassName('a-card__price')).forEach((item, index) => {
            if (massWithOldValues[index]) {
                item.innerText = massWithOldValues[index];
            }
        });
    }
    oldValues?.remove();
    availableExchange?.remove();
}
