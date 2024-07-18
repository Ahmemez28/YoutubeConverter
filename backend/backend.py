import os
import yt_dlp
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
# Set DOWNLOAD_FOLDER to be within the backend directory
DOWNLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'downloads')
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

def download_video(url, format):
    ydl_opts = {
        'format': 'bestaudio/best' if format == 'mp3' else 'bestvideo+bestaudio',
        'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio' if format == 'mp3' else 'FFmpegVideoConvertor',
            'preferredcodec': format,
            'preferredquality': '192',
        }],
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            title = info_dict.get('title', None)
            ext = 'mp3' if format == 'mp3' else 'mp4'
            secure_title = secure_filename(title)
            original_file = os.path.join(DOWNLOAD_FOLDER, f'{title}.{ext}')
            new_file = os.path.join(DOWNLOAD_FOLDER, f'{secure_title}.{ext}')
            
            # If the file already exists, add a number to the filename
            counter = 1
            base_new_file = new_file
            while os.path.exists(new_file):
                new_file = os.path.join(DOWNLOAD_FOLDER, f'{secure_title}_{counter}.{ext}')
                counter += 1

            os.rename(original_file, new_file)
            return title, new_file
    except Exception as e:
        raise e

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

@app.route('/downloads/<filename>')
def serve_file(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
