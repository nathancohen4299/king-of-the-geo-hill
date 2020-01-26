
from flask_apscheduler import APScheduler
from api.app import app


class Config(object):
    JOBS = [
        {
            'id': 'job1',
            'func': 'entry:job1',
            'args': (1, 2),
            'trigger': 'interval',
            'seconds': 10
        }
    ]

    SCHEDULER_API_ENABLED = True


def job1(a, b):
    print(str(a) + ' ' + str(b))



if __name__ == "__main__":
    app.config.from_object(Config())

    scheduler = APScheduler()
    # it is also possible to enable the API directly
    # scheduler.api_enabled = True
    scheduler.init_app(app)
    scheduler.start()

    app.run()
    app.run()
