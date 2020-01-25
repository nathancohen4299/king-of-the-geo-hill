class User:
    def __init__(self, user_name: str):
        self.user_name: str = user_name

    def to_dict(self):
        return {"user_name": self.user_name}
