
const songs = [
    {
        title: "First Song",
        artist: "Artist One",
        src: "music/song1.mp3"
    },
    {
        title: "Second Song",
        artist: "Artist Two",
        src: "music/song2.mp3"
    },
    {
        title: "Third Song",
        artist: "Artist Three",
        src: "music/song3.mp3"
    }
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

let songIndex = 0;

function loadSong(index) {
    const song = songs[index];

    audio.src = song.src;
    title.textContent = song.title;
    artist.textContent = song.artist;
    progress.value = 0;
    playBtn.textContent = "▶";

    [...playlist.children].forEach((item, i) => {
        item.style.color = i === index ? "#c4b5fd" : "white";
    });
}

function playSong() {
    audio.play()
        .then(() => playBtn.textContent = "⏸")
        .catch(() => alert("Check your MP3 file path."));
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

document.getElementById("next").addEventListener("click", () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playSong();
});

document.getElementById("prev").addEventListener("click", () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    playSong();
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value =
            (audio.currentTime / audio.duration) * 100;

        document.getElementById("current").textContent =
            formatTime(audio.currentTime);
    }
});

audio.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").textContent =
        formatTime(audio.duration);
});

progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
});

volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

audio.addEventListener("ended", () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playSong();
});

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

songs.forEach((song, index) => {
    const item = document.createElement("li");
    item.textContent = `${song.title} — ${song.artist}`;

    item.addEventListener("click", () => {
        songIndex = index;
        loadSong(songIndex);
        playSong();
    });

    playlist.appendChild(item);
});

audio.volume = 0.7;
loadSong(songIndex);
