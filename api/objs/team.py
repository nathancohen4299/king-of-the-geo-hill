from typing import List
from api.objs.user import User


class Team:
    def __init__(self, code: str):
        self.code: str = code
        self.users: List[User] = []
        self.score: int = 0
