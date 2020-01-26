import logging
import os
from http import HTTPStatus
from typing import Dict, List, Any

from shapely.geometry import Polygon, Point

import requests
from flask import Flask, jsonify, request, abort
from flask_apscheduler import APScheduler

from api.objs.game import Game
from api.objs.status import Status
from api.objs.team_color import TeamColor

app = Flask(__name__)

geofence_id = "5e2d585adb7df6004d1cb8b9"


def get_users_in_geofence():
    headers = {"Authorization": os.getenv("radar_private_key")}
    r = requests.get(
        "https://api.radar.io/v1/geofences/{}".format(geofence_id), headers=headers,
    )
    app.logger.info(r.text)
    app.logger.info(os.getenv("KEY"))
    app.logger.info(r.json())
    update_score(r.json())


scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()
app.apscheduler.add_job(
    "yeet", get_users_in_geofence, trigger="interval", args=(), seconds=1
)

gunicorn_logger = logging.getLogger("gunicorn.error")
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

games: Dict[str, Game] = {}


def update_score(geofence_information):
    polygon_coordinates = [
        (c[0], c[1])
        for c in geofence_information["geofence"]["geometry"]["coordinates"][0]
    ]
    zone = Polygon(polygon_coordinates)
    print(zone.area)

    for game_id in games.keys():
        g = games[game_id]
        if games[game_id].status == Status.ACTIVE:
            for user_id in g.usernames.keys():
                if g.usernames[user_id] == TeamColor.RED:
                    lat, lon = g.red_team.users[user_id].get_coordinates()
                    p: Point = Point(lat, lon)
                    app.logger.info(
                        {
                            "game_id": game_id,
                            "user_id": user_id,
                            "coordinates": "({}, {})".format[lat, lon],
                        }
                    )
                    if zone.contains(p):
                        games[game_id].red_team.in_geofence_count += 1
                elif g.usernames[user_id] == TeamColor.BLUE:
                    lat, lon = g.blue_team.users[user_id].get_coordinates()
                    p: Point = Point(lat, lon)
                    app.logger.info(
                        {
                            "game_id": game_id,
                            "user_id": user_id,
                            "coordinates": "({}, {})".format[lat, lon],
                        }
                    )
                    if zone.contains(p):
                        games[game_id].blue_team.in_geofence_count += 1

    for game_id in games.values():
        if game_id.status == Status.ACTIVE:
            scorer: TeamColor = game_id.perform_score_change()

            # reset geofence counts
            game_id.blue_team.in_geofence_count = 0
            game_id.red_team.in_geofence_count = 0

            game_id.duration -= 1
            if game_id.duration == 0:
                game_id.status = Status.FINISH


def validate_args(*args):
    for a in args:
        if not a:
            abort(HTTPStatus.UNPROCESSABLE_ENTITY)


@app.route("/")
def index():
    return jsonify(success=True)


@app.route("/game/<game_id>/user/<user_id>", methods=["POST", "GET", "PUT"])
def user_route(game_id: str, user_id: str):
    json = request.get_json()
    app.logger.info(json)
    if request.method == "POST":
        game_id: str = game_id

        if game_id not in games:
            return jsonify(HTTPStatus.NOT_FOUND)

        if not games[game_id].add_user(user_id, TeamColor.NONE):
            abort(HTTPStatus.CONFLICT)

        ret_dict = {
            "game_id": games[game_id].id,
            "status": games[game_id].status.name,
            "duration": games[game_id].duration,
        }

        return jsonify(ret_dict)
    elif request.method == "GET":

        if game_id not in games:
            app.logger.error("game_id: {} Not Found. Returned 404".format(game_id))
            abort(HTTPStatus.NOT_FOUND, "game_id")

        if user_id not in games[game_id].usernames:
            app.logger.error("user_id: {} Not Found. Returned 404".format(user_id))
            abort(HTTPStatus.NOT_FOUND, "user_id")

        return jsonify(games[game_id].usernames[user_id].value)
    elif request.method == "PUT":
        validate_args(json["team_color"])
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
    validate_args(json["user_id"], json["game_id"], json["duration"])

    if request.method == "POST":
        user_id = json["user_id"]
        game = Game(json["game_id"], json["duration"])
        if game.id in games:
            abort(HTTPStatus.CONFLICT, "A Game with that ID already exists")
        else:
            games[game.id] = game
            games[game.id].add_user(user_id, TeamColor.NONE)
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


@app.route("/game/score/<game_id>", methods=["PUT"])
def score_route(game_id: str):
    if game_id not in games:
        abort(HTTPStatus.NOT_FOUND, "game_id")
    if games[game_id].status == Status.START:
        return jsonify("Game has not yet started")
    json = request.get_json()
    validate_args(json["user_id"], json["latitude"], json["longitude"])

    user_id: str = json["user_id"]
    latitude: float = json["latitude"]
    longitude: float = json["longitude"]

    team = games[game_id].usernames[user_id]

    if team == TeamColor.RED:
        games[game_id].red_team.users[user_id].latitude = latitude
        games[game_id].red_team.users[user_id].longitude = longitude
    elif team == TeamColor.BLUE:
        games[game_id].blue_team.users[user_id].latitude = latitude
        games[game_id].blue_team.users[user_id].longitude = longitude

    score_dict = {
        "red_team_score": games[game_id].red_team.score,
        "blue_team_score": games[game_id].blue_team.score,
        "control": str(games[game_id].last_in_control),
        "duration": games[game_id].duration,
    }
    return jsonify(score_dict)


@app.route("/info", methods=["GET"])
def get_all_stats():
    stats_dict = {
        "games": [game.to_verbose_dict() for game in games.values()],
    }
    return jsonify(stats_dict)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True, threaded=True)
