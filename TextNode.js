var TextNode = Element.extend({
    elementType:"text",
    z_index:3,
    x:0,
    y:0,
    init:function(text,x,y){
        this.text = text;
        this.x = x;
        this.y = y;
    },
    paint:function(ctx){
        ctx.save();
        this._textWidth = ctx.measureText(this.text).width;
        this._textHeight = ctx.measureText("田").width;
        ctx.fillText(this.text,this.x,this.y+this._textHeight);
        ctx.restore();

    },
    paintFocus:function(ctx){
        ctx.save();
        ctx.fillStyle = "rgba(200,200,200,0.2)";
        ctx.fillText(this.text,this.x,this.y+this._textHeight);
        ctx.restore();
    },
    paintSelected:function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x,this.y,this._textWidth,this._textHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },
    inBound:function(pointX,pointY){
        return pointX>=this.x && pointX<=this.x+this._textWidth && pointY>=this.y&&pointY<=this.y+this._textHeight;
    }
});