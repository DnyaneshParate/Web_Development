// Audio player setup
let currentSong = new Audio();
let songs = [];
let currFolder = "";

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

async function getSongs(folder) {
    currFolder = folder;
    try {
        const response = await fetch(`http://127.0.0.1:3000/Web_Development/Lec84/${folder}/`);
        const htmlText = await response.text();
        const div = document.createElement("div");
        div.innerHTML = htmlText;
        const links = div.getElementsByTagName("a");
        songs = [];
        for (let link of links) {
            if (link.href.endsWith(".mp3")) {
                songs.push(link.href.split(`/${folder}/`)[1]);
            }
        }
        return songs;
    } catch (err) {
        console.error("Error loading songs:", err);
        return [];
    }
}

function playMusic(filename) {
    currentSong.src = `http://127.0.0.1:3000/Web_Development/Lec84/${currFolder}/` + filename;
    currentSong.play().catch(console.error);
    play.src = "pause.svg";
    document.querySelector(".songInfo").innerHTML = filename.replaceAll("%20", " ");
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

function renderSongList(songArray) {
    const songUl = document.querySelector(".songList ul");
    songUl.innerHTML = "";
    for (const song of songArray) {
        songUl.innerHTML += `
            <li class="song flex items-content songGap" style="justify-content: space-between;">
                <div class="flex songGap">
                    <img src="music.svg" class="invert" alt="music">
                    <div class="info">
                        <div class="songName">${song.replaceAll("%20", " ")}</div>
                        <div class="artist flex">Lana Del Rey</div>
                    </div>
                </div>
                <div class="playNow flex items-content">
                    <div>Play Now</div>
                    <img src="play.svg" class="invert" alt="">
                </div>
            </li>`;
    }
    bindSongEvents();
}

function bindSongEvents() {
    document.querySelectorAll(".songList li").forEach(li => {
        li.addEventListener("click", () => {
            const songName = li.querySelector(".songName").innerText.trim();
            playMusic(songName);
        });
    });
}

async function displayAlbums() {
    const baseUrl = "http://127.0.0.1:3000/Web_Development/Lec84/Songs/";
    const response = await fetch(baseUrl);
    const htmlText = await response.text();
    const div = document.createElement("div");
    div.innerHTML = htmlText;
    const anchors = div.getElementsByTagName("a");
    const content = document.querySelector(".content");
    content.innerHTML = "";

    for (let a of anchors) {
        if (a.href.endsWith("/") && !a.href.endsWith("../")) {
            const folderName = a.href.split("/").filter(Boolean).pop();
            const albumPath = `${baseUrl}${folderName}/`;
            try {
                const info = await fetch(`${albumPath}info.json`).then(res => res.json());
                const card = document.createElement("div");
                card.className = "card rounded p-1 rightImg";
                card.dataset.folder = folderName;
                card.innerHTML = `
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="width: 30px;">
                            <circle cx="32" cy="32" r="32" fill="#1DB954" />
                            <polygon points="24,18 24,46 48,32" fill="black" />
                        </svg>
                    </div>
                    <img src="${albumPath}cover.jpg" alt="${info.title || folderName}" />
                    <div class="title">${info.title || folderName}</div>
                    <div class="description" style="font-size: 10px; color: gray;">${info.description || ""}</div>`;

                // ✅ Click to load and auto-play the first song
                card.addEventListener("click", async () => {
                    const songsInFolder = await getSongs(`Songs/${folderName}`);
                    renderSongList(songsInFolder);

                    if (songsInFolder.length > 0) {
                        playMusic(songsInFolder[0]);
                    }
                });

                content.appendChild(card);
            } catch (err) {
                console.warn(`Skipping folder ${folderName}:`, err);
            }
        }
    }
}

async function main() {
    await displayAlbums();
    songs = await getSongs("Songs/Eng");
    renderSongList(songs);

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - bounds.left) / bounds.width;
        currentSong.currentTime = currentSong.duration * percent;
        document.querySelector(".circle").style.left = percent * 100 + "%";
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    document.getElementById("previous").addEventListener("click", () => {
        const index = songs.indexOf(currentSong.src.split("/").pop());
        if (index > 0) playMusic(songs[index - 1]);
    });

    document.getElementById("next").addEventListener("click", () => {
        const index = songs.indexOf(currentSong.src.split("/").pop());
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });

    document.querySelector(".volume-slider").addEventListener("input", function () {
        currentSong.volume = parseFloat(this.value);
    });
}

main();
