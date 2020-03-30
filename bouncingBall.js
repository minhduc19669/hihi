
    var canvas=document.getElementById('myCanvas');
    var context=canvas.getContext('2d');
    var gameOver=false;
    var score=0;
    const MAX_score=10;
    var Racket=function(x,y,width,height,speed){
        this.width=width;
        this.height=height;
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.isMovingleft=false;
        this.isMovingright=false;
        this.drawRacket=function(){
            context.beginPath();
            context.rect(this.x,this.y,this.width,this.height);
            context.fillStyle='black';
            context.fill();
            
            context.closePath();
        };
        this.moveLeft=function(){
            this.x-=this.speed;
        
        }
        this.moveRight=function(){
            this.x+=this.speed;
        }
    };
    var Ball=function(x,y,radius,dx,dy){
        this.x=x;
        this.y=y;
        this.dx=dx;
        this.dy=dy;
        this.radius=radius;
        this.drawBall=function(){
            context.beginPath();
            context.arc(this.x,this.y,this.radius,0,2*Math.PI);
            context.fillStyle ='blue';
            context.shadowBlur = 5;
            context.shadowColor = "white";
            context.fill();
            context.closePath();            
        };
        this.updateLocation=function(){
            this.x+=this.dx;
            this.y+=this.dy;
        };
        this.collision=function(canvas){
            if (this.x<this.radius || this.x>canvas.width-this.radius){
                this.dx = -this.dx;
            }                                            //xử lí bóng chạm vào biên
            if ( this.y<this.radius){
                this.dy = -this.dy;
            }
            //Bóng chạm đáy canvas
        };
        this.over=function(canvas){
            if (this.y> canvas.height-this.radius) {
                gameOver=true;
            }
        }
        //Bóng chạm thanh
        this.handleBallRacket=function(racket) {
        if ( this.x+this.radius>=racket.x &&this.x+this.radius<=racket.x+racket.width &&this.y+this.radius>=racket.y){
                this.dy=-this.dy;
            }
        }
    };
    var Brick = function(x,y,width,height,margin,row,col){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.margin=margin;
        this.row=row;
        this.col=col;
        // this.draw=function(x,y){
        //     context.beginPath();
        //     context.rect(x, y, this.width, this.height);
        //     context.fillStyle = 'red';
        //     context.fill();
        //     context.closePath();
        // }
    }
    var racket=new Racket(15,485,100,20,10);
    var ball=new Ball(Math.random()*500,20,10,4,3);
    var brick=new Brick(25,25,70,15,25,4,5);
    var brickarr = [];
    var isBroken=false;
    var isWin=false;

    for (let i = 0; i < brick.row; i++) {
        for (let j = 0; j < brick.col; j++) {
            brickarr.push(
                {
                    x:brick.margin+j*(brick.width+brick.margin),
                    y:brick.margin+i*(brick.height+brick.margin),
                    isBroken:false
                }
            )
                
        }
    }
    
    //ve cãc vien gach
    function drawBrick() {
        brickarr.forEach(function(b) {
            if(!b.isBroken){
            context.beginPath();
            context.rect(b.x,b.y,brick.width,brick.height);
            context.fill();
            context.closePath;
            }
        });
    }
    
    //xu ly bong dap vao gach
    function balltouchbricks() {
        brickarr.forEach(function(b){
            if(!b.isBroken){
                if(ball.x>=b.x && ball.x<=b.x+brick.width && ball.y+ball.radius >= b.y && ball.y+ball.radius <= b.y+brick.height){
                    ball.dy = -ball.dy;
                    score+=1;
                    b.isBroken=true;
                    document.getElementById('score').innerHTML=score;
                    if(score>=MAX_score){
                        gameOver=true;
                        isWin=true;
                    }
                }
            }
        })
    }
    document.addEventListener('keyup',function (event) {
        switch (event.keyCode) {
            case 37:
                racket.isMovingleft=false;
                break;
            case 39:
                racket.isMovingright=false;
                break;
        }
    });
    document.addEventListener('keydown',function (event) {
        switch (event.keyCode) {
            case 37:
                racket.isMovingleft=true;
                break;
            case 39:
                racket.isMovingright=true;
                break;
        }
    });
    function move(){
        if (racket.isMovingleft){
            racket.moveLeft();
        }else if(racket.isMovingright){
            racket.moveRight();
        }
    }
    function checkWin(){
        if(isWin){
            document.getElementById('score').innerHTML="You Win! Điểm của bạn : " + score;
        }else{
            document.getElementById('score').innerHTML="You Lose! Điểm của bạn : " + score;
        }
    }
    function main() {
        if(!gameOver){
            context.clearRect(0, 0, canvas.width, canvas.height);
            racket.drawRacket();
            ball.drawBall();
            drawBrick();
            balltouchbricks();
            move();
            ball.handleBallRacket(racket);
            ball.updateLocation();
            ball.collision(canvas);
            ball.over(canvas);
            requestAnimationFrame(main);
        }else{
            checkWin();
        }
    }
    function reloadPage(){
        location.reload();
    }
