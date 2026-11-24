#!/usr/bin/env bash
# Encodes source videos in media-src/ into web-ready files in public/media/.
# Sources are the 4K/60fps upscales from Higgsfield (exterior.mp4, studio.mp4).
# - strips audio
# - downsamples to 30fps (the camera is near-static; 60fps would only double the size)
# - bakes a seamless loop: the last X frames crossfade into the first X frames,
#   and playback starts at frame X, so the final frame flows into the first one
# - outputs 1080p + 720p (WebM VP9 and MP4 H.264) and poster images
#   SceneVideo picks 1080p for large/high-density screens, 720p otherwise (and on phones)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/media; mkdir -p "$OUT"
X=24   # crossfade length in frames (0.8s at 30fps)
for name in exterior studio; do
  src=media-src/$name.mp4
  # 1) 1080p/30fps high-quality intermediate
  ffmpeg -v error -y -i "$src" -an -vf "fps=30,scale=1920:1080:flags=lanczos" \
    -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p media-src/$name.1080.tmp.mp4
  F=$(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 media-src/$name.1080.tmp.mp4)
  # 2) seamless loop master
  ffmpeg -v error -y -i media-src/$name.1080.tmp.mp4 -filter_complex "\
    [0:v]split=3[a][b][c];\
    [a]trim=start_frame=$X:end_frame=$((F-X)),setpts=PTS-STARTPTS[body];\
    [b]trim=start_frame=$((F-X)):end_frame=$F,setpts=PTS-STARTPTS[tail];\
    [c]trim=start_frame=0:end_frame=$X,setpts=PTS-STARTPTS[head];\
    [head][tail]blend=all_expr='A*min(1,N/($X-1))+B*(1-min(1,N/($X-1)))':shortest=1[seam];\
    [body][seam]concat=n=2:v=1[v]" -map "[v]" -an -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p media-src/$name.loop.mp4
  rm -f media-src/$name.1080.tmp.mp4
  # 3) renditions
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -an -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$name-1080.mp4"
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -an -c:v libvpx-vp9 -crf 31 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 "$OUT/$name-1080.webm"
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -an -vf scale=1280:720:flags=lanczos -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$name-720.mp4"
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -an -vf scale=1280:720:flags=lanczos -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 "$OUT/$name-720.webm"
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -frames:v 1 -vf scale=1280:-2:flags=lanczos -q:v 4 "$OUT/$name-poster.jpg"
done
rm -f "$OUT"/*-540.mp4
ls -la "$OUT"
