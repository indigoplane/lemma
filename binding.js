function Binding(element,data) {
    var elmap = {};
    function setval(el, model) {
        var valueFn = compile(model);
        el.value = valueFn(data)
        // el.valueFn = valueFn;

    }
    function getObj(path){
        if(!path || path.trim().length==0)return data;
        return compile(path)(data);
    }
    function bind(id) {
        var el = document.getElementById(id);
        var model = el.getAttribute("model");
        var parts = model.split('.');
        var objpath = '';
        for (var i = 0; i < parts.length - 1; i++) {
            objpath += (i > 0 ? '.' : '') + parts[i];

        }
        var prop = parts[parts.length - 1];
        setval(el, model);
        var obj = getObj(objpath);
        var path = modelToPath(model)
        elmap[path] = elmap[path] || []
        elmap[path].push({
            set: function (proxy,target) {
                //if(obj != target){
                //    obj=target;
                //}
                if (!obj || obj != proxy) {
                    obj = getObj(objpath);;
                }
                var val = obj[prop];
                if(typeof val === 'object'){
                    val = JSON.stringify(val)
                }
                if (el.value != val)
                    el.value = val;
            },
            get: function () {
                return el.value;
            }
        });
        el.onchange = function () {
            obj[prop] = el.value;
        }

        return el;
    }

    function bindAll() {
        var bels = element.getElementsByClassName('observe');
        for (var i = 0; i < bels.length; i++) {
            var el = bels[i];
            bind(el.getAttribute('id'))

        }
    }

    function update(proxy, target,path) {

        if (elmap[path]) {
            var objs = elmap[path];
            for (var i = 0; i < objs.length; i++) {
                objs[i].set(proxy,target);
            }
        }

    }

    bindAll();

    return{
        update:update
    }
}