class User:
    def __init__(self, user_name: str):
        self.user_name: str = user_name
        self.latitude: float = 0
        self.longitude: float = 0

    def to_dict(self):
        return {"user_name": self.user_name}

    def get_coordinates(self) -> (float, float):
        return self.latitude, self.longitude
