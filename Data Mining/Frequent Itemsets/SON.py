'''
SON algorithm for Finding Frequent Itemsets

@author:    Yucheng Guo
@copyright: Yucheng Guo @ Data Informatics, University of Southern California. All rights reserved.
@contact:   yuchengg@usc.edu
@version:   1.0
@create:    February 24, 2017
'''

import sys
from pyspark import SparkContext
from operator import add
from itertools import chain, combinations as com

sc = SparkContext(appName="SON")
baskets = sc.textFile(sys.argv[1], 3).map(lambda x: x.split(','))
sr = float(sys.argv[2])  # support ratio
globSup = sr * baskets.count()  # global support


def apriori(itr):
    allCans, itr = [], list(itr)  # all candidates
    k, sup = 1, len(itr) * sr  # k-itemsets, support
    fi = [(x,) for x in set(chain.from_iterable(itr))]  # C1

    # frequent k-itemsets
    while fi:
        dic = {k: 0 for k in fi}
        for it in itr:
            for c in dic:
                if set(c).issubset(it):
                    dic[c] += 1
        fi = [x for x in dic if dic[x] >= sup]
        allCans += fi
        k += 1
        if len(fi) < k:
            break
        # generate Ck
        fi = [x for x in com(set(chain.from_iterable(fi)), k)
              if not [y for y in com(x, k - 1) if y not in fi]]

    return allCans

# phase 1
canRdd = baskets.mapPartitions(apriori).distinct()  # candidates RDD
canDic = {k: 0 for k in canRdd.collect()}  # candidates dictionary
print 'phase 1 candidates: ' + str(canRdd.count())


def globCnt(itr):
    for it in itr:
        for can in canDic:
            if set(can).issubset(set(it)):
                canDic[can] += 1
    return canDic.items()

# phase 2
freRdd = baskets.mapPartitions(globCnt).reduceByKey(add)\
                .filter(lambda x: x[1] >= globSup).map(lambda x: x[0])
print 'phase 2 results: ' + str(freRdd.count())

# write to file
f = open(sys.argv[3], 'w')
print '##################### ready for out #####################'
for out in freRdd.collect():
    f.write(','.join(out) + '\n')
print '#####################  output done  #####################'
f.close()
