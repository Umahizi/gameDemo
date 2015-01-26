(function() {
  //game resources loader 
    var resources = {};
    callback = {};

    function load(srcList) {
        srcList.forEach(function(srcList) {
            setResources(srcList);
        });
    }

    function setResources(srcList) {
        var img = new Image;
        img.onload = function() {
            resources[srcList] = img;
            if (isReady()) {}
        };
        resources[srcList] = false;
        img.src = srcList;
    }

    function get(srcList) {
        return resources[srcList];
    }

    function isReady() {
        var ready = true;
        for (var res in resources) {
            if (!resources[res]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        callbacks = func;
    }

    window.resources = {
        load: load,
        get: get,
        onReady: onReady
    };

})();
