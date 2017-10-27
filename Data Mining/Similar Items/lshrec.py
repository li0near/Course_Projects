'''
LSH for Finding Similar Items

@author:    Yucheng Guo
@copyright: Yucheng Guo @ Data Informatics, University of Southern California. All rights reserved.
@contact:   yuchengg@usc.edu
@version:   1.0
@create:    March 10, 2017
'''

import sys
from pyspark import SparkContext

sc = SparkContext(appName="inf553")
users = sc.textFile(sys.argv[1], 2)\
          .map(lambda x: x.split(','))\
          .map(lambda x: (int(x[0][1:]), [int(y) for y in x[1:]]))
sets = {x[0]: x[1] for x in users.collect()}


# compute signatures
# def comSig(lst):
#     sig = [99] * 20
#     for i in range(20):
#         sig[i] = min([(3 * x + 13 * i) % 100 for x in lst])
#     return sig


# computing Jaccard similarity
def jacSim(x, y):
    return float(len(set(x).intersection(set(y))))/len(set(x).union(set(y)))

users = users.mapValues(lambda x: [min([(3 * y + 13 * i) % 100 for y in x]) for i in range(20)])\
             .flatMap(lambda (k, v): [((tuple(v[4 * i: 4 * (i + 1)]), i), k) for i in range(5)])\
             .groupByKey()\
             .map(lambda x: x[1])\
             .filter(lambda x: len(x) > 1).distinct()\
             .flatMap(lambda x: [(y, [z for z in x if z != y]) for y in x])\
             .reduceByKey(lambda x, y: list(set(x) | set(y)))\
             .map(lambda (x, y): (x, sorted([(jacSim(sets[x], sets[z]), z) for z in y],
                                            key=lambda v: (-v[0], v[1]))))\
             .mapValues(lambda x: sorted([y[1] for y in x[0: 5]]))\
             .sortByKey()\
             .map(lambda (x, y): ('U' + str(x), ['U' + str(z) for z in y]))

output = users.collect()

f = open(sys.argv[2], 'w')
for out in output:
    f.write(out[0] + ':' + ','.join(out[1]) + '\n')
