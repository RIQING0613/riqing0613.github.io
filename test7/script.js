// 创建一个Phaser游戏实例，并设置游戏窗口大小为480x320，使用CANVAS渲染模式
const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload, // 预加载函数
  create, // 创建游戏场景
  update, // 更新游戏场景
});

let ball; // 定义一个全局变量ball，用于存储小球对象
let paddle; // 存储球拍对象
let bricks; // 存储砖块组对象
let newBrick; // 存储新创建的砖块对象
let brickInfo; // 定义一个全局变量存储砖块信息
let scoreText; // 得分文本对象
let score = 0; // 存储得分
let lives = 3; // 定义一个全局变量存储剩余生命值
let livesText; // 生命值文本对象
let lifeLostText; // 存储当玩家失去一条生命时将显示在屏幕上的文本标签
let playing = false; // 存储游戏是否正在进行的标志
let startButton; // 定义开始按钮对象

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // 设置缩放模式为SHOW_ALL，游戏窗口自适应，保持纵横比不变
  game.scale.pageAlignHorizontally = true; // 设置水平居中
  game.scale.pageAlignVertically = true; // 设置垂直居中
  game.stage.backgroundColor = "#eee"; // 设置背景颜色为灰色

  game.load.image("ball", "ball.png"); // 加载小球图片
  game.load.image("paddle", "paddle.png"); // 加载球拍图片
  game.load.image("brick", "brick.png"); // 加载砖块图片
  game.load.spritesheet("ball", "wobble.png", 20, 20); // 加载一个动画精灵表
  game.load.spritesheet("button", "button.png", 120, 40); // 加载开始按钮图片，图片大小为120x40
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE); // 启动物理系统
  game.physics.arcade.checkCollision.down = false; // 禁止小球与底部碰撞
  ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball'); // 创建一个对象，位置为(屏幕宽度的一半，屏幕底部-25)，使用之前加载的小球图片
  ball.animations.add("wobble", [0, 1, 0, 2, 0, 1, 0, 2, 0], 24); // 添加一个动画，名称为"wobble"，动画帧为[0, 1, 0, 2, 0, 1, 0, 2, 0]，每帧间隔为24毫秒
  ball.anchor.set(0.5); // 设置小球锚点为(0.5)，小球初始位置在(50, 50)
  game.physics.enable(ball, Phaser.Physics.ARCADE); // 启用物理系统，使小球具有物理属性
  ball.body.collideWorldBounds = true; // 小球碰到屏幕边缘时反弹
  ball.body.bounce.set(1); // 设置小球的弹性为1，即完全反弹
  ball.checkWorldBounds = true; // 当小球离开屏幕时触发事件
  ball.events.onOutOfBounds.add(ballLeaveScreen, this); // 当小球离开屏幕时调用ballLeaveScreen函数

  // 使用物理效果渲染球拍
  paddle = game.add.sprite(
      game.world.width * 0.5,
      game.world.height - 5,
      "paddle",
  ); // 创建一个对象，位置为(屏幕宽度的一半，屏幕底部)，使用之前加载的球拍图片
  paddle.anchor.set(0.5, 1); // 设置球拍锚点为(0.5, 1)，即球拍中心在(屏幕宽度的一半，屏幕底部)
  game.physics.enable(paddle, Phaser.Physics.ARCADE); // 启用物理系统，使球拍具有物理属性
  paddle.body.immovable = true; // 设置球拍为不可移动的，小球碰到球拍时球拍不会移动

  initBricks(); // 初始化砖块组

  textStyle = { font: '18px Arial', fill: '#0095DD' }; // 设置文本样式
  scoreText = game.add.text(5, 5, "Points: 0", textStyle); // 得分文本对象，位置为(5, 5)，文本内容为"Points: 0"，字体为Arial，字号为18，颜色为蓝色
  livesText = game.add.text(game.world.width - 5, 5, `Lives: ${lives}`, textStyle); // 生命值文本对象，位置为(屏幕宽度-5, 5)，文本内容为"Lives: 3"，字体为Arial，字号为18，颜色为蓝色
  livesText.anchor.set(1, 0); // 设置文本锚点为(1, 0)，即文本右对齐
  lifeLostText = game.add.text(
      game.world.width * 0.5,
      game.world.height * 0.5,
      "Life lost, click to continue",
      textStyle
  ); // 当玩家失去一条生命时将显示在屏幕上的文本标签
  lifeLostText.anchor.set(0.5); // 设置文本锚点为(0.5)，即文本居中
  lifeLostText.visible = false; // 设置文本不可见

  startButton = game.add.button(
      game.world.width * 0.5,
      game.world.height * 0.5,
      "button",
      startGame,
      this,
      1,
      0,
      2,
    ); // 创建一个按钮对象，位置为(屏幕宽度的一半，屏幕高度的一半)，使用之前加载的按钮图片，按钮按下时调用startGame函数
    startButton.anchor.set(0.5); // 设置按钮锚点为(0.5)，即按钮居中

}
function update() {
  // 游戏循环，每帧都会执行
  game.physics.arcade.collide(ball, paddle, ballHitPaddle); // 小球与球拍碰撞检测
  game.physics.arcade.collide(ball, bricks, ballHitBrick); // 小球与砖块碰撞检测
  
  if (playing) {
      paddle.x = game.input.x || game.world.width * 0.5;
  }// 使球拍在游戏开始时可移动
}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      col: 7,
    },
    offset: {
      top: 50,
      left: 60,
    }, // 砖块组的偏移量
    padding: 10, // 砖块之间的间距
  }; // 初始化砖块组信息，包括砖块大小、行数、列数、偏移量、间距等

  bricks = game.add.group(); // 创建一个组对象，用于存储砖块
  for (let c = 0; c < brickInfo.count.col; c++) {
      for (let r = 0; r < brickInfo.count.row; r++) {
          const brickX =
              c * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left; // 计算砖块x坐标
          const brickY =
              r * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top; // 计算砖块y坐标

          newBrick = game.add.sprite(brickX, brickY, "brick"); // 创建一个对象，位置为(砖块x坐标，砖块y坐标)，使用之前加载的砖块图片
          game.physics.enable(newBrick, Phaser.Physics.ARCADE); // 启用物理系统，使砖块具有物理属性
          newBrick.body.immovable = true; // 设置砖块为不可移动的，小球碰到砖块时砖块不会移动
          newBrick.anchor.set(0.5); // 设置砖块锚点为(0.5)
          bricks.add(newBrick); // 将砖块添加到砖块组中
      }
  }
}

