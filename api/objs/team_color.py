from enum import Enum


class TeamColor(Enum):
    RED = "RED"
    BLUE = "BLUE"
    NONE = "NONE"
    CONTESTED = "CONTESTED"

    def __str__(self):
        return self.value
