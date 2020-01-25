from typing import List
from api.objs.team import Team


class Game:
    def __init__(self, name: str, duration: float):
        self.name: str = name
        self.duration: float = duration
        self.blue_team: Team = Team(self.name + "BLUE")
        self.red_team: Team = Team(self.name + "RED")
