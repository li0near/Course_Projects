'''
Two-phase Matrix Multiplication

@author:    Yucheng Guo
@copyright: Yucheng Guo @ Data Informatics, University of Southern California. All rights reserved.
@contact:   yuchengg@usc.edu
@version:   1.0
@create:    February, 10, 2017
'''

import sys
from pyspark import SparkContext
from operator import add

sc = SparkContext(appName="TwoPhase")
matALines = sc.textFile(sys.argv[1])
matBLines = sc.textFile(sys.argv[2])

# phase one map
matA = matALines.map(lambda x: x.split(',')).map(lambda x: (x[1], ('A', x[0], x[2])))
matB = matBLines.map(lambda x: x.split(',')).map(lambda x: (x[0], ('B', x[1], x[2])))

mat = matA.union(matB).groupByKey()

# phase one reduce
mat = mat.flatMap(lambda val: [((x[1], y[1]), int(x[2]) * int(y[2]))
                               for x in val[1] if x[0] == 'A'
                               for y in val[1] if y[0] == 'B'])

# phase two reduce
mat = mat.reduceByKey(add)

output = mat.sortByKey().collect()

f = open(sys.argv[3], 'w')
# write to file
for v in output:
    f.write(str(v[0][0]) + ',' + str(v[0][1]) + '\t' + str(v[1]) + '\n')

f.close()
