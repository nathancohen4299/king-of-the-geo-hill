from typing import Any, List

from api.objs.game import Game


def balanced(list1: List[Any], list2: List[Any]):
    return abs(len(list1) - len(list2)) <= 1


def test_team_balance_1():
    list1 = [1, 2, 3, 4, 5]
    list2 = [6, 7, 3]
    list3 = [5, 7]
    Game.balance_teams(list1, list2, list3)
    assert balanced(list1, list2)


def test_team_balance_2():
    list1 = [1, 2, 3, 4, 5]
    list2 = [6, 7, 3]
    list3 = [5, 7]
    Game.balance_teams(list2, list1, list3)
    assert balanced(list2, list1)


def test_team_balance_3():
    list1 = [1, 2, 3, 4, 5]
    list2 = [6, 7, 3]
    list3 = [5]
    Game.balance_teams(list1, list2, list3)
    assert balanced(list1, list2)


def test_team_balance_4():
    list1 = [1, 2, 3, 4, 5]
    list2 = [6, 7, 3]
    list3 = []
    list1_len_before = len(list1)
    list2_len_before = len(list2)
    Game.balance_teams(list1, list2, list3)
    assert len(list1) == list1_len_before and len(list2) == list2_len_before
