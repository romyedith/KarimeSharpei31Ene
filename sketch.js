var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sharpei, sharpei_running, sharpei_jump;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var bonesGroup, bone1, bone2, bone3, bone4, bone5, bone6;

var score=0;

var gameOver, restart;
var totalHuesitos = 0;
var huesitosComidos = 0;

function preload(){
  sharpei_running =   loadAnimation("sharpei1.png","sharpei2.png","sharpei3.png");
  sharpei_jump = loadAnimation("sharpei_jump.png");
  
  groundImage = loadImage("beach2.png");
  
  cloudImage = loadImage("cloud.png");
  
  bone1 = loadImage("huesito1.png");
  bone2 = loadImage("huesito1.png");
  bone3 = loadImage("huesito1.png");
  bone4 = loadImage("huesito1.png");
  bone5 = loadImage("huesito1.png");
  bone6 = loadImage("huesito1.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1200, 450);
  
  
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  

  sharpei = createSprite(50,370,20,50);
  
  sharpei.addAnimation("running", sharpei_running);
  sharpei.addAnimation("collided", sharpei_jump);
  sharpei.scale = 0.1;

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,380,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  bonesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("blue");
  //trex.debug = true;
  background("blue");
  text("Puntuación: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + score/1000);
    //cambiar la animación del Trex
    sharpei.changeAnimation("running", sharpei_running);
    
    if(keyDown("space") ) {
      sharpei.velocityY = -12;
    }
  
    sharpei.velocityY = sharpei.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/5;
    }
  
    sharpei.collide(invisibleGround);
    spawnClouds();
    spawnbones();
  
    if(bonesGroup.isTouching(sharpei)){
      console.log("entre");
      for (var i = 0; i < totalHuesitos; i++) {
        if (bonesGroup.get(i) != undefined && bonesGroup.get(i).isTouching(sharpei)) {
          bonesGroup.get(i).destroy();
          huesitosComidos = huesitosComidos + 1;
          sharpei.scale = sharpei.scale+.01;
          
        
        }
      }
        //gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establecer la velocidad de cada objeto del juego como 0
    ground.velocityX = 0;
    sharpei.velocityY = 0;
    bonesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambiar la animación del Trex
    sharpei.changeAnimation("collided",sharpei_jump);
    
    //establecer lifetime (ciclo de vida) de los objetos del juego para que no sean destruidos nunca
    bonesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + score/1000);
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 200;
    
    //ajustar la profundidad
    cloud.depth = sharpei.depth;
    sharpei.depth = sharpei.depth + 1;
    
    //agregar cada nuble al gtrexrupo
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  bonesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnbones() {
  if(frameCount % 60 === 0) {
    var bone = createSprite(600,165,10,40);
    //bone.debug = true;
    bone.velocityX = -(6 + score/1000);
    
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: bone.addImage(bone1);
              break;
      case 2: bone.addImage(bone2);
              break;
      case 3: bone.addImage(bone3);
              break;
      case 4: bone.addImage(bone4);
              break;
      case 5: bone.addImage(bone5);
              break;
      case 6: bone.addImage(bone6);
              break;
      default: break;
    }
    bone.y = Math.round(random(80,120));
    //asignar escala y ciclo de vida al obstáculo           
    bone.scale = 0.1;
    bone.lifetime = 300;
    //agregar cada obstáculo al grupo
    bonesGroup.add(bone);
    totalHuesitos = totalHuesitos + 1;
  }
}

