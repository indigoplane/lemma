var Rules = (function () {
    var conditions = {}, actions = {};

    function RulesEngine(element, data, rawdata, rulesetsdata,config) {

        var queue = [];
        var self = this;
        var rulesets = {}
        var eventSubscribers={};
        var components;
        var oldValues= _.cloneDeep(rawdata);
        var changes;

        document.addEventListener('watch.changes', function (e) {
            changes = changes || [];
            changes = changes.concat(e.detail);
           // console.log("watch changes rules")

        }, false);

        function init(){
            _.forOwn(rulesetsdata, function (rulesetdata, key) {
                rulesets[key] = Ruleset(rulesetdata, self);
            })

            components = Components(rulesetsdata, data, oldValues);
        }
        function updateOldValues(){
            //console.log("ov before :"+JSON.stringify(oldValues))
            _.each(changes,function(change){
                console.log("update old "+change.path)
                var pathArray = change.path.split('/');
                _.set(oldValues,pathArray,change.target[change.key]);
            })
            //console.log("ov after :"+JSON.stringify(oldValues))
        }
       function evaluateC(component) {
            var ruleset = rulesets[component.rulesetstr];
            var data = component.data
            var oldData = component.oldData;
            _.each(ruleset, function (rule) {
                //check condition
                var retval = rule.evaluate(component);

                if (retval.execute || (retval===true)) {
                    component.result = retval.value || null;
                    queue.push({rule: rule, component:component})
                }
            })

        }
        function runAllEnqueued(q){
            changes = [];

                setTimeout(function(){runNext(q)},0)
        }
        function runNext (q) {
            if(q.length==0)return;
            var ruleCtx = q.pop();
            var rule = ruleCtx.rule;
            var component = ruleCtx.component;
            if (rule && rule.run)
                rule.run(component);

            updateOldValues();
            runAllEnqueued(q);
        }


        this.evaluate = function (paths) {

            var changed = {};
            if (!paths) {
                changed = components.all();
            }
            else {
                _.each(paths, function (path) {
                    var component = components.get(path);
                    //provide it with old data
                    //component.oldData = compile(component.path)
                    if(component) {
                        component.config = config;
                        changed[component.path] = component;
                    }
                })
            }

            _.forOwn(changed, function (component) {
                evaluateC(component);
            })

        }

        this.subscribeToEvent=function(eventName,rule){
            eventSubscribers[eventName] = eventSubscribers[eventName] || [];
            eventSubscribers[eventName].push(rule);
        }

        this.fireEvent=function(eventName, context, eventData, internal,external){
            //if(internal) {
                var subscribers = eventSubscribers[eventName];
                _.each(subscribers, function (subscriber) {
                    queue.push({rule: subscriber, eventData: eventData, component: context})
                })
            //}
            //if(external){
                element.dispatchEvent(new CustomEvent(eventName,{detail:{data:eventData,context:context}}))
            //}
        }

        this.runAll = function () {
            runAllEnqueued(queue);

        }
        this.getOldValue =function(path){
            return _.get(oldValues,path);
        }
        this.destroy=function(){
            components.destroy();
            queue=null;
            rulesets=null;
            eventSubscribers=null;
            oldValues=null;
            changes=null;
        }

        init();


    }


    return {
        createEngine: function (element, data, rawdata, rulesetsdata, config) {
            return new RulesEngine(element, data, rawdata, rulesetsdata, config)
        },
        registerAction: function (description) {
            actions[description.name] = description;

        },
        registerCondition: function (description) {
            conditions[description.name] = description;
        },
        getCondition: function (name) {
            return conditions[name];
        },
        getConditions: function(){
          return conditions;
        },
        getAction: function (name) {
            return actions[name];
        },
        getActions: function (name) {
            return actions;
        }

    }
})();

var Ruleset = function (ruleset, re) {
    var rules = [];
    _.each(ruleset.rules, function (ruledata) {
        var ri = rule(ruledata, re)
        rules.push(ri);
    })
    return rules;
}