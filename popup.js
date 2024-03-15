const setBtn = document.getElementById("setBtn");
const resetBtn = document.getElementById("resetBtn");


chrome.tabs.query({active: true}, function (tabs) {
    var tab = tabs[0];
    if (tab) {
        checkExchangeStatus(tab, setBtn);
    } else {
        alert("Нет активных вкладок")
    }
})
setBtn.addEventListener("click", () => {
    setBtn.classList.add("disable")
    chrome.tabs.query({active: true}, function (tabs) {
        var tab = tabs[0];
        if (tab) {
            setUSD(tab, setBtn);
        } else {
            alert("Нет активных вкладок")
        }
    })
})
resetBtn.addEventListener("click", () => {
    setBtn.classList.remove("disable")
    chrome.tabs.query({active: true}, function (tabs) {
        var tab = tabs[0];
        if (tab) {
            resetUSD(tab);
        } else {
            alert("There are no active tabs")
        }
    })
})

function checkExchangeStatus(tab, setBtn) {
    chrome.scripting.executeScript(
        {
            target: {tabId: tab.id, allFrames: false},
            args: [setBtn],
            func: checkExchangeStatusScript,
        },
    )
}

function setUSD(tab) {
    var rate = document.querySelector("input").value
    chrome.scripting.executeScript(
        {
            target: {tabId: tab.id, allFrames: false},
            args: [rate],
            func: setUsdScript,
        },
    )
}

function resetUSD(tab) {
    chrome.scripting.executeScript(
        {
            target: {tabId: tab.id, allFrames: false},
            func: resetUsdScript,
        },
    )
}

function checkExchangeStatusScript(setBtn) {
    //TODO not get setBtn variable
    const availableExchange = document.getElementById('invisibleCheckbox')
    if (availableExchange?.value) setBtn.classList.add("disable")
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
        input.value = input.value + item.innerText + ", "
    })
    Array.prototype.slice.call(document.getElementsByClassName('a-card__price')).forEach(item => item.innerText = numberWithSpaces(Math.round(parseInt(item.innerText.replace(/\D/g, '')) / rate) + ' $'));

}

function resetUsdScript() {
    const oldValues = document.getElementById('invisibleInput')
    const availableExchange = document.getElementById('invisibleCheckbox')
    const massWithOldValues = oldValues?.value.slice(0, -2).split(', ')
    if (oldValues) Array.prototype.slice.call(document.getElementsByClassName('a-card__price')).forEach((item, index) => item.innerText = massWithOldValues[index]);
    oldValues?.remove()
    availableExchange?.remove()
}
