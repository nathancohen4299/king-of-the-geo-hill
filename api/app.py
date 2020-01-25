from flask import Flask, jsonify
import requests
from google.cloud import firestore

import utils.auth as auth


app = Flask(__name__)

@app.route("/")
def index():
    return jsonify(200)

if __name__=="__main__":
    app.run()
