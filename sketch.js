var checkpoint, die, jump;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisible_ground, ground_image;
var cloud_image, cloudsGroup;
var ObstaclesGroup, obstacle1,  obstacle5, obstacle2, obstacle3, obstacle4, obstacle6;
var gameOver, gameOver_image;
var restart, restart_image;
var count;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOver_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  ground = createSprite(300,180,600,5);
  ground.addImage("ground", ground_image);
  ground.x = ground.width/2;
  ground.velocityX = -2;
  invisible_ground = createSprite(300,190,600,5);
  invisible_ground.visible = false;
  cloudsGroup = new Group();
  ObstaclesGroup = new Group();
  restart = createSprite(300,140);
  restart.addImage(restart_image);
  restart.scale = 0.5;
  restart.visible = false;
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOver_image);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  count = 0;
}

function draw() {
  background("white");
  
  text("SCORE: "+ count, 500,50);
  
  if(gameState === PLAY){
    
    ground.velocityX = -(6 + 3*count/300);
    //scoring
    count += Math.round(getFrameRate()/60);
    if(count>0 && count % 100 == 0){
      checkpoint.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 159){
      trex.velocityY = -14 ;
      jump.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play();
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  trex.collide(invisible_ground);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
    ObstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    gameOver.visible = false;
    restart.visible = false; 
    trex.changeAnimation("running", trex_running);  
    count = 0;
}

function spawnClouds(){
  if (frameCount % 100 == 0){
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("cloud", cloud_image);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + 3*count/300);
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default : break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    ObstaclesGroup.add(obstacle);
  }
}