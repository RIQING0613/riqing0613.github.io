// 图片资源URLs
const explorerImageSrc = 'explorer.png';
const libraryImageSrc = 'library.png';
const templeImageSrc = 'temple.png';
const guardImageSrc = 'guard.png';

// 图片对象
let explorerImage = new Image();
let libraryImage = new Image();
let templeImage = new Image();
let guardImage = new Image();

// 初始化图片对象
explorerImage.src = explorerImageSrc;
libraryImage.src = libraryImageSrc;
templeImage.src = templeImageSrc;
guardImage.src = guardImageSrc;

// 确保图片加载完成后再开始游戏
window.onload = function () {
    document.getElementById('start-btn').addEventListener('click', startGame);
};

// 陷阱对象数组
const traps = [];

class Trap {
    constructor(x, y, radius, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type = type; // 例如 "fire", "ice", "illusion"
        this.active = true;
    }
}

function drawTrap(trap) {
    ctx.beginPath();
    ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
    if (trap.type === "fire") {
        ctx.fillStyle = "orange";
    } else if (trap.type === "ice") {
        ctx.fillStyle = "lightblue";
    } else {
        ctx.fillStyle = "purple";
    }
    ctx.fill();
}

class TreasureGuardian {
    constructor(x, y, radius, strength) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strength = strength;
    }
}

function drawGuardian(guardian) {
    ctx.beginPath();
    ctx.arc(guardian.x, guardian.y, guardian.radius, 0, Math.PI * 2);
    ctx.fillStyle = "gold";
    ctx.fill();
}

class TreasureMap {
    static async getInitialClue() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("在古老的图书馆里找到了第一个线索...");
            }, 1000);
        });
    }

    static async decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!");
                }
                resolve("解码成功!宝藏在一座古老的神庙中...");
            }, 1500);
        });
    }
}

// 设置图书馆、神庙、探险者和守卫的初始位置
const library = {x: 100, y: 100, radius: 10};
const temple = {x: 500, y: 500, radius: 20};
let explorer = {x: 0, y: 0, radius: 10};
let guard = {x: 150, y: 150, radius: 10};
const gridSize = 700;
let gameRunning = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = gridSize;
canvas.height = gridSize;

function drawCircle(position, color) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLibrary() {
    const imageSize = library.radius * 6;
    ctx.drawImage(libraryImage, library.x - imageSize / 2, library.y - imageSize / 2, imageSize, imageSize);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('图书馆', library.x - 40, library.y + 10);
}

// 绘制神庙的函数
function drawTemple() {
    const imageSize = temple.radius * 6;
    ctx.drawImage(templeImage, temple.x - imageSize / 2, temple.y - imageSize / 2, imageSize, imageSize);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('神庙', temple.x - 40, temple.y + 10);
}

function drawExplorer() {
    // 假设图片的大小是半径的两倍
    const imageSize = explorer.radius * 5;
    ctx.drawImage(explorerImage, explorer.x - imageSize / 2, explorer.y - imageSize / 2, imageSize, imageSize);
}

