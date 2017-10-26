# Two-Phase Matrix Multiplication

Implementation of a Spark program in Python 2.7, `TwoPhase.py`, that computes the multiplication of two given matrices using the two-phase approach.

## Description


| TwoPhase | Phase 1 | Phase 2 |
|----------|---------|---------|
| Map | Form key-value pairs with joining value (k) as key:<br> 1. A[i,k] =><br>   (k, ('A', i, A[i, k]))<br> 2. B[k,j] =><br>   (k, ('B', j, B[k, j])) | Not much to do, just pass it through |
| Reduce |    centered   | Perform addition of p values that come via an iterator:<br>((i, j), [v<sub>1</sub>, v<sub>2</sub>, …, v<sub>p</sub>]) =><br>((i, j), sum([v~1~, v~2~, …, v~p~])) |
| col 3 is | right-aligned |   $9 |

A(I, K, V) * B(K, J, W): v = A[i, k], w = B[k, j]
Map task: Form key-value pairs with joining value (k) as key
Reduce task: Perform join & multiplication
–

v = A[i, k], w = B[k, j]

The input matrices A and B are stored in two separate directories, e.g., `mat-A` and `mat-B`. Each directory contains a single text file, each line of which is a tuple (row-index, column-index, value) that specifies a non-zero value in the matrix.

For example, the following is the content of `mat-A/values.txt` which stores the entries for the matrix A shown above.
```
0,0,2
0,1,2
0,2,1
1,0,2
1,1,1
2,0,1
2,2,2
```

The output file `output.txt` contains the entries of matrix C (= A * B) in the following format (tab-separated).
```
1,1 3
1,2 7
2,1 2
2,2 4
3,1 3
3,2 3
```
## Execution

The program should be invoked as follows.
```
bin/spark-submit TwoPhase.py matA/values.txt mat-B/values.txt output.txt
```

## Notes

- Assuming that matrix entries are all integers.
- Implementing using the two-phase approach, and the use of join transformation isn't allowed.