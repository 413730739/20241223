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
const MOVE_SPEED = 8; 

// 飛彈相關 
let missiles1 = []; 
let missiles2 = []; 
const MISSILE_SPEED = 15; 

// 角色跳躍相關變數 
let char1Jumping = false; 
let char1JumpSpeed = 0; 
const GRAVITY = 0.5; 
const JUMP_FORCE = -18; 

let char2Jumping = false; 
let char2JumpSpeed = 0; 

// 攻擊持續時間 
const ATTACK_DURATION = 20; 
let char1AttackTimer = 0; 
let char2AttackTimer = 0; 
let char1AttackedTimer = 0;
let char2AttackedTimer = 0;
// 動畫設定 
let char1Health = 100; // 角色1的血量
let char2Health = 100; // 角色2的血量
let missile = {}; // 或者初始化為其他適當的值
let backgroundImage; // 宣告變數存放背景圖片
const characterAnimations = { 
  character1: { 
    stand: { width: 47, height: 84, frames: 4 }, 
    run: { width: 70, height: 83, frames: 8 }, 
    jump: { width: 60, height: 84, frames: 5 }, 
    attack: { width: 62, height: 80, frames: 3 }, 
    missile: { width:128, height: 46, frames: 5 } ,
    attacked: { width: 63, height: 79, frames: 5 }, 
  }, 
  character2: { 
    stand: { width: 51, height: 72, frames: 1 }, 
    run: { width: 62, height: 73, frames: 6 }, 
    jump: { width: 57, height: 74, frames: 3 }, 
    attack: { width: 130, height: 90, frames: 9 }, 
    missile: { width: 129, height:46, frames: 4 } ,
    attacked: { width: 70, height: 69, frames: 5 }, 
  } 
  
}; 

function drawCharacter(images, animation, frameIndex, x, y, isFlipped, animations) { 
  push(); 
  const anim = animations[animation]; 

  if (isFlipped) { 
    translate(x, y); 
    scale(-1, 1); 
    image( 
     
        images[animation],
        -anim.width / 2,
        -anim.height / 2,
        anim.width *2, // 放大一倍
        anim.height * 2, // 放大一倍
        frameIndex * anim.width,
        0,
        anim.width,
        anim.height
      );
      
  
  } else { 
    translate(x, y); 
 
      image(
        images[animation],
        -anim.width / 2,
        -anim.height / 2,
        anim.width * 2, // 放大一倍
        anim.height * 2, // 放大一倍
        frameIndex * anim.width,
        0,
        anim.width,
        anim.height
      );
      
  } 
  pop(); 
} 

