from flask import Flask, jsonify
import requests
from google.cloud import firestore

from utils.auth import auth


app = Flask(__name__)

@app.route("/")
def index():
    return "hello"

if __name__=="__main__":
    app.run()
