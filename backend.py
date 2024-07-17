# backend.py
from flask import Flask, request, jsonify, send_from_directory
import yt_dlp
import os
from moviepy.editor import AudioFileClip, VideoFileClip

app = Flask(__name__)

def download_video(url, format):
    ydl_opts = {
        'format': 'bestaudio/best' if format == 'mp3' else 'bestvideo+bestaudio',
        'outtmpl': 'downloads/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio' if format == 'mp3' else 'FFmpegVideoConvertor',
            'preferredcodec': format,
            'preferredquality': '192',
        }],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        title = info_dict.get('title', None)
        ext = 'mp3' if format == 'mp3' else 'mp4'
        out_file = f'downloads/{title}.{ext}'
    return title, out_file

@app.route('/convert', methods=['POST'])
def convert():
    data = request.get_json()
    url = data['url']
    format = data['format']
    try:
        title, file_path = download_video(url, format)
        return jsonify(success=True, downloadUrl=f'/downloads/{os.path.basename(file_path)}')
    except Exception as e:
        return jsonify(success=False, error=str(e))

@app.route('/downloads/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory('downloads', filename, as_attachment=True)

if __name__ == '__main__':
    if not os.path.exists('downloads'):
        os.makedirs('downloads')
    app.run(port=5000, debug=True)
