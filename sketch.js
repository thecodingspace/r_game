var player,
  truck,
  truck2,
  truck3,
  truck4,
  truckDelay,
  scrBackg,
  scrBackg2,
  fuel,
  fuelRandomX;
var playerSpeed = 30; //fix hardcode
var playerYSpeed = 30; //fix hardcode
var truckMaxSpeed = 10; //fix hardcode
var truckMinSpeed = 5; //fix hardcode
var playerMaxHealth = 500;
var playerHealth = playerMaxHealth;
var playerMaxFuel = 250;
var playerFuel = playerMaxFuel;
var speedDistanceCovered = 0;
var distanceCovered = 0;
var BackgY;
var BackgY2 = 0;
var fuelDelay = 0;
var randomSetFuel = 0;
var fuelRandomNum = [6, 8, 10];
var playerImg, truckImg, roadImg, fuelImg, policeCImg, coolCar1Img, car2Img;
var truckRandomImg;
var truck1Img, truck2Img, truck3Img, truck4Img;
var carWidth, carHeight;
var backgSpeed = 15; //fix hardcode
var glugSound, scrapeSound;
var truckDamage = 50;
var SD = null;
var PLAY = 1;
var END = 0;
var MENU = 2;
var gameState = MENU;
var startButton, soundButton;
var menuRect, titleText, msText, scoreText;
var metersSaved;
var database, highScore, highS;
var canW;
var canH;
var canArea;
var BY;
var BY2;
var gameFont;
var BGMusic;

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerImg = loadImage("Images/Car.png");
  truckImg = loadImage("Images/Ambulance2.png");
  roadImg = loadImage("Images/RoadImg.png");
  fuelImg = loadImage("Images/Fuel.png");
  policeCImg = loadImage("Images/Police2.png");
  coolCar1Img = loadImage("Images/audi2.png");
  car2Img = loadImage("Images/Black_viper2.png");

  glugSound = loadSound("glug.mp3");
  scrapeSound = loadSound("scrape.mp3");

  gameFont = loadFont("GameFont.ttf");

  canW = width;
  canH = height;
  canArea = canH * canW;

  carWidth = canW / 10;
  carHeight = canH / 7;

  BY = canH / 5;
  BY2 = BY - canH * 1.9;

  var truckRandomY = random(canH / 1.02, canH / 0.8);

  truckRandomImg = [policeCImg, coolCar1Img, car2Img, truckImg];

  truck1Img = random(truckRandomImg);
  truck2Img = random(truckRandomImg);
  truck3Img = random(truckRandomImg);
  truck4Img = random(truckRandomImg);

  // Sundeep code changes start
  //const canvasElt = createCanvas(490, 871).elt;
  //canvasElt.style.width = '50%', canvasElt.style.height = '50%';
  // Sundeep code changes end


  player = createSprite(canW / 2, canH / 2, carWidth / 2, carHeight / 2);
  truck = new Truck(
    (canW * (800 / 480)) / 2,
    truckRandomY,
    carWidth,
    carHeight,
    random(truckMinSpeed, truckMaxSpeed),
    truck1Img
  );
  truck2 = new Truck(
    (canW * (600 / 480)) / 2,
    truckRandomY + random(200, 400),
    carWidth,
    carHeight,
    random(truckMinSpeed, truckMaxSpeed),
    truck2Img
  );
  truck3 = new Truck(
    (canW * (400 / 480)) / 2,
    truckRandomY + random(100, 200),
    carWidth,
    carHeight,
    random(truckMinSpeed, truckMaxSpeed),
    truck3Img
  );
  truck4 = new Truck(
    (canW * (200 / 480)) / 2,
    truckRandomY + random(500, 600),
    carWidth,
    carHeight,
    random(truckMinSpeed, truckMaxSpeed),
    truck4Img
  );
  fuel = new Fuel(
    (Math.round(random(fuelRandomNum)) * 100) / 2,
    -truckRandomY,
    canW / 10,
    canH / 10,
    10,
    fuelImg
  );

  startButton = createImg("Images/PlayButton.png");
  startButton.size(canW / 2.5, canH / 7);
  startButton.position(canW / 3.3, canH / 2.25);

  database = firebase.database();

  highScore = database.ref("HighScore");
  highScore.on("value", readScore);

  BGMusic = createAudio("bgmusic.mp3");
}

