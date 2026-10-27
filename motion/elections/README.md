# Dolomit · elections board

One HTML file, the fonts inside it. Open `elections-board.html` in a browser: pick a film
and a format, scrub, play. The words live in `COPY`, the colours on the palette line,
the shots in `FILMS` (each `{beats, note, draw(tb, fr)}`).

## Render

Needs node, playwright (chromium) and ffmpeg.

    node render.js elections-board.html kalpi story frames/kalpi-story
    ffmpeg -framerate 30 -i frames/kalpi-story/f%04d.png -i track.m4a -shortest \
      -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -movflags +faststart kalpi-story.mp4

`story` is 1080x1920, `post` is the 1080x1350 band. Films: kalpi, tray, blocs, midgam,
emblem, boker, bokerAr (also petek, shabaton). Beat 0.6s = 100 BPM.
bokerAr sets صباح الخير in Safra Sans Bold, inlined from fonts/SafraSans-Bold.woff2.

## Music

Both Mechanical Minor takes run at 100 BPM. The first downbeat is at 0.430s in the
m4a and 1.180s in the mp3; a film's audio starts at downbeat + k × 2.4s so its first
cut lands on a bar. The cut used: kalpi, blocs, pikuach, turnout on the m4a at bars
2, 14, 8, 21; tray, midgam, closing, emblem, boker and bokerAr on the mp3 at bars 2, 13, 7, 16, 22, 22.
