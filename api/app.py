from flask import Flask, jsonify, request, abort
from http import HTTPStatus
from typing import Dict

from api.objs.game import Game
from api.objs.team import Team
from api.objs.team_color import TeamColor
from api.objs.user import User

import logging

app = Flask(__name__)

games: Dict[str, Game] = {}


@app.route("/")
def index():
    return jsonify(HTTPStatus.OK)


@app.route("/game/<game_id>/user/<user_id>", methods=["POST", "GET", "PUT"])
def user_route(game_id: str, user_id: str):
    json = request.get_json()
    logging.info(json)
    if request.method == "POST":
        game_id: str = game_id

        if game_id not in games:
            return jsonify(HTTPStatus.NOT_FOUND)

        if not games[game_id].add_user(user_id, TeamColor.AUTO):
            abort(HTTPStatus.CONFLICT)

        ret_dict = {
            "game_id": games[game_id].id,
            "status": games[game_id].status.name,
            "duration": games[game_id].duration,
        }

        return jsonify(ret_dict)
    elif request.method == "GET":

        if game_id not in games:
            abort(HTTPStatus.NOT_FOUND, "Game ID")

        if user_id not in games[game_id].user_names:
            abort(HTTPStatus.NOT_FOUND, "User")

        return jsonify(games[game_id].user_names[user_id].value)
    elif request.method == "PUT":
        team_color_str = json["team_color"].upper()

        team = TeamColor(team_color_str)

        if game_id not in games:
            abort(HTTPStatus.NOT_FOUND, "Game ID")

        if user_id not in games[game_id].user_names:
            abort(HTTPStatus.NOT_FOUND, "User")

        if not games[game_id].set_user(user_id, team):
            abort(HTTPStatus.CONFLICT, "Something went wrong")

        return jsonify("OK")

    abort(HTTPStatus.BAD_REQUEST)


@app.route("/game/<game_id>", methods=["GET"])
def game_get_route(game_id: str):
    if request.method == "GET":
        if game_id in games:
            return jsonify(games[game_id].to_dict())
        else:
            abort(HTTPStatus.NOT_FOUND)


@app.route("/game", methods=["POST"])
def game_route():
    json = request.get_json()
    user_id = json["user_id"]
    if request.method == "POST":
        game = Game(json["game_id"], json["duration"])
        if game.id in games:
            abort(HTTPStatus.CONFLICT, "A Game with that ID already exists")
        else:
            games[game.id] = game
            games[game.id].add_user(user_id, TeamColor.AUTO)
        return jsonify(game.to_dict())
    abort(HTTPStatus.BAD_REQUEST)


@app.route("/team/<game_id>", methods=["GET"])
def teams_route(game_id: str):
    if request.method == "GET":
        if game_id in games:
            return_dict = {
                "blue_team": games[game_id].blue_team.to_dict(),
                "red_team": games[game_id].red_team.to_dict(),
            }
            return jsonify(return_dict)

    abort(HTTPStatus.NOT_FOUND)


@app.route("/team/<game_id>/count", methods=["GET"])
def team_count(game_id: str):
    if request.method == "GET":
        if game_id in games:
            return_dict = {
                "blue_team_count": len(games[game_id].blue_team.users),
                "red_team_count": len(games[game_id].red_team.users),
            }
            return jsonify(return_dict)

    abort(HTTPStatus.NOT_FOUND)


@app.route("/team/<game_id>/<team_color>", methods=["GET"])
def team_route(game_id: str, team_color: str):
    if request.method == "GET":
        if game_id in games:
            team = TeamColor(team_color.upper())
            if team == TeamColor.RED:
                return jsonify(games[game_id].red_team.to_dict())
            elif team == TeamColor.BLUE:
                return jsonify(games[game_id].blue_team.to_dict())

    abort(HTTPStatus.NOT_FOUND)


@app.route("/team/<game_id>/<team_color>/count", methods=["GET"])
def team_count_spec(game_id: str, team_color: str):
    if request.method == "GET":
        if game_id in games:
            team = TeamColor(team_color.upper())
            if team == TeamColor.RED:
                return {"count": len(games[game_id].red_team.users)}
            elif team == TeamColor.blue:
                return {"count": len(games[game_id].blue_team.users)}

            abort(HTTPStatus.NOT_FOUND, "Team Not Founda")

    abort(HTTPStatus.NOT_FOUND)


@app.route("/game/score", methods=["GET"])
def score_route():
    return jsonify("UNIMPLEMENTED")


if __name__ == "__main__":
    app.run()
