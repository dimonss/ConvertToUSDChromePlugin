function convertPricesOnPage(rate) {
    if (document.getElementById('invisibleCheckbox')) return; // Already converted

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
    
    const parent = document.body;
    if (parent) {
        parent.appendChild(input);
        parent.appendChild(availableExchange);
    }

    const priceElements = document.getElementsByClassName('a-card__price');
    Array.prototype.slice.call(priceElements).forEach(item => {
        input.value = input.value + item.innerText + ", ";
    });
    Array.prototype.slice.call(priceElements).forEach(item => {
        const numericPrice = parseInt(item.innerText.replace(/\D/g, ''));
        if (!isNaN(numericPrice)) {
            item.innerText = numberWithSpaces(Math.round(numericPrice / rate)) + ' $';
        }
    });
}

chrome.storage.local.get(['autoConvert', 'exchangeRate'], (result) => {
    const autoConvert = result.autoConvert !== false;
    const rate = result.exchangeRate || 455;
    if (autoConvert) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => convertPricesOnPage(rate));
        } else {
            convertPricesOnPage(rate);
        }
    }
});
