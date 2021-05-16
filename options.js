chrome.runtime.onMessage.addListener(function (answer) { 
    document.getElementById('rules').value = answer.rules.rules; 
    document.getElementById('host').value = answer.rules.host; 
    document.getElementById('port').value = answer.rules.port;

    toggle = document.getElementById('toggle');
    //toggle.innerHTML = (answer.state ? "Disable" : "Enable");
    toggle.innerHTML = "On / Off"
    if (answer.state)
        toggle.classList.add("disabled");
});

document.getElementById('save').addEventListener('click', function(){
    chrome.runtime.sendMessage({cmd: 'set', rules: { 
        rules: document.getElementById('rules').value,
        host: document.getElementById('host').value,
        port: document.getElementById('port').value
    }});
    
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() { status.textContent = ''; }, 750);
});

document.addEventListener('DOMContentLoaded', function(){
    chrome.runtime.sendMessage({cmd: 'get'});
});

document.getElementById('toggle').addEventListener('click', function(){ 
    chrome.runtime.sendMessage({cmd: 'toggle'});
    window.close();
});

