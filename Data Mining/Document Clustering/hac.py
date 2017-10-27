'''
HAC

@author:    Yucheng Guo
@copyright: Yucheng Guo @ Data Informatics, University of Southern California. All rights reserved.
@contact:   yuchengg@usc.edu
@version:   1.0
@create:    April 13, 2017
'''

import sys
from heapq import heappush, heappop
from math import log, sqrt
from scipy.sparse import csc_matrix

doc = open(sys.argv[1], 'r')
k = int(sys.argv[2])  # desired number of clusters
nod = int(doc.readline())  # number of documents
nov = int(doc.readline())  # number of words in vocabulary
now = int(doc.readline())  # number of words that occurred

tfDic, dfDic = {}, {}

# build term frequency & document frequency dictionary
for line in doc.readlines():
    word = line.split()
    tfDic[(int(word[0]), int(word[1]))] = int(word[2])

    if int(word[1]) in dfDic:
        dfDic[int(word[1])] += 1
    else:
        dfDic[int(word[1])] = 1

doc.close()

row, col, data = [], [], []
for w, tf in tfDic.items():
    row.append(w[0] - 1)
    col.append(w[1] - 1)
    df = 0
    if w[1] in dfDic:
        df = dfDic[w[1]]
    data.append(tf * log(float(nod + 1)/(df + 1), 2))

# tf * idf vectors before normalized, each row = a doc
vectors = csc_matrix((data, (row, col)))

clusters = {}  # (items) : [centroid, counts, length]
for i in range(nod):
    v = vectors[i]
    v = v / sqrt((v * v.T).sum())  # normalized by length
    # stores centroid, number of vectors, Euclidean length
    clusters[(i,)] = [v, 1, sqrt(v.multiply(v).sum())]

heap = []  # priority queue for distances btw clusters
merged = []  # clusters that have been merged/removed


# return the closest clusters. Raise KeyError if empty.
def popitem(pq):
    while pq:
        p1, p2 = heappop(pq)[1]
        if p1 not in merged and p2 not in merged:
            return p1, p2
    raise KeyError('pop from an empty priority queue')


# using Cosine to measure similarity/distance
def dist(cc1, cc2):     # cluster, vector, length
    vv1, vv2 = clusters[cc1][0], clusters[cc2][0]
    ll1, ll2 = clusters[cc1][2], clusters[cc2][2]
    # converted to negative to be compatible with min-heap
    return 1 - vv1.multiply(vv2).sum() / (ll1 * ll2)

# initialize priority queue
for i in range(nod):
    for j in range(i + 1, nod):
        vi, vj = clusters[(i,)][0], clusters[(j,)][0]
        dis = dist((i,), (j,))
        heappush(heap, [dist((i,), (j,)), ((i,), (j,))])

# continuously merge the closed two clusters until reach k
while len(clusters) > k:
    c1, c2 = popitem(heap)
    v1, n1, l1 = clusters[c1]
    v2, n2, l2 = clusters[c2]
    nv = (v1 * n1 + v2 * n2) / (n1 + n2)  # new vector
    nc = tuple(sorted(c1 + c2))           # new cluster
    clusters[nc] = [nv, n1 + n2, sqrt((nv * nv.T).sum())]
    merged.append(c1)  # add to the removed cluster list
    merged.append(c2)
    del clusters[c1], clusters[c2]
    for clu in clusters:  # push distances btw new cluster
        if clu != nc:     # and others into priority queue
            heappush(heap, [dist(clu, nc), (clu, nc)])

for cluster in clusters:
    print(','.join(str(x + 1) for x in cluster))
