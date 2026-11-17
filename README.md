# A Little Piece of My Heart (birthday site for Shabana)

Plain HTML + CSS + JS. No build step, no server. Works on GitHub Pages.

```
birthday-surprise/
├── index.html
├── style.css
├── script.js
├── content.js            <- all text lives here
└── assets/
    ├── photos/photo-01.webp ... photo-06.webp   (3:4 portrait)
    ├── decorations/
    └── audio/birthday-song.mp3, voice-message.mp3
```

## Edit text
Open `content.js`. Change the quoted text only. Still to fill in:
- `scratch.cards` (3 messages), `music.title`, `music.artist`
- optional photo `caption` for each photo

## Replace photos
Upload a new file with the same name (e.g. `photo-03.webp`) into `assets/photos/`. Keep it 3:4 portrait (e.g. 900x1200). JPG/PNG also works if you change the file name in `content.js`.

## Add music and voice message
Put the files in `assets/audio/` with exactly these names:
- `birthday-song.mp3`
- `voice-message.mp3`

If a file is missing, the player shows "isn't here yet" and nothing breaks. Nothing autoplays.

## Deploy on GitHub Pages (phone friendly)
1. GitHub (browser, "Desktop site" on) > New repository > name it `birthday-surprise` > Public > Create.
2. Add file > Upload files > upload everything from the unzipped folder (keep the `assets` folders) > Commit.
3. Settings > Pages > Source: "Deploy from a branch" > Branch `main`, folder `/ (root)` > Save.
4. Wait about a minute. Link: `https://<your-username>.github.io/birthday-surprise/`

Folders upload only if they hold a file, so upload the audio files inside `assets/audio/` (use "Create new file" with name `assets/audio/.gitkeep` if the folder is empty).
