from flask import Flask, jsonify, request
from http import HTTPStatus

from api.objs.game import Game
from api.objs.team import Team
from api.objs.user import User

app = Flask(__name__)

games = {}


@app.route("/")
def index():
    return jsonify(HTTPStatus.OK)


@app.route("/user", methods=["POST", "GET"])
def user_route():
    json = request.get_json()
    if request.method == "POST":
        s = json["teamCode"].split("-")
        team = "blue_team" if s[1] == "BLUE" else "red_team"
        game_name = s[0]
        if game_name not in games:
            return jsonify(HTTPStatus.NOT_FOUND)
        current_game = games[game_name]
        current_game[team].add_user(User(json["name"]))

        ret_dict = {
            "name": current_game.name,
            "active": current_game.active,
            "duration": current_game.duration
        }

        return jsonify(ret_dict)
    elif request.method == "GET":
        # if json["gameName"] not in games:
        #     return jsonify(HTTPStatus.NOT_FOUND)
        #
        # if json["username"] not in []games[json["gameName"]]:
        #     return jsonify(HTTPStatus.NOT_FOUND)
        return jsonify("UNIMPLEMENTED")

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
        if json["gameName"] in games:
            return jsonify(games[json["gameName"]].to_dict())
        else:
            return jsonify(HTTPStatus.NOT_FOUND)

    return "Error"


@app.route("/game/score", methods=["GET"])
def score_route():
    return jsonify("UNIMPLEMENTED")


if __name__ == "__main__":
    app.run()
