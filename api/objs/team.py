from typing import List
from .user import User


class Team:
    def __init__(self, code: str):
        self.code: str = code
        self.score: int = 0
        self.users: List[User] = []

    def to_dict(self):
        return {"code": self.code, "score": self.score, "users": [u.to_dict() for u in self.users]}
