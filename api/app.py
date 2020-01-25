from flask import Flask, jsonify, request
from http import HTTPStatus
from typing import Dict

from api.objs.game import Game
from api.objs.team import Team
from api.objs.team_color import TeamColor
from api.objs.user import User

app = Flask(__name__)

games: Dict[str, Game] = {}


@app.route("/")
def index():
    return jsonify(HTTPStatus.OK)


@app.route("/user", methods=["POST", "GET"])
def user_route():
    json = request.get_json()
    if request.method == "POST":
        s = json["teamCode"].split("-")
        team = TeamColor.conv(s[1])
        game_name = s[0]
        if game_name not in games:
            return jsonify(HTTPStatus.NOT_FOUND)
        u = User(json["username"])
        games[game_name].add_user(u, team)

        ret_dict = {
            "name": games[game_name].name,
            "active": games[game_name].active,
            "duration": games[game_name].duration
        }

        return jsonify(ret_dict)
    elif request.method == "GET":
        user_name = json["username"]
        game_name = json["gameName"]

        if game_name not in games:
            return jsonify(HTTPStatus.NOT_FOUND)

        if user_name not in games[game_name].user_names:
            return jsonify(HTTPStatus.NOT_FOUND)

        team: str = games[game_name].user_names[user_name]

        if team == "RED":
            return jsonify(games[game_name].red_team[user_name])
        elif team == "BLUE":
            return jsonify(games[game_name].blue_team[user_name])

        return jsonify(HTTPStatus.BAD_REQUEST)

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
