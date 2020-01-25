from enum import Enum

from typing import Dict, List

from .team_color import TeamColor
from .team import Team
from .user import User


class Status(Enum):
    START = 1
    ACTIVE = 2
    FINISH = 3


class Game:
    def __init__(self, name: str, duration: float):
        self.id: str = name
        self.duration: float = duration
        self.blue_team: Team = Team(self.id + "-BLUE")
        self.red_team: Team = Team(self.id + "-RED")
        self.active: bool = False
        self.user_names: Dict[str, TeamColor] = {}

    def start_game(self):
        self.active = True

    def end_game(self):
        self.active = False

    def add_user(self, u: User, team: TeamColor):
        if u.user_name in self.user_names:
            return False

        self.user_names[u.user_name] = team
        if team == TeamColor.RED:
            self.red_team.add_user(u)
        elif team == TeamColor.BLUE:
            self.blue_team.add_user(u)

        return True

    def to_dict(self):
        return {
            "id": self.id,
            "duration": self.duration,
            "red_team": self.red_team.to_dict(),
            "blue_team": self.blue_team.to_dict(),
        }
