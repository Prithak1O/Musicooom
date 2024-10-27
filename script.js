// Select elements
const tracklistItems = document.querySelectorAll('.tracklist li');
const audioPlayer = document.getElementById('audio-player');
const playerControls = document.getElementById('player-controls');
const currentTrackTitle = document.getElementById('current-track-title');
const trackDescription = document.getElementById('track-description');
const currentTimeDisplay = document.getElementById('current-time');
const durationTimeDisplay = document.getElementById('duration-time');
const progressBar = document.getElementById('progress-bar');
const playButton = document.getElementById('play-btn');
const pauseButton = document.getElementById('pause-btn');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const popupMessage = document.getElementById('popup-message');
const addToPlaylistButton = document.getElementById('add-to-playlist-btn');

// List of tracks with descriptions
const tracks = [
    {
        title: 'Speak to Me',
        url: 'Data/Songs/Speak to Me.mp3',
        duration: '2:17',
        description: 'This track opens the album with its unique sounds.'
    },
    {
        title: 'Time',
        url: 'Data/Songs/Time.mp3',
        duration: '2:40',
        description: 'A reflection on the passage of time and its effects.'
    },
    {
        title: 'On the Run',
        url: 'Data/Songs/On the Run.mp3',
        duration: '3:09',
        description: 'An adventurous piece that captures the thrill of freedom.'
    },
    {
        title: 'Brain Damage',
        url: 'Data/Songs/Brain Damage.mp3',
        duration: '3:04',
        description: 'A thought-provoking track that delves into the mind.'
    }
];

// Current track index
let currentTrackIndex = -1;

// Function to show the popup message
function showPopup(message) {
    popupMessage.textContent = message; // Set the message text
    popupMessage.style.display = 'block'; // Show the popup

    // Hide the popup after 5 seconds
    setTimeout(() => {
        popupMessage.style.display = 'none'; // Hide the popup after 5 seconds
    }, 5000);
}

// Function to add track to the playlist (checks for duplicates)
function addToPlaylist(index) {
    const track = tracks[index]; // Get the track details

    // Check if the track already exists in the playlist
    let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    if (playlist.includes(track.title)) {
        showPopup(`"${track.title}" is already in your playlist!`); // Show message if the track is already in the playlist
        return; // Exit the function, do not add the song again
    }

    // If the track is not in the playlist, add it
    playlist.push(track.title);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    showPopup(`"${track.title}" has been added to your playlist!`); // Show popup when the track is added
}

// Track click event
tracklistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        playTrack(index);
    });
});

// Play track function
function playTrack(index) {
    currentTrackIndex = index; // Update current track index

    playerControls.style.display = 'flex'; // Show player controls
    audioPlayer.src = tracks[index].url; // Update audio source
    currentTrackTitle.textContent = tracks[index].title; // Update track title
    trackDescription.textContent = tracks[index].description; // Update track description
    durationTimeDisplay.textContent = tracks[index].duration; // Update duration

    // Save the current song to localStorage
    localStorage.setItem('currentSong', JSON.stringify(tracks[index]));

    // Load and play the audio
    audioPlayer.load();

    // Add a promise to catch any playback errors
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error); // Log any playback error
    });

    // Update progress bar max value
    audioPlayer.addEventListener('loadedmetadata', () => {
        progressBar.max = audioPlayer.duration;
        durationTimeDisplay.textContent = formatTime(audioPlayer.duration); // Update duration display
    });

    // Update progress
    audioPlayer.addEventListener('timeupdate', () => {
        progressBar.value = audioPlayer.currentTime;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    });

    // Update progress bar click event
    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = progressBar.value;
    });

    // Set play button state
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline';

    // Show the add to playlist button
    addToPlaylistButton.style.display = 'block';
}

// Automatically play the next song when the current song ends
audioPlayer.addEventListener('ended', () => {
    nextButton.onclick(); // Trigger the next button click event
});

// Play/Pause functionality
playButton.onclick = () => {
    audioPlayer.play();
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline';
};

pauseButton.onclick = () => {
    audioPlayer.pause();
    playButton.style.display = 'inline';
    pauseButton.style.display = 'none';
};

// Next button functionality
nextButton.onclick = () => {
    if (currentTrackIndex < tracks.length - 1) {
        playTrack(currentTrackIndex + 1);
    } else {
        playTrack(0); // Loop back to the first track
    }
};

// Previous button functionality
prevButton.onclick = () => {
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    } else {
        playTrack(tracks.length - 1); // Loop back to the last track
    }
};

// Format time to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Event listener for the Add to Playlist button
addToPlaylistButton.addEventListener('click', () => {
    addToPlaylist(currentTrackIndex); // Add track to playlist
});

// Load playlist from local storage on page load (without displaying it)
window.onload = function () {
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    playlist.forEach(trackTitle => {
        console.log(`Loaded track: ${trackTitle} from local storage`);
    });

    // Check if a song is stored to be played
    const currentSong = JSON.parse(localStorage.getItem('currentSong'));

    if (currentSong) {
        // Get the audio player
        audioPlayer.src = currentSong.url; // Use the correct property name
        currentTrackTitle.textContent = currentSong.title;
        trackDescription.textContent = currentSong.description;
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline';
        
        // Play the song
        audioPlayer.play();

        // Remove the current song from localStorage to avoid auto-play on reload
        localStorage.removeItem('currentSong');
    }
};
// Search button click event
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        // Redirect to search.html with the query as a URL parameter
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
});
