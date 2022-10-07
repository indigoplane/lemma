function evaluate(expression){
    var oldValue;
    return {
        ex:expression,
        check:function(ctx){
            var result,oldResult;
            if(!_.isObject(ctx.data)){
                var oldResult = compile(expression)({data:ctx.oldData});
                var result = compile(expression)({data:ctx.data});
            }
            else {
                var oldResult = compile(expression)(ctx.oldData);
                var result = compile(expression)(ctx.data);
            }
            return result && (oldResult != result);
        }
    }
}
Rules.registerCondition({
    name: "evaluate",
    description: "check if expression is true",
    factory: function (data) {
        return  evaluate(data.expression)
    }
});

function onchange(expression){
     return {
        ex:expression,
        check:function(ctx){
            var oldResult = compile(expression)(ctx.oldData);
            var result =compile(expression)(ctx.data);
            return (oldResult != result) ;
        }
    }
}
Rules.registerCondition({
    name: "onchange",
    description: "check if expression value has changed",
    factory: function (data) {
        return  onchange(data.expression)
    }
});

function onevent(eventName, rule ,re){
    re.subscribeToEvent(eventName,rule)
    return {
        //check only called if rule is already in queue of activated rules..
        //always returns true since if its in queue => event happened
        check:function(){
           return false;
        }
    }
}
Rules.registerCondition({
    name: "onevent",
    description: "check if event occured",
    factory: function (data, rule, re) {
        return onevent(data.eventName, rule, re)
    }
});
function validate(expression){
    return {
        ex:expression,
        check:function(ctx){
            var oldResult = compile(expression)(ctx.oldData);
            var result =compile(expression)(ctx.data);
            return {execute:(oldResult != result), value: result };
        }
    }
}
Rules.registerCondition({
    name: "validate",
    description: "validate",
    factory: function (data) {
        return  validate(data.expression)
    }
});
