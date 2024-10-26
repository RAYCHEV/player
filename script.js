document.addEventListener("DOMContentLoaded", () => {
    const audioFolderInput = document.getElementById("audio-folder");
    const audioFileSelect = document.getElementById("audio-file");
    const playButton = document.getElementById("play-button");
    const pauseButton = document.getElementById("pause-button");
    const stopButton = document.getElementById("stop-button");
    const volumeSlider = document.getElementById("volume-slider");
    const playSchedule = document.getElementById("play-schedule");
    const scheduleButton = document.getElementById("schedule-button");
    const statusText = document.getElementById("status");

    let audio = new Audio();
    let scheduledTime = null;

    // Load files from selected folder
    audioFolderInput.addEventListener("change", (event) => {
        audioFileSelect.innerHTML = "<option value=''>Select a file...</option>";
        Array.from(event.target.files).forEach(file => {
            if (file.type.startsWith("audio/")) {
                const option = document.createElement("option");
                option.value = URL.createObjectURL(file);
                option.textContent = file.name;
                audioFileSelect.appendChild(option);
            }
        });
    });

    // Load selected audio file
    audioFileSelect.addEventListener("change", () => {
        if (audioFileSelect.value) {
            audio.src = audioFileSelect.value;
            audio.load();
            playButton.disabled = false;
        }
    });

    // Play audio
    playButton.addEventListener("click", () => {
        audio.play();
        statusText.textContent = "Playing...";
        playButton.disabled = true;
        pauseButton.disabled = false;
        stopButton.disabled = false;
    });

    // Pause audio
    pauseButton.addEventListener("click", () => {
        audio.pause();
        statusText.textContent = "Paused.";
        playButton.disabled = false;
        pauseButton.disabled = true;
    });

    // Stop audio
    stopButton.addEventListener("click", () => {
        audio.pause();
        audio.currentTime = 0;
        statusText.textContent = "Stopped.";
        playButton.disabled = false;
        pauseButton.disabled = true;
        stopButton.disabled = true;
    });

    // Volume control
    volumeSlider.addEventListener("input", (event) => {
        audio.volume = event.target.value;
    });

    // Schedule playback
    scheduleButton.addEventListener("click", () => {
        const time = playSchedule.value;
        if (time) {
            const [hours, minutes] = time.split(":").map(Number);
            scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0);

            statusText.textContent = `Playback scheduled at ${time}.`;
        }
    });

    // Check scheduled playback every second
    setInterval(() => {
        if (scheduledTime && new Date() >= scheduledTime) {
            audio.play();
            statusText.textContent = "Playing scheduled audio...";
            scheduledTime = null; // Clear schedule after playing
        }
    }, 1000);
});
