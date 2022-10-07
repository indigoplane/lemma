function rule(ruledata, re) {

    var actions = [];

    var ruleobj = {
        evaluate: function (ctx) {
            return condition.check(ctx);


        },
        run: function (ctx) {
            var val;
            //if (val = condition.check(data,oldValue)) {
            _.each(actions, function (action) {
                if (!action.execute(ctx))
                    throw 'failed'
                //if (condition.reset) condition.reset();
            })
            //}

        }
    }
    _.each(ruledata.actions, function (action) {

        actions.push(Rules.getAction(action.name).factory(action.data, ruleobj, re));

    })
    var condition;
    if(ruledata.condition && ruledata.condition.name)
    {
        var cf = Rules.getCondition(ruledata.condition.name);
        if(cf && cf.factory) condition = cf.factory(ruledata.condition.data, ruleobj, re);
    }


    return ruleobj;
}
