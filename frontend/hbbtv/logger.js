(function() {
    var url = "/log";

    window.console.log = function (msg) {
        if (!url) {
            return;
        }
        $.ajax(url, {
            dataType: 'json',
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: msg
        })
    };
})();