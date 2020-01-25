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
        s = json["team_code"].split("-")
        team: TeamColor = TeamColor(s[1])
        game_name: str = s[0]

        if game_name not in games:
            return jsonify(HTTPStatus.NOT_FOUND)
        u = User(json["user_name"])
        games[game_name].add_user(u, team)

        ret_dict = {
            "game_name": games[game_name].name,
            "active": games[game_name].active,
            "duration": games[game_name].duration,
            "team_color": str(games[game_name].user_names[u.user_name]),
        }

        return jsonify(ret_dict)
    elif request.method == "GET":
        user_name = json["user_name"]
        game_name = json["game_name"]

        if game_name not in games:
            return jsonify(HTTPStatus.NOT_FOUND)

        if user_name not in games[game_name].user_names:
            return jsonify(HTTPStatus.NOT_FOUND)

        team_color: TeamColor = games[game_name].user_names[user_name]

        if team_color == TeamColor.RED:
            return jsonify(games[game_name].red_team.users[user_name].to_dict())
        elif team_color == TeamColor.BLUE:
            return jsonify(games[game_name].blue_team.users[user_name].to_dict())

        return jsonify(HTTPStatus.BAD_REQUEST)

    return jsonify(HTTPStatus.BAD_REQUEST)


@app.route("/game", methods=["POST", "GET"])
def game_route():
    json = request.get_json()
    if request.method == "POST":
        game = Game(json["game_name"], json["duration"])
        if game.name in games:
            return jsonify(HTTPStatus.CONFLICT)
        else:
            games[game.name] = game
        return jsonify(game.to_dict())
    elif request.method == "GET":
        if json["game_name"] in games:
            return jsonify(games[json["game_name"]].to_dict())
        else:
            return jsonify(HTTPStatus.NOT_FOUND)

    return jsonify(HTTPStatus.BAD_REQUEST)


@app.route("/game/score", methods=["GET"])
def score_route():
    return jsonify("UNIMPLEMENTED")


if __name__ == "__main__":
    app.run()
