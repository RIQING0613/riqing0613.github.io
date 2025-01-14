document.addEventListener('DOMContentLoaded', function () {
    /*h获取音乐数据元素*/ 
    var songList = document.querySelector('.songList'),
        btnPlay = songList.querySelectorAll('.btn-play'),
        fixedSong = document.querySelector('.fixedSong audio'),
        //定义一个songSrc数组（下标为1，2，3，4….）。通过调用index，
        //达到点击歌曲按钮后，达到按钮元素、音乐元素的切换。
        songSrc = [
            'music/1.mp3',
            'music/2.mp3',
            'music/3.mp3',
            'music/4.mp3',
            'music/5.mp3'
        ]
    btnPlay.forEach((item, index) => {
        item.songSrc = songSrc[index]
    })
    songList.addEventListener('click', function (e) {
        if (e.target.className != 'btn-play') return
        fixedSong.src = e.target.songSrc
        fixedSong.play()
    })
})