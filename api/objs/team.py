from typing import List
from .user import User


class Team:
    def __init__(self):
        self.score: int = 0
        self.in_geofence_count: int = 0
        self.users: List[User] = []

    def to_dict(self):
        return {
            "score": self.score,
            "users": [u.to_dict() for u in self.users],
        }

    def add_user(self, u: User):
        self.users.append(u)
