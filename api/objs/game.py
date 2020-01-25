from enum import Enum

from typing import Dict, List
from .team import Team
from .user import User

class Status(Enum):
    START = 1
    ACTIVE = 2
    FINISH = 3

class Game:
    def __init__(self, name: str, duration: float):
        self.name: str = name
        self.duration: float = duration
        self.blue_team: Team = Team(self.name + "-BLUE")
        self.red_team: Team = Team(self.name + "-RED")
        self.active: bool = False
        self.usernames: Dict[str, User] = {}

    def start_game(self):
        self.active = True

    def end_game(self):
        self.active = False

    def add_user(self, u: User):
        self.usernames[u.user_name] = u

    def to_dict(self):
        return {"name": self.name, "duration": self.duration, "red_team": self.red_team.to_dict(), "blue_team": self.blue_team.to_dict()}
