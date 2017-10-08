var Element = Base.extend({
    visible:true,
    dragEnable:true,//是否可以拖拽
    paintTooltip:function(ctx){

    },
    paintFocus:function(ctx){

    },
    paintSelected:function(ctx){

    },
    inBound:function(pointX,pointY){
        return false;
    }
});