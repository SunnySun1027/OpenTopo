var Scene = Base.extend({
    fillStyle:"green",
//    _elements:[],
    scaleX:1,//横向缩放角度
    scaleY:1,
    translateX:0,
    translateY:0,
    wheelZoom:0.95,
    dragEnable:true,
    init:function(stage){
        if(stage){
            stage.curScene = this;
        }

        this._elements = [];
    },
    paint:function(ctx){
        var canvas = ctx.canvas;

        ctx.save();

        //#region 设置背景
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.restore();
        //#endregion

        //位移
        ctx.translate(this.translateX,this.translateY);

        //#region 中心缩放
        ctx.translate(canvas.width/2-this.translateX,canvas.height/2-this.translateY);
        ctx.scale(this.scaleX,this.scaleY);
        ctx.translate(-canvas.width/2+this.translateX,-canvas.height/2+this.translateY);
        //#endregion



        for(var i=0;i<this._elements.length;i++){
            var ele = this._elements[i];
            ele.paint(ctx);

            //鼠标焦点
            if(ele == this.focus){
                ele.paintFocus(ctx);
            }

            //气泡
            if(ele.tooltipText && (ele==this.focus || ele.tooltipAlway)){
                ele.paintTooltip(ctx);
            }
            //被选择
            if(ele.selected){
                ele.paintSelected(ctx);
            }
        }

        ctx.restore();
    },
    //ele...
    add:function(){
        for(var i in arguments){
            if(arguments[i].elementType=="link"){
                this._elements.push(arguments[i]);
            }
        }
        for(var i in arguments){
            if(arguments[i].elementType=="node"){
                this._elements.push(arguments[i]);
            }
        }

    }

});