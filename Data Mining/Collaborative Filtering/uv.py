'''
UV Decomposition

@author:    Yucheng Guo
@copyright: Yucheng Guo @ Data Informatics, University of Southern California. All rights reserved.
@contact:   yuchengg@usc.edu
@version:   1.0
@create:    March 24, 2017
'''

import sys
import numpy as np

# n(user) * m(product) matrix, f dimensions, k iterations
n, m = int(sys.argv[2]), int(sys.argv[3])
f, k = int(sys.argv[4]), int(sys.argv[5])

# Use 0's to represent blank entries
M = np.zeros((n, m))
for line in open(sys.argv[1], 'r').readlines():
    v = line.split(',')
    M[int(v[0]) - 1, int(v[1]) - 1] = float(v[2])

# initialize U and V matrices
U, V = np.ones((n, f)), np.ones((f, m))


def updateU(r, s):
    nume, deno = 0, 0  # numerator, denominator
    for j in range(m):
        if M[r, j] != 0:
            nume += V[s, j] * (M[r, j] - np.dot(U[r], V.T[j]) + U[r, s] * V[s, j])
            deno += V[s, j] ** 2
    return nume / deno


def updateV(r, s):
    nume, deno = 0, 0
    for i in range(n):
        if M[i, s] != 0:
            nume += U[i, r] * (M[i, s] - np.dot(U[i], V.T[s]) + U[i, r] * V[r, s])
            deno += U[i, r] ** 2
    return nume / deno


def rmse(M, P):
    se, cnt = 0, 0
    for i in range(n):
        for j in range(m):
            if M[i, j] != 0:
                cnt += 1
                se += (M[i, j] - P[i, j]) ** 2
    return np.sqrt(se / cnt)

for iter in range(k):
    for r in range(n):
        for s in range(f):
            U[r, s] = updateU(r, s)

    for s in range(m):
        for r in range(f):
            V[r, s] = updateV(r, s)

    print '%.4f' % rmse(M, U.dot(V))
