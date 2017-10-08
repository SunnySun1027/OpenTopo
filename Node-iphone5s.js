var Node = Element.extend({
    elementType:"node",
    z_index:2,
    x:0,
    y:0,
    width:30,
    height:30,
    fillStyle:"blue",
    image:null,
    imageFilterName:"normal",//inverse:反色;gray:灰色;mirror:镜像
    alpha:255,
    tooltipAlway:false,
    fillStyle_tooltip:"red",
    init:function(text,x,y){
        this.text = text;
        if(x!==undefined){
            this.x = x;
        }
        if(y!==undefined){
            this.y = y;
        }
    },
    paint:function(ctx){
        ctx.save();
        var image = null;
        if(this.image && this.image.loadSuccess){
            image = OT.util.getImageByFilter(this.image,this.imageFilterName,this.alpha);
            ctx.drawImage(image,this.x,this.y,this.width,this.height);
        }else{
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }

        if(this.text){
            ctx.save();
            ctx.fillStyle = this.fontStyle;
            ctx.textAlign = "center";
            ctx.font = this.font;
            ctx.textBaseline = "top";
            ctx.fillText(this.text, this.x+this.width/2, this.y+this.height);
            ctx.restore();
        }
        ctx.restore();
    },
    paintTooltip:function(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.fillStyle = "white"
        ctx.strokeStyle = "white";
        ctx.translate(this.width/2,0);
        var textWidth = ctx.measureText(this.tooltipText).width;
        var textHeight = ctx.measureText("田").width;
        ctx.beginPath();
        ctx.lineJoin = "round";
        ctx.lineCap = "round"
        ctx.moveTo(0,-1);
        ctx.lineTo(-5,-5);
        ctx.lineTo(-textWidth/2-10,-5);
        ctx.lineTo(-textWidth/2-10,-5-textHeight-10);
        ctx.lineTo(textWidth/2+10,-5-textHeight-10);
        ctx.lineTo(textWidth/2+10,-5);
        ctx.lineTo(2,-5);
        ctx.lineTo(0,-1);
        ctx.stroke();
        ctx.closePath();
        // ctx.fill();
        ctx.fillStyle = this.fillStyle_tooltip;
        ctx.fillText(this.tooltipText,-textWidth/2,-11);

        ctx.restore();
    },

    paintFocus:function(ctx){
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(this.x-4,this.y-4,this.width+8,this.height+8);
        ctx.restore();
    },
    paintSelected:function(ctx){
        ctx.save();
        ctx.fillStyle = "rgba(255,255,0,0.2)";
        ctx.fillRect(this.x-4,this.y-4,this.width+8,this.height+8);
        ctx.restore();
    },
    setImage:function(image){
        if(typeof image == "string"){
            var img = new Image();
            img.src = image;
            img.onload = function(){
                img.loadSuccess = true;
            };
            this.image = img;
        }else{
            this.image = img;
        }
    },
    inBound:function(pointX,pointY){
        return pointX>=this.x && pointX<=this.x+this.width && pointY>=this.y&&pointY<=this.y+this.height;
    }
});