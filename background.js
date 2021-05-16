function update(){
    chrome.storage.sync.get(['state','rules'], function(data) {
        if (typeof data.state === 'undefined'){
            rules = {rules: 'lumendatabase.org', host: '127.0.0.1', port: '8080'};
            chrome.storage.sync.set({rules: rules,state: 0}, update);
            return;
        }
        
        chrome.browserAction.setBadgeText({ text: (data.state ? "" : "OFF") });
        
        if (data.state){
            var script = "function FindProxyForURL(url, host) { ";
            script += "host = host.toLowerCase(); ";
            addr = data.rules.host + ":" + data.rules.port;
            
            data.rules.rules.split("\n").forEach(function(rule) {
                rule = rule.trim();
                if (rule == "") return;
                if (rule.substr(0, 1) == "="){
                    rule = rule.substr(1);
                    script += "if (host == '" + rule + "')" ;
                }else{
                    script += "if (dnsDomainIs(host, '." + rule + "') ";
                    script += "|| host == '" + rule + "')" ;
                }
                script += " return 'PROXY " + addr + "'; ";
            });
            
            script += "return 'DIRECT'; }"
            var config = {mode: "pac_script", pacScript: {data: script}}
            chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {});
            console.log("config:\n" + script);
        }else if(typeof arguments[0] !== 'string'){
            chrome.proxy.settings.set({value: {mode: 'direct'}, scope: 'regular'}, function() {});
        }
    });
}

function toggle(){
    chrome.storage.sync.get('state', function(data) {
        chrome.storage.sync.set({state: !data.state}, update);
    });
}

chrome.browserAction.onClicked.addListener(toggle);
chrome.runtime.onStartup.addListener(function() { update('onLoad'); });
chrome.runtime.onInstalled.addListener(function() { update('onReload'); });
chrome.runtime.onMessage.addListener(function (request) {
    switch(request.cmd){
        case 'get': 
            chrome.storage.sync.get(['rules','state'], function(data){ 
                chrome.runtime.sendMessage(data); 
            });
            break;
        case 'set': 
            chrome.storage.sync.set({rules: request.rules}, update); 
            break;
        case 'toggle':
            toggle();
            break;
    }
});

