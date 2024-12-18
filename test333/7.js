// 确保 hideLanzhou2Box 函数在全局作用域中定义
function hideLanzhou2Box() {
    const lanzhou2Box = document.getElementById('lanzhou2-box');
    lanzhou2Box.style.display = 'none';
}

// 确保 hideQingdao2Box 函数在全局作用域中定义
function hideQingdao2Box() {
    const qingdao2Box = document.getElementById('qingdao2-box');
    qingdao2Box.style.display = 'none';
}

// 确保 hideShanxi2Box 函数在全局作用域中定义
function hideShanxi2Box() {
    const shanxi2Box = document.getElementById('shanxi2-box');
    shanxi2Box.style.display = 'none';
}

// 确保 hideChongqing2Box 函数在全局作用域中定义
function hideChongqing2Box() {
    const chongqing2Box = document.getElementById('chongqing2-box');
    chongqing2Box.style.display = 'none';
}

// 添加一个全局变量来存储音频对象
let audioPlayer;

// 定义一个函数来播放音频
function playAudio(src) {
    // 创建一个新的音频对象
    audioPlayer = new Audio(src);
    // 设置循环播放
    audioPlayer.loop = true;
    // 播放音频
    audioPlayer.play();
    // 监听音频是否因为错误而停止，如果是，则重新播放
    audioPlayer.addEventListener('ended', function() {
        audioPlayer.play();
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // 生成随机ID
    function generateUniqueId() {
        return 'ID_' + Math.floor(Math.random() * 1000000);
    }

    // 检查ID和昵称是否唯一并保存
    function checkIdAndNicknameUnique(id, nickname, callback) {
        const players = JSON.parse(localStorage.getItem('players')) || {};
        if (players[id] && players[id].nickname !== nickname) {
            callback(false); // ID已存在但昵称不匹配
        } else if (players[id]) {
            callback(true); // ID和昵称匹配
        } else {
            players[id] = { nickname }; // 添加新的ID和昵称
            localStorage.setItem('players', JSON.stringify(players)); // 更新存储
            callback(true); // 新的ID和昵称
        }
    }

    // 保存游戏历史
    function saveGameHistory(playerId) {
        const movableTarget = document.getElementById('movable-target');
        const left = parseFloat(movableTarget.style.left || '0');
        const top = parseFloat(movableTarget.style.top || '0');
        const gameHistory = {
            position: { left, top }
        };
        const gameHistories = JSON.parse(localStorage.getItem('gameHistories')) || {};
        gameHistories[playerId] = gameHistory;
        localStorage.setItem('gameHistories', JSON.stringify(gameHistories));
    }

    // 恢复游戏历史
    function restoreGameHistory(playerId) {
        const gameHistories = JSON.parse(localStorage.getItem('gameHistories')) || {};
        const gameHistory = gameHistories[playerId];
        if (gameHistory) {
            const movableTarget = document.getElementById('movable-target');
            movableTarget.style.left = `${gameHistory.position.left}px`;
            movableTarget.style.top = `${gameHistory.position.top}px`;
        }
    }

    // 显示开始游戏框
    function showStartGameBox() {
        const startGameBox = document.getElementById('start-game-box');
        startGameBox.style.display = 'block';
    }

    // 隐藏开始游戏框
    function hideStartGameBox() {
        const startGameBox = document.getElementById('start-game-box');
        startGameBox.style.display = 'none';
    }

    // 修改现有的绑定开始游戏按钮事件的代码
document.getElementById('start-game-button').addEventListener('click', function() {
    const nicknameInput = document.getElementById('nickname-input');
    const idInput = document.getElementById('id-input');
    const nickname = nicknameInput.value.trim();
    const id = idInput.value.trim();
    if (nickname === '' || id === '') {
        alert('请输入您的ID和昵称！');
        return;
    }
    checkIdAndNicknameUnique(id, nickname, isUnique => {
        if (isUnique) {
            localStorage.setItem('playerId', id); // 存储玩家ID
            localStorage.setItem('playerNickname', nickname); // 存储玩家昵称
            hideStartGameBox(); // 隐藏开始游戏框
            restoreGameHistory(id); // 恢复游戏历史
            // 调用playAudio函数来播放音频
            playAudio('BGM.mp3');
            continuePreviousLogic(); // 继续之前的逻辑
        } else {
            alert('ID已经存在哦');
        }
    });
});

    // 页面加载完成后显示开始游戏框
    showStartGameBox();

    // 继续之前的逻辑
    function continuePreviousLogic() {
        // 在这里添加之前所有的逻辑代码
        // 例如：
        const mapContainer = document.getElementById('map-container');
        const mapImage = document.getElementById('map-image');
        const movableTarget = document.getElementById('movable-target');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        // 鼠标按下事件，开始拖动
        const handleMouseDown = (event) => {
            if (event.target.id !== 'movable-target') return;
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            startLeft = parseFloat(movableTarget.style.left || '0');
            startTop = parseFloat(movableTarget.style.top || '0');
        };

        // 鼠标移动事件，拖动中
        const handleMouseMove = (event) => {
            if (!isDragging) return;
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            movableTarget.style.left = `${startLeft + dx}px`;
            movableTarget.style.top = `${startTop + dy}px`;
        };

        // 鼠标松开事件，停止拖动
        const handleMouseUp = () => {
            isDragging = false;
            saveGameHistory(localStorage.getItem('playerId')); // 存储游戏状态
        };

        // 添加事件监听器
        mapImage.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // 键盘按下事件，移动目标或触发区域点击
        document.addEventListener('keydown', (event) => {
            if (event.target.type === 'textarea' || event.target.type === 'text' || event.target.type === 'button') return;
            const step = 5;
            let left = parseFloat(movableTarget.style.left || '0');
            let top = parseFloat(movableTarget.style.top || '0');
            switch (event.key) {
                case 'ArrowUp':
                    top -= step;
                    break;
                case 'ArrowDown':
                    top += step;
                    break;
                case 'ArrowLeft':
                    left -= step;
                    break;
                case 'ArrowRight':
                    left += step;
                    break;
                case ' ': // 空格键触发区域点击
                    triggerAreaClick();
                    break;
                default:
                    return;
            }
            movableTarget.style.left = `${left}px`;
            movableTarget.style.top = `${top}px`;
            saveGameHistory(localStorage.getItem('playerId')); // 存储游戏状态
        });

        // 触发区域点击的函数
        const triggerAreaClick = () => {
            const targetRect = movableTarget.getBoundingClientRect();
            const areas = document.querySelectorAll('area');
            areas.forEach(area => {
                // 将movableTarget的坐标转换为相对于图片的坐标
                const mapRect = mapImage.getBoundingClientRect();
                const relativeLeft = targetRect.left - mapRect.left + mapContainer.scrollLeft;
                const relativeTop = targetRect.top - mapRect.top + mapContainer.scrollTop;

                const coords = area.coords.split(',');
                const areaRect = {
                    left: parseInt(coords[0], 10),
                    top: parseInt(coords[1], 10),
                    right: parseInt(coords[0], 10) + parseInt(coords[2], 10),
                    bottom: parseInt(coords[1], 10) + parseInt(coords[3], 10)
                };

                if (
                    relativeLeft >= areaRect.left &&
                    relativeLeft <= areaRect.right &&
                    relativeTop >= areaRect.top &&
                    relativeTop <= areaRect.bottom
                ) {
                    area.click(); // 触发area的点击事件
                }
            });
        };

        // 显示消息框
        const showMessageBox = (message) => {
            return new Promise((resolve) => {
                const messageBox = document.getElementById('message-box');
                messageBox.textContent = message;
                messageBox.style.display = 'block';
                setTimeout(() => {
                    messageBox.style.display = 'none';
                    resolve();
                }, 1000); // 1秒后隐藏消息框
            });
        };

        // 显示图片
        const showImage = (src) => {
            return new Promise((resolve) => {
                const imageBox = document.getElementById('image-box');
                imageBox.style.backgroundImage = `url(${src})`;
                imageBox.style.display = 'block';
                setTimeout(() => {
                    imageBox.style.display = 'none';
                    resolve();
                }, 1000); // 1秒后隐藏图片
            });
        };

        // 显示视频
        const showVideo = (src) => {
            return new Promise((resolve) => {
                const videoBox = document.getElementById('video-box');
                videoBox.innerHTML = `
                    <video id="videoPlayer" src="${src}" controls></video>
                    <button id="closeVideoButton" class="close-button">X</button>
`;
videoBox.style.display = 'block';
const closeButton = document.getElementById('closeVideoButton');
closeButton.addEventListener('click', function() {
videoBox.style.display = 'none';
videoBox.innerHTML = ''; // 移除视频元素和关闭按钮
resolve();
});
});
};    // 显示陷阱框
const showTrapBox = () => {
    return new Promise((resolve) => {
        const trapBox = document.getElementById('trap-box');
        trapBox.textContent = "啊！掉进陷阱了！";
        trapBox.style.display = 'block';
        setTimeout(() => {
            trapBox.style.display = 'none';
            resolve();
        }, 1000);
    });
};

// 显示青岛框
const showQingdaoBox = async () => {
    const qingdaoBox = document.getElementById('qingdao-box');
    qingdaoBox.style.display = 'block';
    qingdaoBox.innerHTML = '<p>请问“暖手的是热茶，暖心的是你一句话”是哪首歌曲中的歌词？</p><button id="qingdaoButtonA">将故事写成我们</button><button id="qingdaoButtonB">手心的蔷薇</button>';
    await new Promise((resolve) => {
        document.getElementById('qingdaoButtonA').addEventListener('click', function() {
            hideQingdaoBox();
            showVideo('96de590d7ed68b8aa8b54e29a8ea3557.mp4').then(() => {
                showQingdao2Box(); // 青岛视频结束后显示 qingdao2-box
                resolve();
            });
        });
        document.getElementById('qingdaoButtonB').addEventListener('click', function() {
            hideQingdaoBox();
            showTrapBox().then(() => {
                showQingdao2Box(); // 陷阱框结束后显示 qingdao2-box
                resolve();
            });
        });
    });
};

// 隐藏青岛框
const hideQingdaoBox = () => {
    const qingdaoBox = document.getElementById('qingdao-box');
    qingdaoBox.style.display = 'none';
};

// 显示青岛2框
const showQingdao2Box = async () => {
    const qingdao2Box = document.getElementById('qingdao2-box');
    const coords = "1200,200,1380,360".split(',');
    const left = parseInt(coords[0], 10);
    const top = parseInt(coords[1], 10);
    const width = parseInt(coords[2], 10) - parseInt(coords[0], 10);
    const height = parseInt(coords[3], 10) - parseInt(coords[1], 10);
    qingdao2Box.style.left = `${left}px`;
    qingdao2Box.style.top = `${top}px`;
    qingdao2Box.style.width = `${width}px`;
    qingdao2Box.style.height = `${height}px`;
    qingdao2Box.style.backgroundColor = 'purple'; // 设置紫色背景
    qingdao2Box.style.display = 'block';
    qingdao2Box.innerHTML = ''; // 清空之前的内容

    try {
        const response = await fetch('qingdao.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        // 添加内容和关闭按钮
        qingdao2Box.innerHTML = `
            <div style="color: white; padding: 20px; position: relative;">
                ${text}
                <div style="position: absolute; top: 10px; right: 10px; cursor: pointer;" onclick="hideQingdao2Box()">X</div>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load qingdao.txt:', error);
        qingdao2Box.textContent = 'Failed to load content.';
    }
};

// 显示兰州框
const showLanzhouBox = async () => {
    const lanzhouBox = document.getElementById('lanzhou-box');
    lanzhouBox.style.display = 'block';
    lanzhouBox.innerHTML = '<p>请问你在兰州喝了什么？</p><button id="lanzhouButtonA">黄瓜浆水</button><button id="lanzhouButtonB">可口可乐</button>';
    await new Promise((resolve) => {
        document.getElementById('lanzhouButtonA').addEventListener('click', function() {
            hideLanzhouBox();
            showVideo('BGM.mp4').then(() => {
                showLanzhou2Box(); // 兰州视频结束后显示 lanzhou2-box
                resolve();
            });
        });
        document.getElementById('lanzhouButtonB').addEventListener('click', function() {
            hideLanzhouBox();
            showTrapBox().then(() => {
                showLanzhou2Box(); // 陷阱框结束后显示 lanzhou2-box
                resolve();
            });
        });
    });
};

// 隐藏兰州框
const hideLanzhouBox = () => {
    const lanzhouBox = document.getElementById('lanzhou-box');
    lanzhouBox.style.display = 'none';
};

// 显示兰州2框
const showLanzhou2Box = async () => {
    const lanzhou2Box = document.getElementById('lanzhou2-box');
    const coords = "320,200,490,360".split(',');
    const left = parseInt(coords[0], 10);
    const top = parseInt(coords[1], 10);
    const width = parseInt(coords[2], 10) - parseInt(coords[0], 10);
    const height = parseInt(coords[3], 10) - parseInt(coords[1], 10);

    lanzhou2Box.style.left = `${left}px`;
    lanzhou2Box.style.top = `${top}px`;
    lanzhou2Box.style.width = `${width}px`;
    lanzhou2Box.style.height = `${height}px`;
    lanzhou2Box.style.backgroundColor = 'purple'; // 设置紫色背景
    lanzhou2Box.style.display = 'block';
    lanzhou2Box.innerHTML = ''; // 清空之前的内容

    try {
        const response = await fetch('lanzhou.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        // 添加内容和关闭按钮
        lanzhou2Box.innerHTML = `
            <div style="color: white; padding: 20px; position: relative;">
                ${text}
                <div style="position: absolute; top: 10px; right: 10px; cursor: pointer;" onclick="hideLanzhou2Box()">X</div>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load lanzhou.txt:', error);
        lanzhou2Box.textContent = 'Failed to load content.';
    }
};

// 显示山西框
const showShanxiBox = async () => {
    const shanxiBox = document.getElementById('shanxi-box');
    shanxiBox.style.display = 'block';
    shanxiBox.innerHTML = '<p>请问2024JJ20太原场的T恤限定是什么颜色？</p><button id="shanxiButtonA">奶紫色</button><button id="shanxiButtonB">奶紫色</button>';
    await new Promise((resolve) => {
        document.getElementById('shanxiButtonA').addEventListener('click', function() {
            hideShanxiBox();
            showVideo('271d5246508887eb8fa48d16319e9c2f.mp4').then(() => {
                showShanxi2Box(); // 山西视频结束后显示 shanxi2-box
                resolve();
            });
        });
        document.getElementById('shanxiButtonB').addEventListener('click', function() {
            hideShanxiBox();
            showTrapBox().then(() => {
                showShanxi2Box(); // 陷阱框结束后显示 shanxi2-box
                resolve();
            });
        });
    });
};

// 隐藏山西框
const hideShanxiBox = () => {
    const shanxiBox = document.getElementById('shanxi-box');
    shanxiBox.style.display = 'none';
};

// 显示山西2框
const showShanxi2Box = async () => {
    const shanxi2Box = document.getElementById('shanxi2-box');
    const coords = "800,100,1000,250".split(',');
    const left = parseInt(coords[0], 10);
    const top = parseInt(coords[1], 10);
    const width = parseInt(coords[2], 10) - parseInt(coords[0], 10);
    const height = parseInt(coords[3], 10) - parseInt(coords[1], 10);
    shanxi2Box.style.left = `${left}px`;
    shanxi2Box.style.top = `${top}px`;
    shanxi2Box.style.width = `${width}px`;
    shanxi2Box.style.height = `${height}px`;
    shanxi2Box.style.backgroundColor = 'purple'; // 设置紫色背景
shanxi2Box.style.display = 'block';
shanxi2Box.innerHTML = ''; // 清空之前的内容

try {
    const response = await fetch('shanxi.txt');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const text = await response.text();
    // 添加内容和关闭按钮
    shanxi2Box.innerHTML = `
        <div style="color: white; padding: 20px; position: relative;">
            ${text}
            <div style="position: absolute; top: 10px; right: 10px; cursor: pointer;" onclick="hideShanxi2Box()">X</div>
        </div>
    `;
} catch (error) {
    console.error('Failed to load shanxi.txt:', error);
    shanxi2Box.textContent = 'Failed to load content.';
}
};

// 显示重庆框
const showChongqingBox = async () => {
const chongqingBox = document.getElementById('chongqing-box');
chongqingBox.style.display = 'block';
chongqingBox.innerHTML = '<p>请问2024JJ20重庆场尾场的嘉宾是谁？</p><button id="chongqingButtonA">陶喆</button><button id="chongqingButtonB">李健</button>';
await new Promise((resolve) => {
    document.getElementById('chongqingButtonA').addEventListener('click', function() {
        hideChongqingBox();
        showVideo('8218d1772b27898caf23760b74337b4d.mp4').then(() => {
            showChongqing2Box(); // 重庆视频结束后显示 chongqing2-box
            resolve();
        });
    });
    document.getElementById('chongqingButtonB').addEventListener('click', function() {
        hideChongqingBox();
        showTrapBox().then(() => {
            showChongqing2Box(); // 陷阱框结束后显示 chongqing2-box
            resolve();
        });
    });
});
};

// 隐藏重庆框
const hideChongqingBox = () => {
const chongqingBox = document.getElementById('chongqing-box');
chongqingBox.style.display = 'none';
};

// 显示重庆2框
const showChongqing2Box = async () => {
const chongqing2Box = document.getElementById('chongqing2-box');
const coords = "450,660,630,820".split(',');
const left = parseInt(coords[0], 10);
const top = parseInt(coords[1], 10);
const width = parseInt(coords[2], 10) - parseInt(coords[0], 10);
const height = parseInt(coords[3], 10) - parseInt(coords[1], 10);
chongqing2Box.style.left = `${left}px`;
chongqing2Box.style.top = `${top}px`;
chongqing2Box.style.width = `${width}px`;
chongqing2Box.style.height = `${height}px`;
chongqing2Box.style.backgroundColor = 'purple'; // 设置紫色背景
chongqing2Box.style.display = 'block';
chongqing2Box.innerHTML = ''; // 清空之前的内容

try {
    const response = await fetch('chongqing.txt');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const text = await response.text();
    // 添加内容和关闭按钮
    chongqing2Box.innerHTML = `
        <div style="color: white; padding: 20px; position: relative;">
            ${text}
            <div style="position: absolute; top: 10px; right: 10px; cursor: pointer;" onclick="hideChongqing2Box()">X</div>
        </div>
    `;
} catch (error) {
    console.error('Failed to load chongqing.txt:', error);
    chongqing2Box.textContent = 'Failed to load content.';
}
};

// 为每个区域添加点击事件
const areas = document.querySelectorAll('area');
areas.forEach(area => {
area.addEventListener('click', async function(event) {
    event.preventDefault();
    const message = this.getAttribute('data-message');
    const image = this.getAttribute('data-image');
    if (message) {
        await showMessageBox(message);
        await showImage(image);
    }
});
});

// 为特定区域添加额外的点击事件
const lanzhouArea = document.querySelector('area[alt="Lanzhou Olympic Sports Center"]');
lanzhouArea.addEventListener('click', async function(event) {
event.preventDefault();
await showLanzhouBox();
});

// 为特定区域添加额外的点击事件
const qingdaoArea = document.querySelector('area[alt="Qingdao Citizen Fitness Center"]');
qingdaoArea.addEventListener('click', async function(event) {
event.preventDefault();
await showQingdaoBox(); // 显示 qingdao-box
await showQingdao2Box(); // 显示 qingdao2-box
});

// 为特定区域添加额外的点击事件
const shanxiArea = document.querySelector('area[alt="Shanxi Sports Center"]');
shanxiArea.addEventListener('click', async function(event) {
event.preventDefault();
await showShanxiBox(); // 显示 shanxi-box
await showShanxi2Box(); // 显示 shanxi2-box
});

// 为特定区域添加额外的点击事件
const chongqingArea = document.querySelector('area[alt="Chongqing Olympic Sports Center"]');
chongqingArea.addEventListener('click', async function(event) {
event.preventDefault();
await showChongqingBox(); // 显示 chongqing-box
await showChongqing2Box(); // 显示 chongqing2-box
});
}});