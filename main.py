import sys
import os
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox
from PyQt5.QtGui import QIcon, QPixmap
from PyQt5.QtCore import Qt
import requests
import threading
import subprocess
import time
import logging

# Set up logging
logging.basicConfig(filename='frontend.log', level=logging.DEBUG, format='%(asctime)s %(message)s')

class App(QWidget):
    logging.debug("Opening the app")
    def __init__(self):
        super().__init__()
        self.title = 'YouTube Converter'
        self.setGeometry(500, 500, 700, 500)
        self.initUI()

    def initUI(self):
        self.setWindowTitle(self.title)
        self.setStyleSheet("background-color: #1f1f2e; color: white; border-radius: 15px;")
        layout = QVBoxLayout()

        self.icon_label = QLabel(self)
        pixmap = QPixmap('images/image.png')
        self.icon_label.setPixmap(pixmap)
        self.icon_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.icon_label)

        self.title_label = QLabel('YouTube Converter', self)
        self.title_label.setAlignment(Qt.AlignCenter)
        self.title_label.setStyleSheet("font-size: 24px; font-weight: bold;")
        layout.addWidget(self.title_label)

        self.url_input = QLineEdit(self)
        self.url_input.setPlaceholderText('Enter YouTube URL')
        self.url_input.setStyleSheet("padding: 10px; border-radius: 10px; margin: 10px 0;")
        layout.addWidget(self.url_input)

        self.convert_mp3_btn = QPushButton('Convert to MP3', self)
        self.convert_mp3_btn.setStyleSheet("background-color: #1e90ff; color: white; border-radius: 10px; padding: 10px;")
        self.convert_mp3_btn.clicked.connect(lambda: self.convert('mp3'))
        layout.addWidget(self.convert_mp3_btn)

        self.convert_mp4_btn = QPushButton('Convert to MP4', self)
        self.convert_mp4_btn.setStyleSheet("background-color: #1e90ff; color: white; border-radius: 10px; padding: 10px;")
        self.convert_mp4_btn.clicked.connect(lambda: self.convert('mp4'))
        layout.addWidget(self.convert_mp4_btn)

        self.result_label = QLabel('', self)
        self.result_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.result_label)

        self.footer_label = QLabel('Created by Ahmed', self)
        self.footer_label.setAlignment(Qt.AlignCenter)
        self.footer_label.setStyleSheet("color: #1e90ff;")
        layout.addWidget(self.footer_label)

        self.setLayout(layout)

    def convert(self, format):
        url = self.url_input.text()
        if not url:
            self.show_message('Error', 'Please enter a valid YouTube URL.')
            return

        try:
            logging.debug(f'Sending request with URL: {url} and format: {format}')
            response = requests.post('http://localhost:5000/convert', json={'url': url, 'format': format})
            if response.json().get('success'):
                self.result_label.setText(f"Download URL: {response.json().get('downloadUrl')}")
                logging.debug(f"Received download URL: {response.json().get('downloadUrl')}")
            else:
                self.result_label.setText(f"Error: {response.json().get('error')}")
                logging.error(f"Error from server: {response.json().get('error')}")
        except requests.ConnectionError:
            self.show_message('Error', 'Failed to connect to the server. Please ensure the server is running.')
            logging.error('Failed to connect to the server.')

    def show_message(self, title, message):
        QMessageBox.warning(self, title, message)

def start_flask():
    # Get the path to the virtual environment's Python executable
    venv_python = os.path.join(os.getcwd(), 'venv', 'Scripts', 'python.exe')
    with open("server.log", "w") as f:
        subprocess.Popen([venv_python, 'backend.py'], stdout=f, stderr=f)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = App()

    # Start the Flask server in a separate thread
    threading.Thread(target=start_flask).start()

    # Delay to ensure the server starts before the GUI is shown
    time.sleep(5)
    # Run the GUI application
    ex.show()
    sys.exit(app.exec_())
