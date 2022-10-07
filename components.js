function ComponentsFromHtml(element, data) {

    var components = {};

    function Component(rulesetstr, data, path, model) {
        var self = this;
        self.rulesetstr = rulesetstr;
        self.data = data;
        self.path = path;
        self.model = model;

    };


    var cx = document.getElementsByClassName('component');
    for (var i = 0; i < cx.length; i++) {
        var rulesetstr = cx[i].getAttribute('ruleset');
        var rulesdatastr = cx[i].getAttribute('rulesdata');
        var rulesdata = compile(rulesdatastr)({data: data});
        var path = modelToPath(rulesdatastr)
        var c = new Component(rulesetstr, rulesdata, path, rulesdatastr);

        components[path] = c;

    }

    return {
        get: function (path) {

            var len = -1;
            var keys = Object.keys(components);
            var match;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (path.startsWith(key)) {
                    var strlen = keys[i].length || 0;
                    if (strlen > len) {
                        match = keys[i];
                        len = strlen;
                    }
                }

            }
            return components[match];

        },
        all: function () {
            return components;
        }
    }

}

function Components(rulesets, data,oldData) {

    var components = {};

    function c2(rulesetstr, model) {
        var self = this;
        self.rulesetstr = rulesetstr;
        self.modelstr = model;
        self.path = model2Path(model);
        self.pathRegex = path2Regx(self.path);

    };

    _.each(rulesets, function (ruleset, key) {

        var comp = new c2(key, ruleset.model);
        components[comp.path] = comp;

    })

    function model2Path(model) {
        return model ? model.replace(/\./g, '\/').replace(/\[/g, '/[') : '';
    }

    function path2Regx(path) {
        return path.replace(/\[i\]/g, '([0-9]*)')
    }

    function getData(obj,path,regex) {
        var i = 0;
        if(!path || path.trim().length==0) return obj;
        var matches = path.match(regex);
        /*var xy = model.replace(/\[i\]/g, function (match, offset, strs) {
            i++;
            return '[' + matches[i] + ']';
        });*/

        if(matches && matches[0])
        {
            var pathArray = matches[0].split('/');
            return _.get(obj,pathArray)
        }
        //compile(xy)(obj);
        return null;
    }

    return {
        get: function (path) {

            var len = -1;
            var keys = Object.keys(components);
            var match,ipath;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if(!key || key.trim().length==0){
                    match=key;
                    ipath='';
                    len=0;
                }
                else {
                    var matches = path.match(components[key].pathRegex)
                    if (matches && matches[0]) {
                        var strlen = matches[0].length || 0;
                        if (strlen > len) {
                            match = key;
                            ipath = matches[0];
                            len = strlen;

                        }
                    }
                }

            }
            var c = components[match];
            if(!c) return null;
            var newData = getData(data,ipath,c.pathRegex);
            var oldDataObj = getData(oldData,ipath,c.pathRegex);
            var ci = _.assign({data: newData,oldData:oldDataObj,ipath:ipath}, c);
            return ci;

        },
        all: function () {
            return components;
        },
        destroy:function(){
            components=null;
        }
    }

}

//y\/([0-9]*)\/([0-9]*)