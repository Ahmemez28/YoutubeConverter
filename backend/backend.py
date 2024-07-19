from flask import Flask, request, jsonify, send_from_directory, after_this_request
import yt_dlp
import os
import shutil
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
DOWNLOAD_FOLDER = 'downloads'
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

@app.route('/convert', methods=['POST'])
def convert():
    data = request.get_json()
    url = data.get('url')
    format = data.get('format', 'mp3')
    try:
        result = download_video(url, format)
        return jsonify(success=True, downloadUrl=result)
    except Exception as e:
        return jsonify(success=False, error=str(e))

def download_video(url, format):
    ydl_opts = {
        'format': 'bestaudio/best' if format == 'mp3' else 'bestvideo+bestaudio',
        'outtmpl': f'{DOWNLOAD_FOLDER}/%(title)s.%(ext)s',
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
        filename = f'{title}.{ext}'
        filepath = os.path.join(DOWNLOAD_FOLDER, filename)
        return f'/downloads/{filename}'

@app.route('/downloads/<filename>')
def download_file(filename):
    @after_this_request
    def remove_file(response):
        try:
            os.remove(os.path.join(DOWNLOAD_FOLDER, filename))
        except Exception as error:
            app.logger.error(f"Error removing or closing downloaded file handle: {error}")
        return response

    return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    if not os.path.exists('downloads'):
        os.makedirs('downloads')
    app.run(debug=True, host='0.0.0.0')
