var Link = Element.extend({
    elementType:"link",
    z_index:1,
    strokeStyle:"yellow",
    lineWidth:2,
    init:function(sEle,dEle){
        this.sEle = sEle;
        this.dEle = dEle;
    },
    paint:function(ctx){
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;

        var spoint = {
            x:this.sEle.x+this.sEle.width/2,
            y:this.sEle.y +this.sEle.height/2
        };

        var dpoint = {
            x:this.dEle.x+this.dEle.width/2,
            y:this.dEle.y+this.dEle.height/2
        };
        ctx.beginPath();
        ctx.moveTo(spoint.x,spoint.y);
        ctx.lineTo(dpoint.x,dpoint.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },
    paintFocus:function(ctx){
        ctx.save();
        ctx.lineWidth = this.lineWidth+2;
        ctx.strokeStyle = "rgba(200,200,200,0.4)";

        var spoint = {
            x:this.sEle.x+this.sEle.width/2,
            y:this.sEle.y +this.sEle.height/2
        };

        var dpoint = {
            x:this.dEle.x+this.dEle.width/2,
            y:this.dEle.y+this.dEle.height/2
        };
        ctx.beginPath();
        ctx.moveTo(spoint.x,spoint.y);
        ctx.lineTo(dpoint.x,dpoint.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },
    paintSelected:function(ctx){
        ctx.save();
        ctx.lineWidth = this.lineWidth+2;
        ctx.strokeStyle = "rgba(200,200,200,0.4)";

        var spoint = {
            x:this.sEle.x+this.sEle.width/2,
            y:this.sEle.y +this.sEle.height/2
        };

        var dpoint = {
            x:this.dEle.x+this.dEle.width/2,
            y:this.dEle.y+this.dEle.height/2
        };
        ctx.beginPath();
        ctx.moveTo(spoint.x,spoint.y);
        ctx.lineTo(dpoint.x,dpoint.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },
    inBound:function(pointX,pointY){
        this.nodeA = this.sEle;
        this.nodeZ = this.dEle;
        var sPort = {
            x:this.nodeA.x+this.nodeA.width/2,
            y:this.nodeA.y+this.nodeA.height/2
        }
        var dPort = {
            x:this.nodeZ.x+this.nodeZ.width/2,
            y:this.nodeZ.y+this.nodeZ.height/2
        }

        var cPort = null;
        if(this.fold){
            if(this.direction && this.direction=="vertical"){
                cPort = {
                    x:dPort.x,
                    y:sPort.y
                }
            }else{
                cPort = {
                    x:sPort.x,
                    y:dPort.y
                }
            }
        }

        //不太精细

        if(cPort){
            var ju =OT.util.pointLine_Disp(pointX,pointY,sPort.x,sPort.y,cPort.x,cPort.y);
            if(ju<3){
                return true;
            }
            ju = OT.util.pointLine_Disp(pointX,pointY,cPort.x,cPort.y,dPort.x,dPort.y);
            if(ju<3){
                return true;
            }
        }else{
            var ju = OT.util.pointLine_Disp(pointX,pointY,sPort.x,sPort.y,dPort.x,dPort.y);
            if(ju<3){
                return true;
            }
        }

        return false;
    }

});