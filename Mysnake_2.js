    var c = document.getElementById("myCanvas");
    var cxt = c.getContext("2d");
	//画gameover
    function drawGameOver(winner) {
        cxt.fillStyle = '#FFF';
        cxt.font = '30px Arial';
	    cxt.fillText(winner + " wins", 100, 120);
    }

    //第一条蛇的身体
    var positions = [];
	var num = 3;
	for(var i=0; i < num; i++){
	    positions[i] = {
		    x: i,
            y: 0
		};
	}

	//第二条蛇的身体
	var positions2 = [{x: 39, y: 0}, {x:38, y: 0}, {x: 37, y: 0}];
    var foodPositions = {
        x: -1,
        y: -1
    };
    var height = 8;
    var width = 8;
    var direction = "right";
    var direction2 = "left"; //direction of snake2



    var MR = Math.random;

    function drawSnakeAndFood(p, color) {
        if (foodPositions.x == -1 && foodPositions.y == -1) {
            foodPositions.x = MR() * 40 | 0;
            foodPositions.y = MR() * 40 | 0;
        }
        cxt.fillStyle = randomColor();
        cxt.fillRect(foodPositions.x * width, foodPositions.y * height, height, width);
        for (i = 0; i < p.length - 1; i++) {
            cxt.fillStyle = "#D1EEEE";
            cxt.fillRect(p[i].x * width, p[i].y * height, height, width);
        }
            cxt.fillStyle = color;
            cxt.fillRect(p[p.length - 1].x * width - 1, p[p.length -1].y * height - 1, height + 2, width + 2);
    }
    //从画布上清楚蛇的某位
    function clearColor(point) {
        cxt.fillStyle = "#111";
        cxt.fillRect(point.x * width - 1, point.y * height - 1, height + 2, width + 2);
    }
    //判断蛇是否咬到自己
    function IsInSnake(ps, p) {
        for (i = 0; i < ps.length - 1; i++) {
            if (ps[i].x == p.x && ps[i].y == p.y) {
                return true;
            }
        }
        return false;
    }
    var gameOver = false;
//-------------------------------以下两个为主要函数(实现框架)-----------------------------------------
    var moveAsync = eval(Jscex.compile("async", function (p, p2) {
        while (true) {
            moveSnake(p, direction);
            moveSnake(p2, direction2);
			//切对方尾巴
			for(var i=0; i < p.length - 1; i++){
				if(p2[p2.length - 1].x == p[i].x && p2[p2.length - 1].y == p[i].y){
					for(var j=0; j < i; j++){
						p.shift();
					}
				}
			}
			for(var i=0; i < p2.length - 1; i++){
				if(p[p.length - 1].x == p2[i].x && p[p.length - 1].y == p2[i].y){
					for(var j=0; j < i; j++){
						p2.shift();
					}
				}
			}	
			if(p.length == 9 || p2.length == 9){
				if(p.length < p2.length){
					drawGameOver("blue");}
				else if(p.length > p2.length){
					drawGameOver("red");}					
				else{
					drawGameOver("Nobody");}
				document.getElementById("btnReset").disabled = "";
				break;	
			}
			drawSnakeAndFood(p, "red");
			drawSnakeAndFood(p2, "blue");
            document.getElementById("snake1").value = p.length;
            document.getElementById("snake2").value = p2.length;
	/*		
			if (gameOver) {
                drawGameOver(winner);
                document.getElementById("btnReset").disabled = "";
                break;
            }*/
            $await(Jscex.Async.sleep(110));
        }
    }));
	//按蛇移动方向改变代表蛇的数组
	function moveSnake(p, direction) {
/* 	    if (p[p.length - 1].x < 0 || p[p.length - 1].x > 39 || p[p.length - 1].y < 0 || p[p.length - 1].y > 39 ) { 
			gameOver = true;
		} 
	
		if ( IsInSnake(p, p[p.length - 1]) ) {
			gameOver = true;
		}*/
		
		if (p[p.length - 1].x < 0){
			p[p.length - 1].x = 39;
		}
		if (p[p.length - 1].y < 0){
			p[p.length - 1].y = 39;
		}
		if (p[p.length - 1].x > 39){
			p[p.length - 1].x = 0;
		}	
		if (p[p.length - 1].y > 39){
			p[p.length - 1].y = 0;
		}			//循环边界条件
		if (p[p.length - 1].x == foodPositions.x && p[p.length - 1].y == foodPositions.y) {
			foodPositions.x = -1;
			foodPositions.y = -1;
		}
		else {
			clearColor(p[0]);
			p.shift();
		}
		if (direction == "right") {
			p.push({
				x: p[p.length - 1].x + 1,
				y: p[p.length - 1].y
			});
		}
		if (direction == "left") {
			p.push({
				x: p[p.length - 1].x - 1,
				y: p[p.length - 1].y
			});
		}
		if (direction == "up") {

			p.push({
				x: p[p.length - 1].x,
				y: p[p.length - 1].y - 1
			});
		}
		if (direction == "down") {
			p.push({
				x: p[p.length - 1].x,
				y: p[p.length - 1].y + 1
			});
		}
		//咬到自己尾巴, 尾巴掉了
/*		for(var i=0; i < p.length - 1; i++){
			if(p[p.length - 1].x == p[i].x && p[p.length - 1].y == p[i].y){
				for(var j=0; j < i; j++){
					p.shift();
				}
			}
		}*/
		
	}
	

		
    function begin() {
        moveAsync(positions, positions2).start();
    }
    document.onkeydown = function (e) {
        if (e.keyCode == 37 && direction !== "right") direction = "left";
        if (e.keyCode == 38 && direction !== "down") direction = "up";
        if (e.keyCode == 39 && direction !== "left") direction = "right";
        if (e.keyCode == 40 && direction !== "up") direction = "down";

        if (e.keyCode == 65 && direction2 !== "right") direction2 = "left";
        if (e.keyCode == 87 && direction2 !== "down") direction2 = "up";
        if (e.keyCode == 68 && direction2 !== "left") direction2 = "right";
        if (e.keyCode == 83 && direction2 !== "up") direction2 = "down";
    }

    function reSet() {
        cxt.clearRect(0, 0, 1000, 1000)
        direction = "right";
        direction2 = "left"
        positions = [{x: 0, y: 0}, {x:1, y: 0}, {x: 2, y: 0}];
        positions2 = [{x: 39, y: 0}, {x:38, y: 0}, {x: 37, y: 0}];
        gameOver = false;
        document.getElementById("btnReset").disabled = "disabled";
        moveAsync(positions, positions2).start();
    }
    function randomColor() {
      
        var arrHex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]; var strHex = "#";
        var index;
        for (var i = 0; i < 6; i++) {
            index = Math.round(Math.random() * 15);
            strHex += arrHex[index];
        }
        return strHex;
    } 