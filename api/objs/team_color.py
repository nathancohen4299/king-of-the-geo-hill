from enum import Enum


class TeamColor(Enum):
    RED = "RED"
    BLUE = "BLUE"

    @staticmethod
    def conv(label: str):
        if label.upper() == "RED":
            return TeamColor.RED
        elif label.upper() == "BLUE":
            return TeamColor.BLUE
