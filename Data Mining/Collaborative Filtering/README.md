# Collaborative Filtering

Implement the incremental *UV decomposition* algorithm, where the element is learned one at a time.

## Description

Consider the latent factor modeling of utility matrix M (e.g., a rating matrix where rows represent users and columns products such as movies). In latent factor modeling, the goal is to decompose M into lower-rank matrices U and V such that the difference between M and UV is minimized.

Assume initially all elements in latent factor matrix U and V are 1’s.

- The learning starts with learning elements in U row by row, i.e., `U[1,1], U[1,2], …, U[2, 1], …`
- It then moves on to learn elements in V column by column, i.e., `V[1,1], V[2,1], …, V[1, 2], …`

When learning an element, it uses the latest value learned for all other elements and eventually compute the optimal value for the element to minimize the current [RMSE](https://en.wikipedia.org/wiki/Root-mean-square_deviation).

The learning process stops after a specified number of iterations, where a round of learning all elements in U and V is one iteration.

The algorithm should output RMSE after each iteration (remember that the mean is computed based on non-blank elements in the input matrix M).

### Input & Output

“input-matrix” is a utility matrix described above. It comes in sparse format. For example:
```
1,1,5
1,2,2
1,3,4
1,4,4
1,5,3
2,1,3
…
```

After each iteration, output to standard output the RMSE with 4 floating points:
```
1.0019
0.9794
0.8464
…
```

### Execution

The program should be invoked as follows.
```
python uv.py input-matrix n m f k
```

- n is the number of rows (users) of the matrix, while m is the number of columns (products).
- f is the number of dimensions/factors in the factor model. That is, U is n-by-f matrix, while V is f-by-m matrix.
- k is the number of iterations.

For example, `python uv.py matrix.dat 5 5 2 10`
