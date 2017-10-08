var Scene = Base.extend({
    fillStyle:"green",//背景
    scaleX:1,//横向缩放角度
    scaleY:1,//纵向缩放角度
    translateX:0,//横向偏移
    translateY:0,//纵向偏移
    wheelZoom:0.95,//鼠标缩放速度
    dragEnable:true,//鼠标是否可以拖拽更改偏移量
    text:null,
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


        if(this.text) {
            ctx.save();
            ctx.textBaseline = "top";
            ctx.font = "15px Arial";
            ctx.fillText(this.text, 10, 10);
            ctx.restore();
        }


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
           this._elements.push(arguments[i]);
        }

        this._elements.sort(function(a,b){
            return a.z_index-b.z_index;
        })


    }

});