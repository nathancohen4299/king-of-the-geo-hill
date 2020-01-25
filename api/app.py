from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

radar_secret = "prj_test_sk_593c83bc7be1078df3fd09f125eb776f96906dee"
radar_publishable = "prj_test_pk_0889e881e212db85de58eb26ba51acfec369c037"

@app.route("/")
def index():
    return jsonify(200)


@app.route("/user", methods=["POST", "GET"])
def user_route():
    if request.method == "POST":
        return create_user(request.body)
    elif request.method == "GET":
        return get_user(request.body)

    return "Error"


@app.route("/game", methods=["POST", "GET"])
def game_route():
    if request.method == "POST":
        return create_game(request.body)
    elif request.method == "GET":
        return get_game(request.body)

    return "Error"


@app.route("/game/score", methods=["GET"])
def score_route():
    return jsonify(get_score)


if __name__ == "__main__":
    app.run()
