import logging
from http import HTTPStatus
from typing import Dict, List, Any
import requests
from flask_apscheduler import APScheduler
from flask import Flask, jsonify, request, abort

from api.objs.game import Game, Status
from api.objs.team_color import TeamColor

app = Flask(__name__)
def get_users_in_geofence():
    headers = {"Authorization": "prj_test_sk_593c83bc7be1078df3fd09f125eb776f96906dee"}
    r = requests.get(
        "https://api.radar.io/v1/geofences/5e2c9c6e5f526200f02d9cb4/users",
        headers=headers,
    )
    app.logger.critical(r.text)
    app.logger.critical(r.json()["users"])
    # update_score(r.json()["users"])

# class Config(object):
    # JOBS = [
        # {
            # "id": "get_users_in_geofence",
            # "func": "app:get_users_in_geofence",
            # "args": (),
            # "trigger": "interval",
            # "seconds": 1,
        # }
    # ]

    # SCHEDULER_API_ENABLED = True

# app.config.from_object(Config())
scheduler = APScheduler()
# it is also possible to enable the API directly
# scheduler.api_enabled = True
scheduler.init_app(app)
scheduler.start()
app.apscheduler.add_job("yeet", get_users_in_geofence, trigger='interval', args=(), seconds=1)

games: Dict[str, Game] = {}



def update_score(users_in_geofence: List[Dict[str, Any]]):
    # log users here

    for user in users_in_geofence:
        game_id = user["metadata"]["game_id"]
        user_id = user["metadata"]["userId"]
        if game_id in games:
            if user_id in games[user_id].usernames:
                if games[user_id].usernames[user_id] == TeamColor.RED:
                    games[user_id].red_team.in_geofence_count += 1
                elif games[user_id].usernames[user_id] == TeamColor.BLUE:
                    games[user_id].blue_team.in_geofence_count += 1

    for game in games.values():
        if game.status == Status.ACTIVE:
            scorer: TeamColor = game.perform_score_change()

            # reset geofence counts
            game.blue_team.in_geofence_count = 0
            game.red_team.in_geofence_count = 0

            game.duration -= 1
            if game.duration == 0:
                game.status = Status.FINISH


@app.route("/")
def index():
    return jsonify(success=True)


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
            logging.error("game_id: {} Not Found. Returned 404".format(game_id))
            abort(HTTPStatus.NOT_FOUND, "game_id")

        if user_id not in games[game_id].usernames:
            logging.error("user_id: {} Not Found. Returned 404".format(user_id))
            abort(HTTPStatus.NOT_FOUND, "user_id")

        return jsonify(games[game_id].usernames[user_id].value)
    elif request.method == "PUT":
        team_color_str = json["team_color"].upper()

        team = TeamColor(team_color_str)

        if game_id not in games:
            abort(HTTPStatus.NOT_FOUND, "Game ID")

        if user_id not in games[game_id].usernames:
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


@app.route("/game/start/<game_id>", methods=["POST"])
def game_start(game_id: str):
    if game_id not in games:
        abort(HTTPStatus.NOT_FOUND, "game_id")
    games[game_id].start_game()
    return jsonify(success=True)


@app.route("/game/end/<game_id>", methods=["POST"])
def game_end(game_id: str):
    if game_id not in games:
        abort(HTTPStatus.NOT_FOUND, "game_id")
    games[game_id].end_game()
    return jsonify(success=True)


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

            abort(HTTPStatus.NOT_FOUND, "Team Not Found")

    abort(HTTPStatus.NOT_FOUND)


@app.route("/game/score/<game_id>", methods=["GET"])
def score_route(game_id: str):
    if game_id not in games:
        abort(HTTPStatus.NOT_FOUND, "game_id")
    score_dict = {"red_team_score": games[game_id].red_team.score,
                  "blue_team_score": games[game_id].blue_team.score,
                  "control": games[game_id].last_in_control,
                  "duration": games[game_id].duration}
    return jsonify(score_dict)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True, threaded=True)