// 当小球碰到球拍时，调用该函数
function ballHitPaddle(ball, paddle) {
  ball.animations.play("wobble"); // 播放"wobble"动画
  ball.body.velocity.x = -5 * (paddle.x - ball.x); // 设置小球x轴速度，新的速度越高，球拍中心和球击中位置之间的距离就越大。此外，方向（左或右）由该值决定 — 如果球击中球拍的左侧，它将向左弹起，而击中右侧会使其向右弹起
}  

// 当小球碰到砖块时，调用该函数
function ballHitBrick(ball, brick) {
  // 销毁砖块
  const killTween = game.add.tween(brick.scale); // 创建一个tween对象，用于缩放砖块
  killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None); // 设置缩放动画，将砖块缩放为(0, 0)，持续时间为200毫秒，使用线性插值
  killTween.onComplete.addOnce(() => {
      brick.kill();
  }, this); // 当缩放动画完成时，销毁砖块
  killTween.start(); // 开始缩放动画

  score += 10;
  scoreText.setText(`Points: ${score}`); // 更新得分

  if(score === brickInfo.count.row*brickInfo.count.col*10) {
      alert('You won the game, congratulations!');
      location.reload();
  } // 当得分等于砖块总数*10时，弹出alert提示框游戏胜利并重新加载页面
}
  let count_alive = 0;
  for (let i = 0; i < bricks.children.length; i++) {
      if (bricks.children[i].alive) {
          count_alive++;
      }
  } // 使用循环遍历组中的bricks，使用每个brick的方法检查每个brick的活跃度，计算存活的砖块数量
  if (count_alive === 0) {
      alert("You won the game, congratulations!");
      location.reload();
  } // 如果没有存活的砖块，则弹出alert提示框赢得游戏并重新加载页面

// 当小球离开屏幕时，调用该函数
function ballLeaveScreen() {
  lives--; // 生命值减1
  // 生命值不为0时
  if (lives) {
    livesText.setText(`Lives: ${lives}`); // 更新生命值文本
    lifeLostText.visible = true; // 显示生命丢失文本
    ball.reset(game.world.width * 0.5, game.world.height - 25); // 将小球重置到屏幕中心上方
    paddle.reset(game.world.width * 0.5, game.world.height - 5); // 将球拍重置到屏幕中心下方
    game.input.onDown.addOnce(() => {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this); // 当玩家点击屏幕时，将隐藏生命丢失文本，并将小球和球拍移动到屏幕中心上方和下方，并设置小球的速度
  } else {
    alert("You lost, game over!");
    location.reload();
  } // 生命值为0时，弹出alert提示框游戏结束并重新加载页面
}

// 当玩家点击开始按钮时，调用该函数
function startGame() {
  startButton.destroy(); // 销毁开始按钮
  ball.body.velocity.set(150, -150); // 设置小球的速度
  playing = true; // 设置游戏状态为正在玩
}
