from flask import Flask, jsonify, request
from http import HTTPStatus

from api.objs.game import Game
from api.objs.team import Team
from api.objs.user import User

app = Flask(__name__)

games = {}

UNIMPLEMENTED = jsonify("UNIMPLEMENTED")

@app.route("/")
def index():
    return jsonify(200)


@app.route("/user", methods=["POST", "GET"])
def user_route():
    if request.method == "POST":
        return UNIMPLEMENTED
    elif request.method == "GET":
        return UNIMPLEMENTED

    return "Error"


@app.route("/game", methods=["POST", "GET"])
def game_route():
    json = request.get_json()
    if request.method == "POST":
        game = Game(json["gameName"], json["duration"])
        if game.name in games:
            return jsonify(HTTPStatus.CONFLICT)
        else:
            games[game.name] = game
        return jsonify(game.to_dict())
    elif request.method == "GET":
        return UNIMPLEMENTED

    return "Error"


@app.route("/game/score", methods=["GET"])
def score_route():
    return UNIMPLEMENTED


if __name__ == "__main__":
    app.run()