function draw() {
  player.depth = player.depth + 1;

  if (gameState === PLAY) {
    if (playerFuel <= 0) {
      gameState = END;
    }

    if (playerHealth <= 0) {
      gameState = END;
    }

    background(140, 190, 150);

    imageMode(CENTER);
    scrBackg = image(roadImg, canW / 2, BY, canW * 1.4, canH * 1.9);
    scrBackg2 = image(roadImg, canW / 2, BY2, canW * 1.4, canH * 1.9);

    BY += backgSpeed;
    BY2 += backgSpeed;

    if (BY >= canH + (canH * 1.9) / 2) {
      BY = -(canH * 1.9) / 2;
    }

    if (BY2 >= canH + (canH * 1.9) / 2) {
      BY2 = -(canH * 1.9) / 2;
    }

    truck.changeImage(truck1Img);
    truck2.changeImage(truck2Img);
    truck3.changeImage(truck3Img);
    truck4.changeImage(truck4Img);

    truck.display();
    truck2.display();
    truck3.display();
    truck4.display();
    fuel.display();

    speedDistanceCovered += 1;
    distanceCovered = speedDistanceCovered / 20;

    rectMode(CENTER);
    fill(255, 255, 0, 65);
    stroke("yellow");
    strokeWeight(5);
    rect(canW / 2, canH / 17, canW, canH / 8);

    rectMode(CORNER);
    fill("black");
    strokeWeight(5);
    stroke("yellow");
    rect(canW / 4, canH / 12, canW / 2, canH / 12);

    strokeWeight(5);
    stroke("black");
    textAlign(CENTER);
    textFont(gameFont);
    textSize(Math.floor(canH) / 13);
    fill("yellow");
    //text(distanceCovered.toFixed(1) + ' m', (canW/2), canH/6.8);
    text(getFrameRate().toFixed(1), canW / 2, canH / 6.8);
    text("W:" + canW + ", H:" + canH, canW / 2, canH / 4);

    fill("black");
    strokeWeight(7);
    rect(canW / 14, canH / 40, canW / (6 / 5), canH / 60);

    fill("red");
    strokeWeight(0);
    if (playerHealth > 0)
      rect(
        canW / 14,
        canH / 40,
        ((playerHealth / playerMaxHealth) * canW) / (6 / 5),
        canH / 60
      );

    fill("black");
    strokeWeight(7);
    rect(canW / 14 + canW / (24 / 15), canH / 20, canW / (24 / 5), canH / 60);

    fill("Green");
    strokeWeight(0);
    if (playerFuel > 0)
      rect(
        canW / 14 + canW / (24 / 15),
        canH / 20,
        ((playerFuel / playerMaxFuel) * canW) / (24 / 5),
        canH / 60
      );

    playerFuel -= 0.5;

    player.addImage(playerImg);
    playerImg.resize(canW / 3.5, canH / 6);

    //Player Movements

    if (keyDown(RIGHT_ARROW) || mouseX > canW / 2) {
      if (player.x < canW / 1.2) player.x += playerSpeed;
    }
    if (keyDown(LEFT_ARROW) || mouseX < canW / 2) {
      if (player.x > canW / 8.57) player.x -= playerSpeed;
    }

    if (keyDown(UP_ARROW) || mouseY < canH / 2) {
      if (player.y >= canH / 4) player.y -= playerYSpeed - 10;

      if (player.y <= canH / 4) SD = false;
    } else {
      SD = true;
    }

    if (player.y < canH / 1.15 && SD) player.y += playerYSpeed - canH / 40;

    if (isTouching(player, truck)) {
      scrapeSound.play();
      playerHealth -= truckDamage;
      truck.y = displayHeight + truckDelay;
    }
    if (isTouching(player, truck2)) {
      scrapeSound.play();
      playerHealth -= truckDamage;
      truck2.y = displayHeight + truckDelay;
    }
    if (isTouching(player, truck3)) {
      scrapeSound.play();
      playerHealth -= truckDamage;
      truck3.y = displayHeight + truckDelay;
    }
    if (isTouching(player, truck4)) {
      scrapeSound.play();
      playerHealth -= truckDamage;
      truck4.y = displayHeight + truckDelay;
    }

    truckDelay = random(canH * 1.68, canH * 2.1); //fix hardcode

    if (truck.y < displayHeight - truckDelay) {
      truck.y = displayHeight;
      truck1Img = random(truckRandomImg);
    }
    truckDelay = random(canH * 1.68, canH * 2.1); //fix hardcode

    if (truck2.y < displayHeight - truckDelay) {
      truck2.y = displayHeight;
      truck2Img = random(truckRandomImg);
    }
    truckDelay = random(canH * 1.68, canH * 2.1); //fix hardcode

    if (truck3.y < displayHeight - truckDelay) {
      truck3.y = displayHeight;
      truck3Img = random(truckRandomImg);
    }
    truckDelay = random(canH * 1.68, canH * 2.1); //fix hardcode

    if (truck4.y < displayHeight - truckDelay) {
      truck4.y = displayHeight;
      truck4Img = random(truckRandomImg);
    }
    truckDelay = random(canH * 1.68, canH * 2.1); //fix hardcode

    randomSetFuel = Math.round(random(fuelRandomNum));

    if (fuelNeedRestart()) {
      fuelRandomX = randomSetFuel;

      fuel.y = -displayHeight - fuelDelay;
      fuel.x = (displayWidth - randomSetFuel * 100) / 2;
    }
    fuelDelay = random(canH * 0.98, canH * 1.42); //fix hardcode

    drawSprites();
  } else if ((gameState = MENU)) {
    BGMusic.stop();
    if (distanceCovered > metersSaved) {
      metersSaved = distanceCovered.toFixed(1);
    }
    if (metersSaved !== undefined) {
      updateHighscore(metersSaved);
    }

    fill("darkred");
    menuRect = rect(0, 0, canW * 2, canH * 2);
    fill("yellow");
    textSize(Math.floor(canH) / 13);

    textAlign(CENTER);
    textFont(gameFont);

    titleText = text("Car Crashers", canW / 2, canH / 4);
    msText = text("High Score", canW / 2, canH / 1.3);
    scoreText = text(
      metersSaved === undefined ? "loading...." : metersSaved + " m",
      canW / 2,
      canH / 1.1
    );
    startButton.show();

    startButton.mousePressed(() => {
      BGMusic.loop();
      gameState = PLAY;
      playerFuel = playerMaxFuel;
      playerHealth = playerMaxHealth;
      speedDistanceCovered = 0;
      startButton.hide();
    });
  }
}

function isTouching(object1, object2) {
  if (
    object1.x - object2.x < object2.width / 2 + object1.width / 2 &&
    object2.x - object1.x < object2.width / 2 + object1.width / 2 &&
    object1.y - object2.y < object2.height / 2 + object1.height / 2 &&
    object2.y - object1.y < object2.height / 2 + object1.height / 2
  ) {
    return true;
  } else {
    return false;
  }
}

function fuelNeedRestart() {
  if (isTouching(player, fuel)) {
    glugSound.play();

    if (playerFuel <= 125) {
      playerFuel += 125;
    } else {
      playerFuel = 250;
    }
  }

  if (fuel.y > displayHeight || isTouching(player, fuel)) {
    return true;
  } else {
    return false;
  }
}

function readScore(data) {
  metersSaved = data.val();
}

async function updateHighscore(x) {
  await database.ref("/").set({
    HighScore: parseInt(x).toFixed(1)
  });
}
