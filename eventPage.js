var contextMenuItem = {
    "id": "spendMoney",
    "title": "Spend Money",
    "contexts": ["selection"]
};

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value,10));
}

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickedData){
    if(clickedData.menuItemId == "spendMoney" && clickedData.selectionText) {
        if(isInt(clickedData.selectionText)) {
            chrome.storage.sync.get(['total', 'limit'], function(budget) {
                var newTotal = 0;
                if(budget.total) {
                    newTotal += parseInt(budget.total);
                }
                newTotal += parseInt(clickedData.selectionText);
                chrome.storage.sync.set({'total': newTotal}, function(budget){
                    if(newTotal >= budget.limit) {
                        var notification = {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: 'Limit breached',
                            message: "Uh Oh! Limit reached!"
                        };
                        chrome.notifications.create('limitNotif', notification);
                    }
                });
            });
        }
    }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({'text': changes.total.newValue.toString()});
})