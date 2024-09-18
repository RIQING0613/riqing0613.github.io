let isDarkened = false; // 跟踪当前状态

// 获取大图和按钮元素
const fullImage = document.getElementById('full-image');
const toggleButton = document.getElementById('toggle-darken');

// 切换亮度功能
toggleButton.addEventListener('click', function() {
  if (isDarkened) {
    fullImage.classList.remove('darken');
    toggleButton.textContent = 'darken'; // 按钮显示"Darken"
  } else {
    fullImage.classList.add('darken');
    toggleButton.textContent = 'lighten'; // 按钮显示"Lighten"
  }
  isDarkened = !isDarkened; // 切换状态
});

// 显示点击的缩略图大图
function showImage(element) {
  fullImage.src = element.src;
  fullImage.alt = element.alt;

  if (isDarkened) {
    fullImage.classList.add('darken'); // 保持变暗状态
  } else {
    fullImage.classList.remove('darken');
  }
}