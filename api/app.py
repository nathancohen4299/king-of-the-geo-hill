from flask import Flask, jsonify, request, abort
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
        game_id: str = s[0]

        if game_id not in games:
            return jsonify(HTTPStatus.NOT_FOUND)
        u = User(json["user_name"])

        if not games[game_id].add_user(u, team):
            abort(HTTPStatus.CONFLICT)

        ret_dict = {
            "game_id": games[game_id].id,
            "status": games[game_id].status.name,
            "duration": games[game_id].duration,
            "team_color": games[game_id].user_names[u.user_name].name,
        }

        return jsonify(ret_dict)
    elif request.method == "GET":
        user_name = json["user_name"]
        game_id = json["game_id"]

        if game_id not in games:
            abort(HTTPStatus.NOT_FOUND, "Game ID")

        if user_name not in games[game_id].user_names:
            abort(HTTPStatus.NOT_FOUND, "User")

        team_color: TeamColor = games[game_id].user_names[user_name]

        if team_color == TeamColor.RED:
            return jsonify(games[game_id].red_team.users[user_name].to_dict())
        elif team_color == TeamColor.BLUE:
            return jsonify(games[game_id].blue_team.users[user_name].to_dict())

        abort(HTTPStatus.BAD_REQUEST)

    abort(HTTPStatus.BAD_REQUEST)


@app.route("/game", methods=["POST", "GET"])
def game_route():
    json = request.get_json()
    if request.method == "POST":
        game = Game(json["game_id"], json["duration"])
        if game.id in games:
            return jsonify(HTTPStatus.CONFLICT)
        else:
            games[game.id] = game
        return jsonify(game.to_dict())
    elif request.method == "GET":
        if json["game_id"] in games:
            return jsonify(games[json["game_id"]].to_dict())
        else:
            abort(HTTPStatus.NOT_FOUND)

    abort(HTTPStatus.BAD_REQUEST)


@app.route("/team/<game_id>", methods=["GET"])
def teams_route(game_id: str):
    if request.method == "GET":
        if game_id in games:
            return_dict = {"blue_team": games[game_id].blue_team.to_dict(),
                           "red_team": games[game_id].red_team.to_dict()}
            return jsonify(return_dict)

    abort(HTTPStatus.NOT_FOUND)


@app.route("/team/count", methods=["GET"])
def team_count(game_id: str):
    if request.method == "GET":
        if game_id in games:
            return_dict = {"blue_team_count": len(games[game_id].blue_team.users),
                           "red_team_count": len(games[game_id].blue_team.users)}
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


@app.route("/game/score", methods=["GET"])
def score_route():
    return jsonify("UNIMPLEMENTED")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True, threaded=True)
