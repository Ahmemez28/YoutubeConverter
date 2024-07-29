from flask import Flask, request, jsonify, send_from_directory, Response
import yt_dlp
import os
import shutil
from flask_cors import CORS
import urllib.parse
import json

app = Flask(__name__)
CORS(app)
DOWNLOAD_FOLDER = 'downloads'
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

progress_info = {}

def clear_download_folder():
    for filename in os.listdir(DOWNLOAD_FOLDER):
        file_path = os.path.join(DOWNLOAD_FOLDER, filename)
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)

@app.route('/convert', methods=['POST'])
def convert():
    clear_download_folder()
    data = request.get_json()
    url = data.get('url')
    format = data.get('format', 'mp3')
    task_id = url

    def download_progress_hook(d):
        if d['status'] == 'downloading':
            progress_info[task_id] = {
                'status': d['status'],
                'downloaded_bytes': d['downloaded_bytes'],
                'total_bytes': d.get('total_bytes') or d.get('total_bytes_estimate'),
                'filename': d['filename'],
                'speed': d.get('speed'),
                'eta': d.get('eta'),
            }
        elif d['status'] == 'finished':
            progress_info[task_id] = {
                'status': d['status'],
                'filename': d['filename'],
            }

    try:
        result = download_video(url, format, download_progress_hook)
        return jsonify(success=True, downloadUrl=result)
    except Exception as e:
        return jsonify(success=False, error=str(e))

def download_video(url, format, progress_hook):
    ydl_opts = {
        'format': 'bestaudio/best' if format == 'mp3' else 'bestvideo+bestaudio',
        'outtmpl': f'{DOWNLOAD_FOLDER}/%(title)s.%(ext)s',
        'progress_hooks': [progress_hook],
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }] if format == 'mp3' else [{
            'key': 'FFmpegVideoConvertor',
            'preferedformat': 'mp4',
        }],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        title = info_dict.get('title', None)
        ext = 'mp3' if format == 'mp3' else 'mp4'
        filename = f'{title}.{ext}'
        safe_filename = urllib.parse.quote(filename, safe='')
        filepath = os.path.join(DOWNLOAD_FOLDER, filename)
        return f'/downloads/{safe_filename}'

@app.route('/progress/<task_id>')
def progress(task_id):
    def generate():
        while True:
            if task_id in progress_info:
                data = progress_info[task_id]
                yield f'data: {json.dumps(data)}\n\n'
                if data['status'] == 'finished':
                    del progress_info[task_id]
                    break

    return Response(generate(), mimetype='text/event-stream')

@app.route('/downloads/<path:filename>')
def download_file(filename):
    filename = urllib.parse.unquote(filename)
    return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True, mimetype='application/octet-stream')

if __name__ == '__main__':
    if not os.path.exists('downloads'):
        os.makedirs('downloads')
    app.run(debug=True, host='0.0.0.0')
