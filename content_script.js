(function() {
    var extensionURL = browser.runtime.getURL('alert.html');
    checkUrl();

    // checkUrl checks if given URL is in our block list
    function checkUrl() {
        var url = window.location.origin;
        getList(function(data) {
             if(data.includes(url))
                window.location.href = extensionURL;
        });
    }

    // getList retrives block list from local or remote storage
    function getList(callback) {
        var cached = browser.storage.local.get("data");
        cached.then(function(items){
            if(items.data){
                // data is in local storage
                callback(items.data);
                return;
            }
            // no data in local storage, fetch from remote
            remoteList();
        });

        var remoteList = function() {
            var xmlHttp = getXMLHttp();
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var data = JSON.parse(xmlHttp.responseText);
                    browser.storage.local.set({data})
                    callback(data);   
                }     
            }
            xmlHttp.open("GET", "https://raw.githubusercontent.com/MarinX/ScamBlock-Data/master/data.json", true); 
            xmlHttp.send(null);
        }
    }

    // getXMLHttp is wrapper for native XMLHttp request
    function getXMLHttp(){
        try {
           return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
        } catch(evt){
           return new XMLHttpRequest();
        }
     }

    

})();