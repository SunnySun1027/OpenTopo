var Stage = Base.extend({
    fillStyle:"black",
    lastTime:0,
    init:function(canvas,width,height){
        window.stage = this;

        this._canvas = canvas;
        if(!width){
            width = this._canvas.width;
        }
        if(!height){
            height = this._canvas.height;
        }
        this.width = width;
        this.height = height;
        this._ctx = this._canvas.getContext("2d");
        this._ctx.fillStyle = this.fillStyle;
        this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height);

        var me = this;
        void function(){
            me.tick();
            setTimeout(arguments.callee,20);
        }();


        //屏蔽canvas的右键菜单
        this._canvas.oncontextmenu = function(ev){
            ev = ev || event;
            ev.returnValue = false;
        }

        this._canvas.onmousedown = function(ev) {
            ev = ev || event;
        };

        this._canvas.onmousewheel = function(ev){
            var ev = ev || window.event;
            if(ev.deltaY>0){
                me.curScene.scaleY *= me.curScene.wheelZoom;
                me.curScene.scaleX *= me.curScene.wheelZoom;
            }else{
                me.curScene.scaleY /= me.curScene.wheelZoom;
                me.curScene.scaleX /= me.curScene.wheelZoom;
            }
        };


        this._canvas.onmousedown = function(ev) {
            ev = ev || event;
            window.ttt = ev;
            var px = (ev.clientX -me._canvas.offsetLeft+document.body.scrollLeft - me._canvas.width / 2) / me.curScene.scaleX + me._canvas.width / 2 - me.curScene.translateX;
            var py = (ev.clientY -me._canvas.offsetTop+document.body.scrollTop - me._canvas.height / 2) / me.curScene.scaleY + me._canvas.height / 2 - me.curScene.translateY;
            me.curScene.currentElement = null;

            me.curScene._elements.forEach(function(ele){
                if(ele.elementType == "node" || ele.elementType=="container") {
                    if (ele.inBound(px, py)) {
                        ele.selected = true;
                        me.curScene.currentElement = ele;
                        ele.pointX = px - ele.x;
                        ele.pointY = py - ele.y;
                    } else {
                        if(!ev.ctrlKey){
                            ele.selected = false;
                        }
                    }
                }
            });

            if(me.curScene.currentElement){
                me._canvas.style.cursor = "move";
                var curEle = me.curScene.currentElement;
                var now = new Date();
                if(curEle.clickTime && now-curEle.clickTime<200){
                    curEle.clickTime = null;
                    if(curEle.onDbClick){
                        curEle.onDbClick({
                            event:ev,
                            pointX:curEle.pointX,
                            pointY:curEle.pointY
                        });

                    }
                }else {
                    curEle.clickTime = now;
                    if (curEle.onClick) {
                        curEle.onClick({
                            event: ev,
                            pointX: curEle.pointX,
                            pointY: curEle.pointY
                        })
                    }
                }
            }else{
                me._canvas.style.cursor = "pointer";
            }

            me._canvas.onmousemove = function(ev){
                ev = ev || event;

                me._canvas.mousemoveEventObj = ev;

                //var px2 = (ev.clientX -canvas.offsetLeft - canvas.width / 2) / me.curScene.scaleX + canvas.width / 2 - me.curScene.translateX;
                //var py2 = (ev.clientY -canvas.offsetTop - canvas.height / 2) / me.curScene.scaleY + canvas.height / 2 - me.curScene.translateY;
                var px2 = (ev.clientX -me._canvas.offsetLeft+document.body.scrollLeft - me._canvas.width / 2) / me.curScene.scaleX + me._canvas.width / 2 - me.curScene.translateX;
                var py2 = (ev.clientY -me._canvas.offsetTop+document.body.scrollTop - me._canvas.height / 2) / me.curScene.scaleY + me._canvas.height / 2 - me.curScene.translateY;
                var curEle = me.curScene.currentElement;

                me._canvas.px2 =px2;
                me._canvas.py2 = py2;


                if(curEle){
                    if(curEle.dragEnable) {
                        var dx = px2 - curEle.pointX;
                        var dy = py2 - curEle.pointY;
                        if (curEle.childs) {
                            curEle.childs.forEach(function (ele) {
                                ele.x += dx - curEle.x;
                                ele.y += dy - curEle.y;
                            });
                        }
                        curEle.x = dx;
                        curEle.y = dy;
                    }
                }else{
                    if(me.curScene.dragEnable){
                        me.curScene.translateX +=px2-px;
                        me.curScene.translateY +=py2-py;
                    }
                }
            }
            document.onmouseup = function(){
                me._canvas.onmousemove = null;
                me._canvas.onmouseup = null;
                me._canvas.style.cursor = "default";
                console.log('def')
            }



        };

        document.onmousemove = function(ev){
            ev = ev || event;
            me.curScene.focus = null;
            var px = (ev.clientX -me._canvas.offsetLeft+document.body.scrollLeft - me._canvas.width / 2) / me.curScene.scaleX + me._canvas.width / 2 - me.curScene.translateX;
            var py = (ev.clientY -me._canvas.offsetTop+document.body.scrollTop - me._canvas.height / 2) / me.curScene.scaleY + me._canvas.height / 2 - me.curScene.translateY;

            me.curScene._elements.forEach(function(ele){
                if(ele.elementType == "node" || ele.elementType == "link"){
                    if(ele.inBound(px,py)){
                        me.curScene.focus = ele;
                    }
                }

            });
        }



    },
    tick:function(){
        if(this.curScene){
            this._ctx.clearRect(0,0,1000,1000);
            this.curScene.paint(this._ctx);

            var now = new Date();
            var fps = parseInt(1000/(now-this.lastTime));
            this.lastTime = now;
            this._ctx.fillText("FPS:"+fps,10,20);

        }
    }
});

Object.defineProperties(Stage.prototype, {
    width: {
        get: function () {
            return this._width;
        }, set: function (a) {
            this._width = a;
            this._canvas.width = this._width;
        }
    },
    height: {
        get: function () {
            return this._height;
        }, set: function (a) {
            this._height = a;
            this._canvas.height = this._height;
        }
    }
});