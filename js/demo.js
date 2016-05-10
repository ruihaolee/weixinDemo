(function () {
	var needBounding = {
		canvasBounding : {
			width : 800,
			height : 500,
			image : null
		},
		arcPosition : {
			x : 350,
			y : 150,
			r : 40
		}
	};
	var ifShow = false;
	var blurCanvas = null;
	var clickFuns = {
		clickBoxHandle : function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		console.log(ifShow);
		//console.log(target.id);
		switch(target.id){
			case 'reset' :
					if (ifShow) {
						ifShow = false;
						blurCanvas.arcPosition.r = 40;
						blurCanvas.drawArcImage();
						return;
					}
					this.getRandomXY();
					blurCanvas.drawArcImage();
					break;
			case 'show':
					//alert('show');
					window.requestAnimationFrame(blurCanvas.showAnimate.bind(blurCanvas));
					break;
			default : break;		
			}
		},
		getRandomXY : function(){
			var r = needBounding.arcPosition.r;
			var x = Math.floor(Math.random() * needBounding.canvasBounding.width);
			var y = Math.floor(Math.random() * needBounding.canvasBounding.height);
			if ((x + r) > needBounding.canvasBounding.width || (x - r) < 0 || (y + r) > needBounding.canvasBounding.height || (y - r) < 0) {
				arguments.callee();
				return;
			}
			blurCanvas.arcPosition.x = x;
			blurCanvas.arcPosition.y = y;
			//console.log(blurCanvas.arcPosition);
		}
	}
	window.onload = function(){
		var picImage = new Image();
		picImage.src = 'css/sucai.jpg';
		needBounding.canvasBounding.image = picImage;

		picImage.onload = function(){
			blurCanvas = new BlurCanvas(needBounding);
			blurCanvas.init();
		}

		var buttonBox = document.getElementById('buttonBox');
		buttonBox.addEventListener('click', clickFuns.clickBoxHandle.bind(clickFuns), false);
	}

	function BlurCanvas (needBounding){
		this.canvasBounding = needBounding.canvasBounding;
		this.arcPosition = needBounding.arcPosition;

		var canvas = document.getElementById('canvas');
		canvas.width = this.canvasBounding.width;
		canvas.height = this.canvasBounding.height;

		this.context = canvas.getContext('2d');
	}
	BlurCanvas.prototype = {
		constructor : BlurCanvas,
		init : function(){
			this.drawArcImage()
		},
		drawArcImage : function(){
			//console.log(this.canvasBounding);
			this.context.clearRect(0, 0, this.canvasBounding.width, this.canvasBounding.height);
			this.context.save();
			this.clipArc();
			this.context.drawImage(this.canvasBounding.image, 0, 0, this.canvasBounding.width, this.canvasBounding.height);
			this.context.restore();
		},
		clipArc : function(){
			//console.log(this.arcPosition);
			this.context.beginPath();
			this.context.arc(this.arcPosition.x, this.arcPosition.y, this.arcPosition.r, 0, 2 * Math.PI, true);
			this.context.closePath();
			this.context.clip();
		},
		showAnimate : function(){
			ifShow = true;
			this.drawArcImage();
			if (this.arcPosition.r <= 1000) {
				this.arcPosition.r += 2;
				window.requestAnimationFrame(this.showAnimate.bind(blurCanvas));
			}
		}
	}
})();