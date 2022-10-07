function action(expression){
    return{
        execute:function(ctx){
            console.log("execute "+expression)
            compile(expression)(ctx.data,ctx.config);
            return true;
        }

    }
}
Rules.registerAction({
    name: "execute",
    description: "execute expression ",
    factory: function (data) {
        return action(data.expression)
    }
});

function fireEventAction(eventName,bInternal,bExternal,rule,re){
    return{
        execute:function(ctx){
            console.log("dispatched "+eventName)
            re.fireEvent(eventName, ctx, null,bInternal,bExternal)
            return true;
        }
    }
}
Rules.registerAction({
    name: "fireEvent",
    description: "fire event",
    factory: function (data,rule, re) {
        return fireEventAction(data.eventName,data.internalEvent,data.externalEvent,rule, re)
    }
});
function fireValidateEventAction(eventName,message,bInternal,bExternal, rule,re){
    return{
        execute:function(ctx){
            console.log("dispatched "+eventName)
            re.fireEvent(eventName, ctx, message, bInternal,bExternal)
            return true;
        }
    }
}
Rules.registerAction({
    name: "fireValidateEvent",
    description: "fire validate event",
    factory: function (data,rule, re) {
        return fireValidateEventAction(data.eventName, data.message,data.internalEvent, data.externalEvent, rule, re)
    }
});
