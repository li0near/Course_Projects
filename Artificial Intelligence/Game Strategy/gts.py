# Author: Yucheng Guo
# Date: 06/25/2017
# Execution: python gts.py -i <inputFile>

import sys

infinity = float("+inf")


def log(node, color, depth, value, alpha, beta):
    outFile.write("{node}, {color}, {depth}, {value}, {alpha}, {beta}".format(
        node=node,
        color=color,
        depth=depth,
        value=value,
        alpha=alpha,
        beta=beta))

    print("{node}, {color}, {depth}, {value}, {alpha}, {beta}".format(
        node=node,
        color=color,
        depth=depth,
        value=value,
        alpha=alpha,
        beta=beta))


def AC3(state):
    """Check binary constraints and return the next available actions."""
    copy = state.copy()
    copy.pop("trace", None)
    colored = {n: c for n, c in copy.keys()}
    coloredNodes = colored.keys()
    colorable = set([])
    chkQue, actions = [], {}

    for cn in coloredNodes:
        colorable.update(graph[cn])
    colorable -= set(coloredNodes)

    # for n in colorable:
    #     actions[n] = set(domain)
    #     chkQue += [(n, nbr) for nbr in graph[n] if nbr in coloredNodes]
    # chkQue[:] = [(n, b) for (n, b) in chkQue if (b, n) not in chkQue]

    for clb in colorable:
        tobeRemoved = []
        for nbr in graph[clb]:
            if nbr in coloredNodes:
                tobeRemoved.append(colored[nbr])
        actions[clb] = set(domain) - set(tobeRemoved)
    # def revise(color, xi, xj):
    #     if xj in coloredNodes:
    #         for c in colored[xj]:
    #             if color != c:
    #                 return False
    #     else:
    #         for c in actions[xj]:
    #             if color != c:
    #                 return False
    #     actions[xi].remove(color)
    #     # print("remove: " + xi + ": " + color)
    #     return True
    #
    # while chkQue:
    #     xi, xj = chkQue.pop(0)
    #     for color in list(actions[xi]):
    #         if revise(color, xi, xj):
    #             for xk in graph[xi]:
    #                 if xk not in coloredNodes and xk in colorable:
    #                     chkQue.append((xk, xi))

    return sorted([(n, c) for n in actions for c in actions[n]])


def alphabeta_search(state, maxDepth):
    """Search game to decide best move using alpha-beta pruning.
       Terminates when reach the given depth."""

    def terminal_test(state, depth):
        return depth >= maxDepth or not AC3(state)

    def utility(state):
        copy = state.copy()
        trace = copy.pop("trace")
        evaluation = 0
        for (node, color), player in copy.items():
            if player == "1":
                evaluation += weights_1[color]
            else:
                evaluation -= weights_2[color]
        if evaluation not in traceDic:
            traceDic[evaluation] = trace
        return evaluation

    # state = {(node, color): player; ...}
    def successors(state, depth):
        """Return the next available actions with their resulting state."""
        # sucList = []
        for action in AC3(state):
            temp = state.copy()
            temp[(action[0], action[1])] = "1" if depth % 2 == 0 else "2"
            temp["trace"].append(action)
            yield action, temp
        #     sucList.insert(0, (action, temp))
        # return sucList

    def max_value(state, alpha, beta, depth):
        current = state["trace"][-1]
        if terminal_test(state, depth):
            v = utility(state)
            log(current[0], current[1], depth, v, alpha, beta)
            return v

        v = -infinity
        for (a, s) in successors(state, depth):
            log(current[0], current[1], depth, v, alpha, beta)
            v = max(v, min_value(s, alpha, beta, depth + 1))
            if v >= beta:
                log(current[0], current[1], depth, v, alpha, beta)
                return v
            alpha = max(alpha, v)
        log(current[0], current[1], depth, v, alpha, beta)
        return v

    def min_value(state, alpha, beta, depth):
        current = state["trace"][-1]
        if terminal_test(state, depth):
            v = utility(state)
            log(current[0], current[1], depth, v, alpha, beta)
            return v

        v = infinity
        for (a, s) in successors(state, depth):
            log(current[0], current[1], depth, v, alpha, beta)
            v = min(v, max_value(s, alpha, beta, depth + 1))
            if v <= alpha:
                log(current[0], current[1], depth, v, alpha, beta)
                return v
            beta = min(beta, v)
        log(current[0], current[1], depth, v, alpha, beta)
        return v

    # Body of alphabeta_search starts here:
    # The default test cuts off at depth d or at a terminal state

    #  Return the first element with the highest fn(seq[i]) score.
    # def argmax(seq, fn):
    #     best = seq[0]
    #     best_score = fn(best)
    #     for x in seq:
    #         x_score = fn(x)
    #         if x_score > best_score:
    #             best, best_score = x, x_score
    #     return best
    #
    # action, state = argmax(successors(state, 0),
    #                       lambda (a, s): min_value(s, -infinity, infinity, 1))

    # bestAction, bestScore = None, -infinity
    # for x in successors(state, 0):
    #     xScore = min_value(x[1], -infinity, infinity, 1)
    #     if xScore > bestScore:
    #         bestAction, bestScore = x[0], xScore
    # return bestAction
    return max_value(state, -infinity, infinity, 0)


with open(sys.argv[2], "r") as inFile:
    colored_1, colored_2, graph = {}, {}, {}
    lines = inFile.read().splitlines()
    domain = lines[0].strip().split(", ")
    for node, color in [x.split(": ") for x in lines[1].strip().split(", ")]:
        if color[-1] == "1":
            colored_1[node] = color.split("-")[0]
        else:
            colored_2[node] = color.split("-")[0]
    maxDepth = int(lines[2].strip())
    weights_1 = {c: int(w) for c, w in [x.split(": ") for x in lines[3].strip().split(", ")]}
    weights_2 = {c: int(w) for c, w in [x.split(": ") for x in lines[4].strip().split(", ")]}
    for line in lines[5:]:
        node, nbrs = line.strip().split(": ")  # node and its neighbors
        graph[node] = nbrs.split(", ")

outFile = open("output.txt", "w")

traceDic, iniState = {}, {}
iniState[tuple(colored_1.items()[0])] = "1"
iniState[tuple(colored_2.items()[0])] = "2"
iniState["trace"] = [colored_1.items()[0], colored_2.items()[0]]
maxValue = alphabeta_search(iniState, maxDepth)
trace = traceDic[maxValue][2]
# first move, first color, utility
# outFile.write("{fm}, {fc}, {u}".format(fm=trace[0], fc=trace[1], u=maxValue))
print("{fm}, {fc}, {u}".format(fm=trace[0], fc=trace[1], u=maxValue))
outFile.write("{fm}, {fc}, {u}".format(fm=trace[0], fc=trace[1], u=maxValue))
