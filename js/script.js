const wrapper = document.querySelector(".wrapper")
const musicImg = wrapper.querySelector(".img-area img")
const musicName = wrapper.querySelector(".song-details .name")
const musicArtist = wrapper.querySelector(".song-details .artist")
const mainAudio = wrapper.querySelector("#main-audio")
const playPauseBtn = wrapper.querySelector(".play-pause")
const prevBtn = wrapper.querySelector("#prev")
const nextBtn = wrapper.querySelector("#next")
const progressBar = wrapper.querySelector(".progress-bar")
const progressArea = wrapper.querySelector(".progress-area")
const repeatBtn = wrapper.querySelector("#repeat-plist")
const musicDurationTime = wrapper.querySelector(".duration")
const musicCurrentTime = wrapper.querySelector(".current")
const musicList = wrapper.querySelector(".music-list")
const showMoreBtn = wrapper.querySelector("#more_music")
const hideMoreBtn = wrapper.querySelector("#close")
const ulTag = wrapper.querySelector(".music-list ul")

//as default music is paused
let isMusicPaused = true
let musicIndex = 1
progressBar.style.width = '0'



window.addEventListener("load", ()=>{
    loadMusic(musicIndex) //calling loadmusic() function once window loaded
    playingNow()
})

//loading music
const loadMusic = (indexNum) => {
    musicName.innerHTML = allMusic[indexNum - 1].name
    musicArtist.innerHTML = allMusic[indexNum - 1].artist
    musicImg.src = allMusic[indexNum - 1].image
    mainAudio.src = allMusic[indexNum - 1].src
}

//play music function
const playMusic = () => {
    wrapper.classList.add("paused")
    playPauseBtn.querySelector("i").innerHTML = 'pause'
    mainAudio.play()
}

//pause music function
const pauseMusic = () => {
    wrapper.classList.remove("paused")
    playPauseBtn.querySelector("i").innerHTML = 'play_arrow'
    mainAudio.pause()
}

//switch music to next function
const nextMusic = () => {
    progressBar.style.width = '0'
    musicIndex++
    musicIndex>allMusic.length ? musicIndex=1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    //if previous music was paused do not play music else play
    isMusicPaused ? pauseMusic() : playMusic()
    playingNow()
}

//switch music to previous function
const prevMusic = () => {
    progressBar.style.width = '0'
    musicIndex--
    musicIndex<1 ? musicIndex=allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    //if previous music was paused do not play music else play
    isMusicPaused ? pauseMusic() : playMusic()
    playingNow()
}

//play or pause music
playPauseBtn.addEventListener('click', () => {
    isMusicPaused = wrapper.classList.contains("paused")
    isMusicPaused ? pauseMusic() : playMusic()
})



prevBtn.addEventListener('click', () => {
    prevMusic()
})

nextBtn.addEventListener('click', () => {
    nextMusic()
})

mainAudio.addEventListener('timeupdate', e => {
    let currentTime = e.target.currentTime
    let duration = e.target.duration
    let progressWidth = (currentTime / duration) * 100
    progressBar.style.width = `${progressWidth}%`

    mainAudio.addEventListener('loadeddata', ()=>{
        //loading duration of music
        let audioDuration = mainAudio.duration
        let totalMin = Math.floor(audioDuration/60)
        let totalSec = Math.floor(audioDuration % 60)
        if(totalSec < 10){
            totalSec = `0${totalSec}`
        }
        musicDurationTime.innerHTML = `${totalMin}:${totalSec}`
    })


    //loading current time of music
    let currentMin = Math.floor(currentTime/60)
    let currentSec = Math.floor(currentTime % 60)
    if(currentSec < 10){
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`
})

//progressArea click event (updating time when clicking some area of progress bar)
progressArea.addEventListener('click', e => {
    let progressBarWidth = progressArea.clientWidth
    let clickedOffSetX = e.offsetX
    let songDuration = mainAudio.duration

    mainAudio.currentTime = (clickedOffSetX / progressBarWidth) * songDuration
})

//changing title attribute and icon of repeatBtn
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerHTML
    switch (getText){
        case 'repeat':
            repeatBtn.innerHTML = 'repeat_one'
            repeatBtn.setAttribute('title', 'Song looped')
            break;
        case 'repeat_one':
            repeatBtn.innerHTML = 'shuffle'
            repeatBtn.setAttribute('title', 'Playback shuffle')
            break
        case 'shuffle':
            repeatBtn.innerHTML = 'repeat'
            repeatBtn.setAttribute('title', 'Playlist looped')
            break;
    }
})

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerHTML
    switch (getText){
        case 'repeat':
            nextMusic()
            break;
        case 'repeat_one':
            mainAudio.currentTime=0
            loadMusic(musicIndex)
            playMusic()
            break
        case 'shuffle':
            let randIndex = Math.floor(Math.random()* allMusic.length + 1 )
            //it will run until next random number won`t be the same of current music index
            //infinite loop
            do{
                randIndex = Math.floor(Math.random()* allMusic.length + 1 )
            } while(musicIndex == randIndex)
            musicIndex = randIndex
            loadMusic(musicIndex)
            playMusic()
            playingNow()
            break;
    }
})

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show')
})

hideMoreBtn.addEventListener('click', () => {
    musicList.classList.remove('show')
})

allMusic.forEach(music => {
    let liTag = ` <li li-index="${music.tag.charAt(music.tag.length-1)}">
                    <div class="row">
                        <span>${music.name}</span>
                        <p>${music.artist}</p>
                    </div>
                    <audio class="${music.tag}" src="${music.src}"></audio>
                    <span id="${music.tag}" class="audio-duration"></span>
                </li>` //assigning audio duration tag and audio tag by class and id
    ulTag.insertAdjacentHTML('beforeend', liTag);

    let liAudioTag = ulTag.querySelector(`.${music.tag}`)
    let liAudioDuration = ulTag.querySelector(`#${music.tag}`)
    //adding duration for each music
    liAudioTag.addEventListener('loadeddata', () => {
        //loading duration of music
        let audioDuration = liAudioTag.duration
        let totalMin = Math.floor(audioDuration/60)
        let totalSec = Math.floor(audioDuration % 60)
        if(totalSec < 10){
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerHTML = `${totalMin}:${totalSec}`
        /**setting extra attribute to store duration info of each song*/
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
    })

})

const allLiTags = ulTag.querySelectorAll("li")
//changing li
const playingNow = () => {
    allLiTags.forEach(liTag => {
        let liAudioDuration = liTag.querySelector(".audio-duration")
        if(liTag.classList.contains('playing')){
            liTag.classList.remove('playing')
            /**getting duration of each li (stored in attribute)*/
            liAudioDuration.innerHTML = liAudioDuration.getAttribute('t-duration')
        }

        if(liTag.getAttribute('li-index') == musicIndex){
            liTag.classList.add('playing')
            liAudioDuration.innerHTML = 'Playing'
        }

        //adding onclick atribute and function as its value
        liTag.setAttribute('onclick', 'clicked(this)')
    })
}

//playing song on li click
const clicked = element => {
    //getting li index of particular li tag
    let getLiIndex = element.getAttribute('li-index')
    musicIndex = getLiIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

