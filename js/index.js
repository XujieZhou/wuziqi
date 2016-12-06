$(function(){
	var canvas=$("#canvas").get(0);
	var canva=$("#canva").get(0);
	var canv=$("#canv").get(0);
	var ctx=canvas.getContext("2d");
	var ctx1=canva.getContext("2d");
	var ctx2=canv.getContext("2d");
	var spe=40;
	var sr=4;
	var br=18;
	var audio=$("#audio").get(0);
	var kongbai={};
	var Ai=false;
	var gamestater="pause";
	
	
	function pos(x){
		return (x+0.5)*spe+0.5;
	}
	function jin(){
		$("#canva").addClass("biao");
		$("#canv").addClass("biao");
		$("#hei").css("display",'block');
		$("#bai").css("display",'block');
	}
	function intel(){
		var max=-Infinity;
		var max2=-Infinity;
		var pos1={};
		var pos2={};
		for (var k in kongbai) {
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=Win(x,y,"black");
			if (q>max) {
				max=q;
				pos1={x:x,y:y};
			}
		}
		for (var k in kongbai) {
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=Win(x,y,"white");
			if (q>max2) {
				max2=q;
				pos2={x:x,y:y};
			}
			
		}
		if (max>max2) {
			return pos1;
		}else{
			return pos2;
		}
		
	}
	//人机对战
	$(".rj").on("click",function(){
		$(".shye").addClass("rjdh");
		$(".kaishi").addClass("rjdh");
		jin();
		$(".wan2").html("电脑");
		if (gamestater==="play") {
		     return;
	    }
		else{
			Ai=true;
		}
	})
	
	
	//人人对战
	$(".rr").on("click",function(){
		$(".shye").addClass("rrdh");
		$(".kaishi").addClass("rrdh");
		jin();
	})
//	画圆
	function circle(x,y,sr){
		ctx.save();
		ctx.translate(pos(x),pos(y))
		ctx.beginPath();
		ctx.arc(0,0,sr,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
//	棋盘
	function drawQipan(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		ctx.beginPath();
		for(var i = 0; i < 15; i++) {
			ctx.moveTo(pos(i),pos(0));
			ctx.lineTo(pos(i),pos(14));
			ctx.moveTo(pos(0),pos(i));
			ctx.lineTo(pos(14),pos(i));
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		circle(3,3,sr);
		circle(11,3,sr);
		circle(7,7,sr);
		circle(3,11,sr);
		circle(11,11,sr);
		
		for (var i = 0; i <15; i++) {
			for (var j = 0; j <15; j++) {
				kongbai[m(i,j)]=true;
			}
		}
	}
	drawQipan();
//	落子
	var qizi={};
	function luozi(x,y,color){
		gamestate="play";
		ctx.save();
		ctx.translate(pos(x),pos(y))
		ctx.beginPath();
		var g=ctx.createRadialGradient(-8,-6,0,0,0,100);
		if(color==="black"){
			g.addColorStop(0,'#fff');
			g.addColorStop(0.2,'#000');
			g.addColorStop(1,'#000');
			ctx.fillStyle=g;
			$('.wan1').addClass('wanac');
            $('.wan2').removeClass('wanac');
		}else{
			g.addColorStop(0,'#fff');
			g.addColorStop(0.2,'#eee');
			g.addColorStop(1,'#eee');
			ctx.fillStyle=g;
			$('.wan2').addClass('wanac');
            $('.wan1').removeClass('wanac');
		}
		ctx.arc(0,0,br,0,Math.PI*2);
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
		ctx.closePath();
		ctx.restore();
		qizi[m(x,y)]=color;
		delete kongbai[m(x,y)];
		gamestater="play";
	}
	var kaiguan=true;
    var s1=0,s2=0,t1,t2;
    function handleClick(e){
    	var x=Math.floor(e.offsetX/spe);
		var y=Math.floor(e.offsetY/spe);
		if(qizi[m(x,y)]){
			return;
		};
		if (Ai) {
			luozi(x,y,'black');
			if (Win(x,y,"black")>=5) {
		     	$(".zailai").find("#se").html("黑 棋 赢 了！").end().addClass("zaimove");
            	$(canvas).off("click");
		     }
			var p1=intel();
			luozi(p1.x,p1.y,"white");
			if (Win(p1.x,p1.y,"white")>=5) {
		     	$(".zailai").find("#se").html("白 棋 赢 了！").end().addClass("zaimove");
            	$(canvas).off("click");
		     };
			return false;
		}
		if(kaiguan){
			luozi(x,y,"black");
			s1=0;
			s2=0;
			miaozhen();
			clearInterval(t1);
			t2=setInterval(miaozhen2,1000);
			if(Win(x,y,'black')>=5){
				$(canvas).off("click");
				$(".zailai").find("#se").html("黑 棋 赢 了！").end().addClass("zaimove");
			}
		}else{
			luozi(x,y,"white");
			s1=0;
			s2=0;
			miaozhen2();
			clearInterval(t2);
			t1=setInterval(miaozhen,1000);
			if(Win(x,y,'white')>=5){
				$(canvas).off("click");
				$(".zailai").find("#se").html("白 棋 赢 了！").end().addClass("zaimove");
			}
		}
		kaiguan=!kaiguan;
		audio.play();
    }
	$(canvas).on("click",handleClick);
	
	//棋谱
	$(".kanpu").on("click",function(){
		$('.qipu').addClass('pumove');
		chessManual();
	});
	$(".closepu").on("click",function(){
		$('.qipu').removeClass('pumove');
		drawQipan();
    	for(var j in qizi){
    		var x=parseInt(j.split("_")[0]);
    		var y=parseInt(j.split("_")[1]);
    		luozi(x,y,qizi[j]);
    	}
	});
	function chessManual(){
    	ctx.save();
    	ctx.font="24px/1  微软雅黑";
    	ctx.textBaseline="middle";
    	ctx.textAlign="center";
    	var i=1;
    	for(var j in qizi){
    		var arr=j.split("_");
    		if(qizi[j]==="white"){
    			ctx.fillStyle="#000";
    		}else{
    			ctx.fillStyle="#fff";
    		}
    		ctx.fillText(i++,pos(parseInt(arr[0])),pos(parseInt(arr[1])));
    	}
    	ctx.restore();
    	$("<img>").attr("src",canvas.toDataURL()).appendTo(".qipu");
    	$("<a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".qipu");
    }
	
	
	//左秒表
	function miaozhen2(){
		ctx2.clearRect(0,0,100,100);	
		ctx2.save();	
		ctx2.translate(50,50);
		ctx2.beginPath();
		ctx2.rotate(Math.PI/180*6*s2);
		ctx2.arc(0,0,5,0,Math.PI*2);
		ctx2.moveTo(0,5);
		ctx2.lineTo(0,20);
		ctx2.moveTo(0,-5);
		ctx2.lineTo(0,-40);
		ctx2.closePath();
		ctx2.stroke();
		ctx2.restore();
		s2++;
		if(s2>=60){
			s2=0;
		}
	}
	miaozhen2();
	
	
	//右秒表
	
	function miaozhen(){
		ctx1.clearRect(0,0,100,100);	
		ctx1.save();	
		ctx1.translate(50,50);
		ctx1.beginPath();
		ctx1.rotate(Math.PI/180*6*s1);
		ctx1.arc(0,0,5,0,Math.PI*2);
		ctx1.moveTo(0,5);
		ctx1.lineTo(0,20);
		ctx1.moveTo(0,-5);
		ctx1.lineTo(0,-40);
		ctx1.closePath();
		ctx1.stroke();
		ctx1.restore();
		s1++;
		if(s1>=60){
			s1=0;
		}
	}
	miaozhen();
		
		
	//输赢判断
	function m(x,y){
		return x+'_'+y;
	}
	
	function Win(x,y,color){
		var h=1,s=1,zx=1,yx=1,i;
		
		//横判断
		i=1; while(qizi[m(x+i,y)]===color) { h++; i++;};
		i=1; while(qizi[m(x-i,y)]===color) { h++; i++;};
		//竖判断
		i=1; while(qizi[m(x,y+i)]===color) { s++; i++;};
		i=1; while(qizi[m(x,y-i)]===color) { s++; i++;};
		//右斜判断
		i=1; while(qizi[m(x+i,y+i)]===color) { zx++; i++;};
		i=1; while(qizi[m(x-i,y-i)]===color) { zx++; i++;};
		//左斜判断
		i=1; while(qizi[m(x+i,y-i)]===color) { yx++; i++;};
		i=1; while(qizi[m(x-i,y+i)]===color) { yx++; i++;};
		
		return Math.max(h,s,zx,yx);
	}

//开始页
	var start=$("#start").get(0);
	var ctxstart=start.getContext("2d");
	function zi(){
		ctxstart.save();
		ctxstart.translate(75,50)
		ctxstart.beginPath();
		ctxstart.textAlign="center";
	  	ctxstart.textBaseline ="middle";
		ctxstart.font = "32px serif";
		ctxstart.fillStyle='red';
		ctxstart.shadowOffsetX = 2;
		ctxstart.shadowOffsetY = 2;
		ctxstart.shadowBlur = 2;
		ctxstart.shadowColor = "rgba(0, 0, 0, 0.5)";
	  	ctxstart.fillText("开始游戏", 0,0);
		ctxstart.closePath();
		
		ctxstart.restore();
	}

	zi();
	
	
	$(start).on("click",function(){
		$(".shye").addClass("shou");
		$(".kaishi").addClass("shou");
		jin();
	})
	

//	黑方
	var hei=$("#hei").get(0);
	var ctxhei=hei.getContext("2d");
	function heizi(){
		ctxhei.save();
		ctxhei.translate(30,20);
		ctxhei.beginPath();
		ctxhei.textAlign="center";
	  	ctxhei.textBaseline ="middle";
		ctxhei.font = "36px serif";
		ctxhei.fillStyle='#000';
		ctxhei.shadowOffsetX = 2;
		ctxhei.shadowOffsetY = 2;
		ctxhei.shadowBlur = 2;
		ctxhei.shadowColor = "rgba(0, 0, 0, 0.5)";
	  	ctxhei.fillText("黑方", 0,0);
		ctxhei.closePath();
		ctxhei.restore();
	}

	heizi();

//	白方
	var bai=$("#bai").get(0);
	var ctxbai=bai.getContext("2d");
	function baizi(){
		ctxbai.save();
		ctxbai.translate(30,20);
		ctxbai.beginPath();
		ctxbai.textAlign="center";
	  	ctxbai.textBaseline ="middle";
		ctxbai.font = "36px serif";
		ctxbai.fillStyle='#eee';
		ctxbai.shadowOffsetX = 2;
		ctxbai.shadowOffsetY = 2;
		ctxbai.shadowBlur = 2;
		ctxbai.shadowColor = "rgba(0, 0, 0, 0.5)";
	  	ctxbai.fillText("白方", 0,0);
		ctxbai.closePath();
		ctxhei.restore();
	}
	baizi();
	
	
	//退出游戏
	$(".tuichu").on("click",function(){
		$(".shye2").css('display','block');
	})
	$("#close").on("click",function(){
		window.close();
	})
	$(".zaiclone").on("click",function(){
		window.close();
	})
	$("#no").on("click",function(){
		$(".shye2").css('display','none');
	})
	
	//游戏介绍
	$('.yxjs').on('click',function(){
		$(".jieye").toggleClass("jshao");
	})
	$('.guan').on('click',function(){
		$(".jieye").toggleClass("jshao");
	})
	
	//返回
	$('.fanhui').on('click',function(){
		$(".shye").toggleClass("shou");
		$(".kaishi").toggleClass("shou");
	})
	
	
	//再来一局
	function restart(){
		$(".zailai").removeClass("zaimove");
		drawQipan();
		kaiguan=true;
		qizi={};
		$(canvas).on("click",handleClick);
		gamestate="pause";
	}
	
	$(".again").on("click",function(){
		restart();
	})
	$(".chongxin").on("click",function(){
		restart();
	})
	
	//认输
	$(".ren").on("click",function(){
		$(canvas).off("click");
		$(".zailai").find("#se").html("我 认 输 了！").end().addClass("zaimove");
	})
	
	
})