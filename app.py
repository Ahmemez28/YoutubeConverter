import tkinter as tk
from tkinter import ttk
import requests

def convert(format):
    url = url_entry.get()
    data = {
        'url': url,
        'format': format
    }
    try:
        response = requests.post('http://localhost:5000/convert', json=data)
        response_data = response.json()
        if response_data['success']:
            result_label.config(text=f"Download URL: {response_data['downloadUrl']}")
        else:
            result_label.config(text=f"Error: {response_data['error']}")
    except Exception as e:
        result_label.config(text=f"Error: {str(e)}")

app = tk.Tk()
app.title("YouTube Converter")

ttk.Label(app, text="YouTube URL:").grid(column=0, row=0, padx=10, pady=10)
url_entry = ttk.Entry(app, width=50)
url_entry.grid(column=1, row=0, padx=10, pady=10)

convert_mp3_btn = ttk.Button(app, text="Convert to MP3", command=lambda: convert('mp3'))
convert_mp3_btn.grid(column=0, row=1, padx=10, pady=10)

convert_mp4_btn = ttk.Button(app, text="Convert to MP4", command=lambda: convert('mp4'))
convert_mp4_btn.grid(column=1, row=1, padx=10, pady=10)

result_label = ttk.Label(app, text="")
result_label.grid(column=0, row=2, columnspan=2, padx=10, pady=10)

app.mainloop()
