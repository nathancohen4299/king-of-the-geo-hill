from enum import Enum


class TeamColor(Enum):
    RED = "RED"
    BLUE = "BLUE"

    def __str__(self):
        return self.value
