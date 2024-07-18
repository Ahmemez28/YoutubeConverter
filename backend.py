from flask import Flask, request, jsonify
import yt_dlp
import os
import logging

# Set up logging
logging.basicConfig(filename='backend.log', level=logging.DEBUG, format='%(asctime)s %(message)s')

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
    logging.debug(f'Received request with URL: {url} and format: {format}')
    try:
        title, file_path = download_video(url, format)
        logging.debug(f'Successfully downloaded: {file_path}')
        return jsonify(success=True, downloadUrl=f'/downloads/{os.path.basename(file_path)}')
    except Exception as e:
        logging.error(f'Error during download: {str(e)}')
        return jsonify(success=False, error=str(e))

if __name__ == '__main__':
    if not os.path.exists('downloads'):
        os.makedirs('downloads')
    logging.debug('Starting Flask server')
    app.run(debug=True)
