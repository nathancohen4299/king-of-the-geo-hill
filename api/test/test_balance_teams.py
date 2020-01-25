from api.objs.game import Game


def test_team_balance_1():
    list1 = [1, 2, 3, 4, 5]
    list2 = [6, 7, 3]
    list3 = [5, 7]
    Game.balance_teams(list1, list2, list3)
    assert (len(list1) == len(list2))
