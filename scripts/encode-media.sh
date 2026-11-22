#!/usr/bin/env bash
# Encodes source videos in media-src/ into web-ready files in public/media/.
# - strips audio
# - bakes a seamless loop: the last X frames crossfade into the first X frames,
#   and playback starts at frame X, so the final frame flows into the first one
# - outputs 720p WebM + MP4 and 540p MP4 for mobile, plus poster images
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/media; mkdir -p "$OUT"
X=20   # crossfade length in frames (~0.83s at 24fps)
for name in exterior studio; do
  src=media-src/$name.mp4
  F=$(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$src")
  ffmpeg -v error -y -i "$src" -filter_complex "\
    [0:v]split=3[a][b][c];\
    [a]trim=start_frame=$X:end_frame=$((F-X)),setpts=PTS-STARTPTS[body];\
    [b]trim=start_frame=$((F-X)):end_frame=$F,setpts=PTS-STARTPTS[tail];\
    [c]trim=start_frame=0:end_frame=$X,setpts=PTS-STARTPTS[head];\
    [head][tail]blend=all_expr='A*min(1,N/($X-1))+B*(1-min(1,N/($X-1)))':shortest=1[seam];\
    [body][seam]concat=n=2:v=1[v]" -map "[v]" -an -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p media-src/$name.loop.mp4
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -an -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$name-720.mp4"
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 "$OUT/$name-720.webm"
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -an -vf scale=960:-2 -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$name-540.mp4"
  ffmpeg -v error -y -i media-src/$name.loop.mp4 -frames:v 1 -q:v 4 "$OUT/$name-poster.jpg"
done
ls -la "$OUT"
