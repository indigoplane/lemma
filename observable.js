
var watch = function (data, datapath) {
    var targets = [];
    var proxies = [];
    var paths = [];

    function addToMap(proxy, obj, path) {
        paths.push(path);
        targets.push(obj);
        proxies.push(proxy);

    }

    function getPath(obj) {
        var index = targets.indexOf(obj);
        if (index >= 0)
            return paths[index];


        return "";
    }
    function getFullPath(path,key){
        //console.log("getfullpath:"+path+","+key)
        if(!path)path='';
        if(path && path.trim().length>0){
            path += "/";
        }
        if(typeof key === 'string')
            path += key;
        return path
    }
    function getProxy(obj,path) {
        var index = targets.indexOf(obj);
        var proxy;
        if (index > -1)
            proxy = proxies[index];
        else {
            proxy = new Proxy(obj, handler)
            addToMap(proxy, obj, path)

        }
        return proxy;
    }

    function deepAssign(reciever,target, key, value,path,fnstack) {
        target[key] = value;
        var proxy = getProxy(value,path);
        var keys = Object.keys(value);
        var path2;
        for (var i = 0; i < keys.length; i++) {
            path2 = getFullPath(path,keys[i]);

            if (typeof value[keys[i]] === 'object') {
                 deepAssign(proxy,value, keys[i], value[keys[i]],path2,fnstack);
            }
            else {
                fnstack.push({proxy:proxy, target: value, key: keys[i], path: path2});

            }

        }

        fnstack.push({proxy:reciever, target: target, key: key, path: path})



    }


    var handler = {
        get: function (target, key, reciever) {
            //if (target == data)
            //    path = datapath;
            var index=proxies.indexOf(reciever);
            var path = paths[index];

            path = getFullPath(path, key);
            if (target[key] !== null && typeof target[key] === 'object' ) {
                return getProxy(target[key],path);
            }
            //disable creates on get => messes with angular etc-> solution->make a seperate proxy/handler if this functionality is needed
             /*if(enableCreateOnGet && !target[key]) {
                target[key]={}
                getProxy(target[key],path)
                return;
            }*/
            return target[key] ? target[key] : null;
        },
        set: function (target, key, value,reciever) {
            var index=proxies.indexOf(reciever);
            var path = paths[index];

            path = getFullPath(path, key);

            //for rule ctx

            if (value == target[key]) return true;
            var changes=[];
            var oldValue = target[key];
            if (typeof value === 'object') {
                deepAssign(reciever,target, key, value,path,changes);
                _.each(changes,function(fnx){
                    fnx();
                })

            }
            else target[key] = value;
            changes.push({proxy:reciever,target: target, key: key, path: getFullPath(getPath(target),key), oldValue:oldValue})
            document.dispatchEvent(new CustomEvent('watch.changes', {detail:changes}))

            return true;
        }
    }
    var proxy = getProxy(data,datapath)
    return proxy;
}
