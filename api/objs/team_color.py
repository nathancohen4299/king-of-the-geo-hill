from enum import Enum


class TeamColor(Enum):
    RED = "RED"
    BLUE = "BLUE"
    AUTO = "AUTO"
    CONTESTED = "CONTESTED"

    def __str__(self):
        return self.value
