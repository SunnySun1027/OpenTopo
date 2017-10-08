var Scene = Base.extend({
    fillStyle:"green",
    _elements:[],
    scaleX:2,
    scaleY:2,
    translateX:250,
    translateY:40,
    wheelZoom:0.95,
    dragEnable:true,
    init:function(stage){
        if(stage){
            stage.curScene = this;
        }
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
            this._elements.push(arguments[i]);
        }

        this._elements.sort(function(a,b){
            return a.z_index-b.z_index;
        });

    }

});