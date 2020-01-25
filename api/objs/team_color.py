from enum import Enum


class TeamColor(Enum):
    RED = "RED"
    BLUE = "BLUE"

    def conv(self, label: str):
        if label.upper() == "RED":
            return self.RED
        elif label.upper() == "BLUE":
            return self.BLUE
