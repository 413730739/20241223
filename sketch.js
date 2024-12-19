let character1Images = {};
let character2Images = {};
let char1CurrentAnimation = 'stand';
let char2CurrentAnimation = 'stand';
let char1FrameIndex = 0;
let char2FrameIndex = 0;
const FRAME_DELAY = 5;
let frameCount = 0;
let char1IsFlipped = false;
let char2IsFlipped = false;

// 角色位置
let char1X = 0;
let char1Y = 0;
let char2X = 0;
let char2Y = 0;

// 移動速度設定
const MOVE_SPEED = 5;

// 飛彈相關
let missiles1 = [];
let missiles2 = [];
const MISSILE_SPEED = 8;

// 動畫設定
const characterAnimations = {
  character1: {
    stand: { width: 47, height: 84, frames: 4 },
    run: { width: 70, height: 83, frames: 8 },
    jump: { width: 60, height: 84, frames: 5},
    attack: { width: 62, height: 80, frames: 3}
  },
  character2: {
    stand: { width: 51, height: 72, frames: 1 },
    run: { width: 62, height: 73, frames: 6 },
    jump: { width: 57, height: 74, frames:3 },
    attack: { width: 130, height: 90, frames: 9 }
  }
};

function drawCharacter(images, animation, frameIndex, x, y, isFlipped, animations) {
  push();
  const anim = animations[animation];

  if (anim) { // 檢查動畫是否存在
    if (isFlipped) {
      translate(x + anim.width / 2, y);
      scale(-1, 1);
    } else {
      translate(x - anim.width / 2, y);
    }

    image(
      images[animation],
      0,
      -anim.height / 2,
      anim.width,
      anim.height,
      frameIndex * anim.width,
      0,
      anim.width,
      anim.height
    );
  }
  pop();
}

function preload() {
  // 載入角色1的圖片
  character1Images = {
    stand: loadImage('char1/stand.png'),
    run: loadImage('char1/run.png'),
    jump: loadImage('char1/jump.png'),
    attack: loadImage('char1/attack.png'),
    missile: loadImage('char1/missile.png')
  };

  // 載入角色2的圖片
  character2Images = {
    stand: loadImage('char2/stand.png'),
    run: loadImage('char2/run.png'),
    jump: loadImage('char2/jump.png'),
    attack: loadImage('char2/attack.png'),
    missile: loadImage('char2/missile.png')
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 設定初始位置
  char1X = windowWidth * 0.3;
  char1Y = windowHeight * 0.7;
  char2X = windowWidth * 0.7;
  char2Y = windowHeight * 0.7;
}

function draw() {
  background(220);
  
  // 更新飛彈
  updateMissiles();
  
  // 繪製角色1
  drawCharacter(character1Images, char1CurrentAnimation, char1FrameIndex, char1X, char1Y, char1IsFlipped, characterAnimations.character1);
  
  // 繪製角色2
  drawCharacter(character2Images, char2CurrentAnimation, char2FrameIndex, char2X, char2Y, char2IsFlipped, characterAnimations.character2);
  
  // 繪製飛彈
  drawMissiles();
  
  // 更新動畫幀
  if (frameCount % FRAME_DELAY === 0) {
    char1FrameIndex = (char1FrameIndex + 1) % characterAnimations.character1[char1CurrentAnimation].frames;
    char2FrameIndex = (char2FrameIndex + 1) % characterAnimations.character2[char2CurrentAnimation].frames;
    frameCount++;
  }
}



function keyPressed() {
  // 角色1控制
  if (key === 'w' || key === 'W') {
    char1CurrentAnimation = 'jump';
  } else if (key === 'a' || key === 'A') {
    char1CurrentAnimation = 'run';
    char1IsFlipped = false;
  } else if (key === 'd' || key === 'D') {
    char1CurrentAnimation = 'run';
    char1IsFlipped = true;
  } else if (key === 's' || key === 'S') {
    char1CurrentAnimation = 'attack';
    createMissile(1);
  }

  // 角色2控制
  if (keyCode === UP_ARROW) {
    char2CurrentAnimation = 'jump';
  } else if (keyCode === LEFT_ARROW) {
    char2CurrentAnimation = 'run';
    char2IsFlipped = false;
  } else if (keyCode === RIGHT_ARROW) {
    char2CurrentAnimation = 'run';
    char2IsFlipped = true;
  } else if (keyCode === DOWN_ARROW) {
    char2CurrentAnimation = 'attack';
    createMissile(2);
  }
}

function keyReleased() {
  // 角色1控制
  if (['w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(key)) {
    if (char1CurrentAnimation !== 'attack') { // 保持攻擊動畫直到結束
      char1CurrentAnimation = 'stand';
    }
  }

  // 角色2控制
  if ([UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW].includes(keyCode)) {
    if (char2CurrentAnimation !== 'attack') { // 保持攻擊動畫直到結束
      char2CurrentAnimation = 'stand';
    }
  }
}


function checkMissileCollision() {
  // 檢查飛彈與對方角色的碰撞
  missiles1.forEach(m => {
    if (m.x > char2X - 50 && m.x < char2X + 50 && m.y > char2Y - 50 && m.y < char2Y + 50) {
      // 處理飛彈擊中角色2
      console.log("角色1的飛彈擊中角色2！");
      missiles1 = missiles1.filter(missile => missile !== m);
    }
  });

  missiles2.forEach(m => {
    if (m.x > char1X - 50 && m.x < char1X + 50 && m.y > char1Y - 50 && m.y < char1Y + 50) {
      // 處理飛彈擊中角色1
      console.log("角色2的飛彈擊中角色1！");
      missiles2 = missiles2.filter(missile => missile !== m);
    }
  });
}

function updateMissiles() {
  // 更新飛彈位置
  missiles1 = missiles1.filter(m => {
    m.x += m.direction * MISSILE_SPEED;
    return m.x > 0 && m.x < windowWidth;
  });
  
  missiles2 = missiles2.filter(m => {
    m.x += m.direction * MISSILE_SPEED;
    return m.x > 0 && m.x < windowWidth;
  });
}

function drawMissiles() {
  // 繪製飛彈
  missiles1.forEach(m => {
    image(character1Images.missile, m.x, m.y);
  });
  
  missiles2.forEach(m => {
    image(character2Images.missile, m.x, m.y);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}