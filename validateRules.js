var Validations = function(element,re){

    var vels={};
    var cx = element.getElementsByClassName('validate');
    function model2Path(model) {
        return model.replace(/\./g, '\/').replace(/\[/g, '/').replace(/\]/g, '')
    }

    for (var i = 0; i < cx.length; i++) {

        var vElement = cx[i];
        var id = vElement.getAttribute('validate-rule-id');
        var ri=model2Path(vElement.getAttribute('ruleset-instance'));
        var messageSlots = vElement.getElementsByClassName("validate-message");
        var messageSlot;
        if(messageSlots && messageSlots.length>0)
            messageSlot = messageSlots[0];
        else messageSlot = vElement;
        vels[ri]=vels[ri] || {};
        vels[ri][id] = messageSlot;

    }
    function updateMessage(ipath, ruleId, flag, message)
    {
        var el = vels[ipath][ruleId];
        if(!el)return;
        if(flag){
            el.innerHTML = '';
        }
        else el.innerHTML = message;
    }
    element.addEventListener('VALIDATION_ERROR',function(e){
        console.log("caught val error!")
        updateMessage(e.detail.context.ipath, 'e1_more_than_500',!e.detail.context.result,e.detail.data)
    })

}