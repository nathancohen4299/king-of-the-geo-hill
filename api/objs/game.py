from typing import List
from .team import Team


class Game:
    def __init__(self, name: str, duration: float):
        self.name: str = name
        self.duration: float = duration
        self.blue_team: Team = Team(self.name + "BLUE")
        self.red_team: Team = Team(self.name + "RED")

    def to_dict(self):
        return {"name": self.name, "duration": self.duration, "red_team": self.red_team.to_dict(), "blue_team": self.blue_team.to_dict()}