// 绘制守卫的函数
function drawGuard() {
    const imageSize = guard.radius * 5;
    ctx.drawImage(guardImage, guard.x - imageSize / 2, guard.y - imageSize / 2, imageSize, imageSize);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCollisionWith(position1, position2) {
    const dx = position1.x - position2.x;
    const dy = position1.y - position2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadii = position1.radius + position2.radius;
    return distance <= combinedRadii;
}

function checkCollisionWithTrap(explorer) {
    for (let i = 0; i < traps.length; i++) {
        const trap = traps[i];
        if (trap.active && checkCollisionWith(explorer, {x: trap.x, y: trap.y, radius: trap.radius})) {
            if (trap.type === "fire") {
                currentMessage = "你获得了小珠子！再接再厉吧！";
                // 可以添加逻辑让探险者速度减慢，例如减少每次移动的步长
            } else if (trap.type === "ice") {
                currentMessage = "你获得了小珠子！再接再厉吧";
                // 可以添加逻辑让探险者停止移动一段时间
            } else {
                currentMessage = "你获得了小珠子！再接再厉吧";
                // 可以添加逻辑让探险者随机移动一小段时间
            }
            trap.active = false;
            draw();
            return true;
        }
    }
    return false;
}

function displayMessage(message) {
    console.log(message);
}

function drawMessage(message) {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'pink';
    ctx.fillText(message, 10, canvas.height - 10);
}

function draw() {
    clearCanvas();
    drawLibrary();
    drawTemple();
    drawExplorer();
    if (guardActive) {
        drawGuard();
    }
    for (let i = 0; i < traps.length; i++) {
        const trap = traps[i];
        if (trap.active) {
            drawTrap(trap);
        }
    }
    if (currentMessage) {
        drawMessage(currentMessage);
    }
    if (typeof treasureGuardian!== 'undefined') {
        drawGuardian(treasureGuardian);
    }
}

document.getElementById('start-btn').addEventListener('click', function () {
    if (!gameRunning) {
        startGame();
    }
});

let guardActive = false;
let currentMessage = "";

function startGame() {
    gameRunning = true;
    // 生成5个陷阱
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * gridSize;
        const y = Math.random() * gridSize;
        const radius = 5;
        const type = ["fire", "ice", "illusion"][Math.floor(Math.random() * 3)];
        const trap = new Trap(x, y, radius, type);
        traps.push(trap);
    }
    // 探险者前往图书馆
    (async function exploreToLibrary() {
        try {
            while (!checkCollisionWith(explorer, library)) {
                moveExplorerTo(library);
                draw();
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 在图书馆找到线索
            currentMessage = await TreasureMap.getInitialClue();
            draw();
            // 解码线索
            currentMessage = await TreasureMap.decodeAncientScript(currentMessage);
            draw();

            // 探险者前往神庙，激活守卫
            guardActive = true;
            const treasureGuardian = new TreasureGuardian(temple.x, temple.y, 15, 100);
            while (!checkCollisionWith(explorer, guard) &&!checkCollisionWith(explorer, temple)) {
                if (!gameRunning) return;
                if (guardActive) {
                    moveGuardAroundTemple();
                }
                if (checkCollisionWith(explorer, treasureGuardian)) {
                    currentMessage = "你遇到了宝藏守护者!";
                    draw();
                    // 可以添加战斗逻辑，例如通过点击或输入指令进行战斗
                    // 根据探险者的能力和守护者的强度决定战斗结果
                }
                moveExplorerTo(temple);
                draw();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            // 停止游戏和角色移动
            gameRunning = false;
            guardActive = false;

            if (checkCollisionWith(explorer, guard)) {
                currentMessage = "糟糕，遇到了神庙守卫，游戏结束。";
                draw();
            } else if (checkCollisionWith(explorer, temple)) {
                currentMessage = "找到了一个神秘的箱子...";
                draw();
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 最终找到宝藏并结束游戏
                currentMessage = "恭喜!你找到了传说中的宝藏!游戏结束!";
                draw();
            }
        } catch (error) {
            displayMessage("任务失败: " + error);
            draw();
        } finally {

        }
    })();
}

function moveExplorerTo(target) {
    const stepSize = 10;
    const maxDeviation = 20;
    let deviationX = 0;
    let deviationY = 0;
    if (checkCollisionWith(explorer, library)) {
        deviationX = (Math.random() * 2 - 1) * maxDeviation;
        deviationY = (Math.random() * 2 - 1) * maxDeviation;
    }
    deviationX = Math.min(Math.max(deviationX, -maxDeviation), maxDeviation);
    deviationY = Math.min(Math.max(deviationY, -maxDeviation), maxDeviation);
    if (checkCollisionWithTrap(explorer)) {
        // 根据陷阱类型添加特殊逻辑，这里假设简单处理为暂停移动一次
        return;
    }
    explorer.x = Math.min(Math.max(explorer.x + stepSize + deviationX, 0), gridSize - explorer.radius);
    explorer.y = Math.min(Math.max(explorer.y + stepSize + deviationY, 0), gridSize - explorer.radius);
}


function moveGuardAroundTemple() {
    // 守卫的移动逻辑保持不变，但是只有在 guardActive 为 true 时才会移动
    if (guardActive) {
        const directions = ['up', 'down', 'left', 'right'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const moveDistance = guard.radius * 3;

        switch (direction) {
            case 'up':
                guard.y = Math.max(guard.radius, guard.y - moveDistance);
                break;
            case 'down':
                guard.y = Math.min(gridSize - guard.radius, guard.y + moveDistance);
                break;
            case 'left':
                guard.x = Math.max(guard.radius, guard.x - moveDistance);
                break;
            case 'right':
                guard.x = Math.min(gridSize - guard.radius, guard.x + moveDistance);
                break;
        }
    }
}