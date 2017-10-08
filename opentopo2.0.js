function require(filename){
    document.writeln('<script src="'+filename+'?r='+Math.random()+'"></script>');
}
require("Class.js");
require("Base.js");
require("Stage.js");
require("Scene.js");
require("Element.js");
require("Node.js");
require("Link.js");
require("TextNode.js");


var OT = window.OT = (function(){
    var __imageCache = {};
    var canvas_temp =document.createElement("canvas");
    var ctx_temp =canvas_temp.getContext("2d");
    function clone(arr){
        var a=[]; for(var i=0,l=arr.length;i<l;i++) a.push(arr[i]); return a;
    }

    function pointLine_Disp(xx, yy, x1, y1, x2, y2)
    {
        var a, b, c, ang1, ang2, ang, m;
        var result = 0;
        //分别计算三条边的长度
        a = Math.sqrt((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy));
        if (a == 0)
            return -1;
        b = Math.sqrt((x2 - xx) * (x2 - xx) + (y2 - yy) * (y2 - yy));
        if (b == 0)
            return -1;
        c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        //如果线段是一个点则退出函数并返回距离
        if (c == 0)
        {
            result = a;
            return result;
        }
        //如果点(xx,yy到点x1,y1)这条边短
        if (a < b)
        {
            //如果直线段AB是水平线。得到直线段AB的弧度
            if (y1 == y2)
            {
                if (x1 < x2)
                    ang1 = 0;
                else
                    ang1 = Math.PI;
            }
            else
            {
                m = (x2 - x1) / c;
                if (m - 1 > 0.00001)
                    m = 1;
                ang1 = Math.acos(m);
                if (y1 >y2)
                    ang1 = Math.PI*2  - ang1;//直线(x1,y1)-(x2,y2)与折X轴正向夹角的弧度
            }
            m = (xx - x1) / a;
            if (m - 1 > 0.00001)
                m = 1;
            ang2 = Math.acos(m);
            if (y1 > yy)
                ang2 = Math.PI * 2 - ang2;//直线(x1,y1)-(xx,yy)与折X轴正向夹角的弧度

            ang = ang2 - ang1;
            if (ang < 0) ang = -ang;

            if (ang > Math.PI) ang = Math.PI * 2 - ang;
            //如果是钝角则直接返回距离
            if (ang > Math.PI / 2)
                return a;
            else
                return a * Math.sin(ang);
        }
        else//如果(xx,yy)到点(x2,y2)这条边较短
        {
            //如果两个点的纵坐标相同，则直接得到直线斜率的弧度
            if (y1 == y2)
                if (x1 < x2)
                    ang1 = Math.PI;
                else
                    ang1 = 0;
            else
            {
                m = (x1 - x2) / c;
                if (m - 1 > 0.00001)
                    m = 1;
                ang1 = Math.acos(m);
                if (y2 > y1)
                    ang1 = Math.PI * 2 - ang1;
            }
            m = (xx - x2) / b;
            if (m - 1 > 0.00001)
                m = 1;
            ang2 = Math.acos(m);//直线(x2-x1)-(xx,yy)斜率的弧度
            if (y2 > yy)
                ang2 = Math.PI * 2 - ang2;
            ang = ang2 - ang1;
            if (ang < 0) ang = -ang;
            if (ang > Math.PI) ang = Math.PI * 2 - ang;//交角的大小
            //如果是对角则直接返回距离
            if (ang > Math.PI / 2)
                return b;
            else
                return b * Math.sin(ang);//如果是锐角，返回计算得到的距离
        }
    }

    function getImageByFilter(image,filterName,alpha){
        if(!image.width || !image.height){
            //图片还没有加载完成
            return null;
        }

        var cacheName = image.src+filterName;
        if(__imageCache[cacheName]){
            return __imageCache[cacheName];
        }
        canvas_temp.width = image.width;
        canvas_temp.height = image.height;
        ctx_temp.clearRect(0,0,canvas_temp.width,canvas_temp.height);
        ctx_temp.drawImage(image,0,0);
        var j = ctx_temp.getImageData(0,0,image.width,image.height);
        var k = j.data;
        var k_temp = clone(k);
        if(filterName == "mirror"){//镜像
            for(var x=0;x<image.width;x++) {
                for (var y = 0; y < image.height; y++) {
                    //   k[midx + 3] = alpha;
                    var n = 4 * (x + y * image.width);
                    var midx = (((image.width -1) - x) + y * image.width) * 4;
                    k[midx] = k_temp[n];
                    k[midx+1] = k_temp[n+1];
                    k[midx+2] = k_temp[n+2];
                    k[midx+3] = k_temp[n+3];
                }
            }

        }else{
            for(var x=0;x<image.width;x++){
                for(var y=0;y<image.height;y++){
                    var n = 4 * (x + y * image.width);
                    // k[n+3] =alpha;
                    switch (filterName){
                        case "inverse":
                            k[n] = 255-k[n];
                            k[n+1] = 255-k[n+1];
                            k[n+2] = 255-k[n+2];
                            break;
                        case "gray":
                            var grey = k[n] * 0.3 + k[n + 1] * 0.59 + k[n + 2] * 0.11;
                            k[n] = k[n + 1] = k[n + 2] = grey;
                            break;
                    }

                }
            }

        }

        ctx_temp.putImageData(j, 0, 0, 0, 0, canvas_temp.width, canvas_temp.height);
        var o = canvas_temp.toDataURL();
        var image0 = new Image();
        image0.src = o;
        __imageCache[cacheName] = image0;
        return image0;
    }

    var OT = {
        __imageCache:__imageCache,
        util:{
            getImageByFilter:getImageByFilter,
            pointLine_Disp:pointLine_Disp
        }
    };
    return OT;
})();

