import requests
from flask_apscheduler import APScheduler
from api.app import app, update_score


class Config(object):
    JOBS = [
        {
            "id": "get_users_in_geofence",
            "func": "entry:get_users_in_geofence",
            "args": (),
            "trigger": "interval",
            "seconds": 1,
        }
    ]

    SCHEDULER_API_ENABLED = True


def get_users_in_geofence():
    headers = {"Authorization": "prj_test_sk_593c83bc7be1078df3fd09f125eb776f96906dee"}
    r = requests.get(
        "https://api.radar.io/v1/geofences/5e2c9c6e5f526200f02d9cb4/users",
        headers=headers,
    )
    app.logger.critical(r.text)
    app.logger.critical(r.json()["users"])
    # update_score(r.json()["users"])


if __name__ == "__main__":
    app.config.from_object(Config())

    scheduler = APScheduler()
    # it is also possible to enable the API directly
    # scheduler.api_enabled = True
    scheduler.init_app(app)
    scheduler.start()

    app.run()
