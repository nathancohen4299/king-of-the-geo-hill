from enum import Enum

from typing import Any, Dict, List

from .team_color import TeamColor
from .team import Team
from .user import User

import random


class Status(Enum):
    START = 1
    ACTIVE = 2
    FINISH = 3


class Game:
    def __init__(self, name: str, duration: float):
        self.id: str = name
        self.duration: float = duration
        self.potential_blue_team_count: int = 0
        self.potential_red_team_count: int = 0
        self.potential_auto_assign_count: int = 0
        self.blue_team: Team = Team()
        self.red_team: Team = Team()
        self.status: Status = Status.START
        self.user_names: Dict[str, TeamColor] = {}

    def to_dict(self):
        return {
            "id": self.id,
            "duration": self.duration,
            "red_team_count": self.potential_red_team_count,
            "blue_team_count": self.potential_blue_team_count,
            "auto_count": self.potential_auto_assign_count,
            "status": str(self.status.name)
        }

    def start_game(self):
        # initialize teams here
        red_team, blue_team, auto_assign = [], [], []
        for user_name, team in self.user_names.items():
            if team == TeamColor.RED:
                red_team.append(user_name)
            elif team == TeamColor.BLUE:
                blue_team.append(user_name)
            else:
                auto_assign.append(user_name)

        Game.balance_teams(red_team, blue_team, auto_assign)

        self.status = Status.ACTIVE

    def end_game(self):
        self.status = Status.FINISH

    def add_user(self, user_name: str, team: TeamColor):
        u = User(user_name)
        if u.user_name in self.user_names:
            return False

        self.user_names[u.user_name] = team
        if team == TeamColor.RED:
            self.potential_blue_team_count += 1
        elif team == TeamColor.BLUE:
            self.potential_red_team_count += 1
        elif team == TeamColor.AUTO:
            self.potential_auto_assign_count += 1

        return True

    def set_user(self, user_name: str, new_team: TeamColor):
        if user_name not in self.user_names:
            return False

        old_team = self.user_names[user_name]

        if old_team == TeamColor.BLUE:
            self.potential_blue_team_count -= 1
        elif old_team == TeamColor.RED:
            self.potential_red_team_count -= 1
        elif old_team == TeamColor.AUTO:
            self.potential_auto_assign_count -= 1

        self.user_names[user_name] = new_team

        if new_team == TeamColor.BLUE:
            self.potential_blue_team_count += 1
        elif new_team == TeamColor.RED:
            self.potential_red_team_count += 1
        elif new_team == TeamColor.AUTO:
            self.potential_auto_assign_count += 1

    @staticmethod
    def balance_teams(team1: List[Any], team2: List[Any], auto: List[Any]):

        def split_and_add_list_evenly(list1: List[Any], list2: List[Any], list3: List[Any]):
            fh, sh = list3[:(len(list3) // 2)], list3[(len(list3) // 2):]
            list1.extend(fh)
            list2.extend(sh)

        for i in range(0, 2):
            random.shuffle(auto)

        if len(team1) == len(team2):
            split_and_add_list_evenly(team1, team2, auto)

        difference = len(team1) - len(team2)
        if difference > 0:
            if difference >= len(auto):
                team2.extend(auto)
                return
            equalizer, remainder = auto[:difference], auto[difference:]
            team1.extend(equalizer)
            split_and_add_list_evenly(team1, team2, remainder)
        else:
            if difference < 0:
                difference = -difference
                if difference >= len(auto):
                    team1.extend(auto)
                    return
            equalizer, remainder = auto[:difference], auto[difference:]
            team2.extend(equalizer)
            split_and_add_list_evenly(team1, team2, remainder)
