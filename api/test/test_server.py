from api.app import app


def test_server_runs():
    with app.test_client() as c:
        rv = c.get("/")
        json_data = rv.get_json()
        assert json_data["success"] is True