function preload() {
  character1Images = {
    stand: loadImage('char1/stand.png'),
    run: loadImage('char1/run.png'),
    jump: loadImage('char1/jump.png'),
    attack: loadImage('char1/attack.png'),
    missile: loadImage('char1/missile.png'),
    attacked: loadImage('char1/attacked.png') // 新增受擊圖片
  };

  character2Images = {
    stand: loadImage('char2/stand.png'),
    run: loadImage('char2/run.png'),
    jump: loadImage('char2/jump.png'),
    attack: loadImage('char2/attack.png'),
    missile: loadImage('char2/missile.png'),
    attacked: loadImage('char2/attacked.png') // 新增受擊圖片
 
  };
  backgroundImage = loadImage('Backgrounds.png'); // 加載背景圖片
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
   image(backgroundImage, 0, 0, width, height); // 繪製背景圖片

  // 更新角色1的跳躍 
  if (char1Jumping) {
    char1Y += char1JumpSpeed;
    char1JumpSpeed += GRAVITY;
    if (char1Y >= windowHeight * 0.7) {
      char1Y = windowHeight * 0.7;
      char1Jumping = false;
      char1CurrentAnimation = 'stand';
    }
  }

  // 更新角色2的跳躍
  if (char2Jumping) {
    char2Y += char2JumpSpeed;
    char2JumpSpeed += GRAVITY;
    if (char2Y >= windowHeight * 0.7) {
      char2Y = windowHeight * 0.7;
      char2Jumping = false;
      char2CurrentAnimation = 'stand';
    }
  }

  // 更新飛彈 
  updateMissiles(); 

  // 更新攻擊計時器 
  if (char1AttackTimer > 0) {
    char1AttackTimer--;
    if (char1AttackTimer === 0) {
      char1CurrentAnimation = 'stand';
    }
  }
  if (char2AttackTimer > 0) {
    char2AttackTimer--;
    if (char2AttackTimer === 0) {
      char2CurrentAnimation = 'stand';
    }
  }

  // 更新受擊計時器
  if (char1AttackedTimer > 0) {
    char1AttackedTimer--;
    if (char1AttackedTimer === 0) {
      char1CurrentAnimation = 'stand';
    }
  }
  if (char2AttackedTimer > 0) {
    char2AttackedTimer--;
    if (char2AttackedTimer === 0) {
      char2CurrentAnimation = 'stand';
    }
  }

  drawCharacter(character1Images, char1CurrentAnimation, char1FrameIndex, char1X, char1Y, char1IsFlipped, characterAnimations.character1);

  // 繪製角色2
  drawCharacter(character2Images, char2CurrentAnimation, char2FrameIndex, char2X, char2Y, char2IsFlipped, characterAnimations.character2);

  // 繪製飛彈
  drawMissiles();

  // 更新動畫幀
  if (frameCount % FRAME_DELAY === 0) {
    char1FrameIndex = (char1FrameIndex + 1) % characterAnimations.character1[char1CurrentAnimation].frames;
    char2FrameIndex = (char2FrameIndex + 1) % characterAnimations.character2[char2CurrentAnimation].frames;
  }
   // 繪製角色1的名字和血量條
   const healthBarScale = 1; // 放大比例
   const barWidth = 200 * healthBarScale; // 放大後的血量條寬度
   const barHeight = 20 * healthBarScale; // 放大後的血量條高度
   const textSizeScale = 16 * healthBarScale; // 放大後的文字大小
 
   textSize(textSizeScale);
   fill(0); // 黑色文字
   text('玩家一', 20, 15 * healthBarScale); // 顯示角色1的名字在血量條上方
   fill(255, 0, 0); // 背景條顏色
   rect(20, 20 * healthBarScale, barWidth, barHeight); // 背景條
   fill(0, 255, 0); // 血量條顏色
   rect(20, 20 * healthBarScale, char1Health * 2 * healthBarScale, barHeight); // 根據血量繪製
   fill(0); // 黑色文字
   text(`HP: ${char1Health}`, 20, (55 * healthBarScale)); // 顯示角色1的剩餘能量
 
   // 繪製角色2的名字和血量條
   textSize(textSizeScale);
   fill(0); // 黑色文字
   text('玩家二', width - (220 * healthBarScale), 15 * healthBarScale); // 顯示角色2的名字在血量條上方
   fill(255, 0, 0); // 背景條顏色
   rect(width - (220 * healthBarScale), 20 * healthBarScale, barWidth, barHeight); // 背景條
   fill(0, 255, 0); // 血量條顏色
   rect(width - (220 * healthBarScale), 20 * healthBarScale, char2Health * 2 * healthBarScale, barHeight); // 根據血量繪製
   fill(0); // 黑色文字
   text(`HP: ${char2Health}`, width - (220 * healthBarScale), (55 * healthBarScale)); // 顯示角色2的剩餘能量

 drawCharacter(character1Images, char1CurrentAnimation, char1FrameIndex, char1X, char1Y, char1IsFlipped, characterAnimations.character1);
 drawCharacter(character2Images, char2CurrentAnimation, char2FrameIndex, char2X, char2Y, char2IsFlipped, characterAnimations.character2);

 // 繪製飛彈
 drawMissiles();

 if (frameCount % FRAME_DELAY === 0) {
  char1FrameIndex = (char1FrameIndex + 1) % characterAnimations.character1[char1CurrentAnimation].frames;
  char2FrameIndex = (char2FrameIndex + 1) % characterAnimations.character2[char2CurrentAnimation].frames;
}
  handleContinuousMovement(); 

  frameCount++; 
} 

let keysPressed = {}; 

function keyPressed() { 
  keysPressed[key] = true; 

  // 角色1跳躍 
  if ((key === 'w' || key === 'W') && !char1Jumping) { 
    char1Jumping = true; 
    char1JumpSpeed = JUMP_FORCE; 
    char1CurrentAnimation = 'jump'; 
    char1X += char1IsFlipped ? -MOVE_SPEED * 5 : MOVE_SPEED * 5; // 跳前移動 
  } 

  // 角色2跳躍 
  if (keyCode === UP_ARROW && !char2Jumping) { 
    char2Jumping = true; 
    char2JumpSpeed = JUMP_FORCE; 
    char2CurrentAnimation = 'jump'; 
    char2X += char2IsFlipped ? -MOVE_SPEED * 5 : MOVE_SPEED * 5; // 跳前移動 
  } 

  // 角色1攻擊 
  if ((key === 's' || key === 'S') && char1AttackTimer === 0) { 
    char1CurrentAnimation = 'attack'; 
    createMissile(1); 
    char1AttackTimer = ATTACK_DURATION; 
  } 

  // 角色2攻擊 
  if (keyCode === DOWN_ARROW && char2AttackTimer === 0) { 
    char2CurrentAnimation = 'attack'; 
    createMissile(2); 
    char2AttackTimer = ATTACK_DURATION; 
  } 
} 

