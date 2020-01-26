from typing import List, Dict

from .user import User


class Team:
    def __init__(self):
        self.score: int = 0
        self.in_geofence_count: int = 0
        self.users: Dict[str, User] = {}

    def to_dict(self):
        return {
            "score": self.score,
            "users": [u.to_dict() for u in self.users.values()],
        }

    def add_user(self, u: User):
        self.users[u.user_name] = u
