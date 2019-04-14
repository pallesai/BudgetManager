$(function(){

    chrome.storage.sync.get(['total', 'limit'], function(budget){
        $('#total').text(budget.total);
        $('#limit').text(budget.limit);
    });

    $('#spend').click(function(){
        chrome.storage.sync.get(['total', 'limit'] , function(budget){
            var newTotal = 0;
            var amount = $("#amount").val();

            if(budget.total) {
                newTotal += parseInt(budget.total);
            }
            if(amount) {
                newTotal += parseInt(amount);
            }
            
            chrome.storage.sync.set({'total' : newTotal}, function(){
                if(amount && newTotal >= budget.limit) {
                    var notification = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: 'Limit breached',
                        message: "Uh Oh! Limit reached!"
                    };
                    chrome.notifications.create('limitNotif', notification, function callback() {
                        if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                        } 
                    });
                }
            });

            $('#total').text(newTotal);
            $('#amount').val('');
        });
    });
})