function keyReleased() { 
  delete keysPressed[key]; 

  // 角色1控制 
  if (['w', 'W', 'a', 'A', 'd', 'D'].includes(key)) { 
    if (char1CurrentAnimation === 'run' || char1CurrentAnimation === 'jump') { 
      char1CurrentAnimation = 'stand'; 
    } 
  } 

  // 角色2控制 
  if ([UP_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) { 
    if (char2CurrentAnimation === 'run' || char2CurrentAnimation === 'jump') { 
      char2CurrentAnimation = 'stand'; 
    } 
  } 
} 

function handleContinuousMovement() { 
  if (keysPressed['a'] || keysPressed['A']) { 
    char1X -= MOVE_SPEED; 
    char1CurrentAnimation = 'run'; 
    char1IsFlipped = true; 
  } 
  if (keysPressed['d'] || keysPressed['D']) { 
    char1X += MOVE_SPEED; 
    char1CurrentAnimation = 'run'; 
    char1IsFlipped = false; 
  } 
  if (keysPressed['ArrowLeft']) { 
    char2X -= MOVE_SPEED; 
    char2CurrentAnimation = 'run'; 
    char2IsFlipped = true; 
  } 
  if (keysPressed['ArrowRight']) { 
    char2X += MOVE_SPEED; 
    char2CurrentAnimation = 'run'; 
    char2IsFlipped = false; 
  } 
} 

function drawMissiles() {
  // 繪製角色1的飛彈
  missiles1.forEach(m => {
    const anim = characterAnimations.character1.missile;
    const frame = Math.floor(m.frameIndex);

    push(); // 保存當前的畫布狀態
    translate(m.x, m.y);

    if (m.speed < 0) { // 如果飛彈速度為負，表示向左
      scale(-1, 1); // 水平翻轉
    }

    image(
      character1Images.missile,
      0, 0,
      anim.width *2, // 放大寬度
      anim.height *2, // 放大高度
      frame * anim.width,
      0,
      anim.width,
      anim.height
    );
    pop(); // 恢復畫布狀態
  });

  // 繪製角色2的飛彈
  missiles2.forEach(m => {
    const anim = characterAnimations.character2.missile;
    const frame = Math.floor(m.frameIndex);

    push(); // 保存當前的畫布狀態
    translate(m.x, m.y);

    if (m.speed < 0) { // 如果飛彈速度為負，表示向左
      scale(-1, 1); // 水平翻轉
    }

   
    image(
      character2Images.missile,
      0, 0,
      anim.width *2, // 放大寬度
      anim.height *2, // 放大高度
      frame * anim.width,
      0,
      anim.width,
      anim.height
    );
    pop(); // 恢復畫布狀態
  });
}


function createMissile(character) {
  if (character === 1) {
      let direction = char1IsFlipped ? -1 : 1; // 判断方向
      missiles1.push({
          x: char1X,
          y: char1Y,
          speed: MISSILE_SPEED * direction, // 根据方向设置速度
      });
  } else if (character === 2) {
      let direction = char2IsFlipped ? -1 : 1; // 判断方向
      missiles2.push({
          x: char2X,
          y: char2Y,
          speed: MISSILE_SPEED * direction, // 根据方向设置速度
      });
  }
}
function updateMissiles() {
  // 更新角色1的飛彈
  missiles1.forEach((missile, index) => {
    missile.x += missile.speed;

    // 檢測是否擊中角色2
    if (missile.x > char2X - 150 && missile.x < char2X + 150 && missile.y > char2Y - 150 && missile.y < char2Y + 150) {
      missiles1.splice(index, 1); // 移除飛彈
      char2CurrentAnimation = 'attacked'; // 切換到受擊動畫
      char2AttackedTimer = FRAME_DELAY * 5; // 設定受擊動畫時間
      char2Health = max(char2Health - 5, 0); // 扣除血量，最小值為0
    }
  });

  // 更新角色2的飛彈
  missiles2.forEach((missile, index) => {
    missile.x += missile.speed;

    // 檢測是否擊中角色1
    if (missile.x > char1X - 150 && missile.x < char1X + 150&& missile.y > char1Y - 150 && missile.y < char1Y + 150) {
      missiles2.splice(index, 1); // 移除飛彈
      char1CurrentAnimation = 'attacked'; // 切換到受擊動畫
      char1AttackedTimer = FRAME_DELAY * 5; // 設定受擊動畫時間
      char1Health = max(char1Health - 5, 0); // 扣除血量，最小值為0
    }
  });

  // 移除超出邊界的飛彈
  missiles1 = missiles1.filter((missile) => missile.x >= 0 && missile.x <= width);
  missiles2 = missiles2.filter((missile) => missile.x >= 0 && missile.x <= width);
}
