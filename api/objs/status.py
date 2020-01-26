from enum import Enum


class Status(Enum):
    START = 1
    ACTIVE = 2
    FINISH = 3

    def __str__(self):
        return self.value
