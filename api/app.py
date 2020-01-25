from flask import Flask, jsonify
import requests
from google.cloud import firestore

from utils.auth import authenticate

app = Flask(__name__)

@app.route("/")
def index():
    return jsonify(200)

@app.route("/user", methods=["POST", "GET"])
def user_route():
    if request.method == "POST":
        create_user(request.body)
    elif request.method == "GET":
        get_user(request.body)

@app.route("/game", method=["POST", "GET"])
def game_route():
    if request.method == "POST":
        create_game(request.body)
    elif request.method == "GET":
        get_game(request.body)

@app.route("/game/score", method="GET")
def score_route():
    return jsonify(get_score)

if __name__=="__main__":
    app.run()
