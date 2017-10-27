# Finding Similar Items

Implementation of [LSH](https://en.wikipedia.org/wiki/Locality-sensitive_hashing) (locality-sensitive hashing) in Spark Python to efficiently find similar users, based on the fraction of the movies they have watched in common.

## Description

Suppose there are 100 different movies, numbered from 0 to 99. Each user is represented as a set of movies. *Jaccard coefficient* is used to measure the similarity of sets.

- Apply [MinHash](https://en.wikipedia.org/wiki/MinHash) to obtain a signature of 20 values for each user, which is acomplished by “logically” permuting the rows of characteristic matrix of the movie-user matrix (i.e., row are movies and columns represent users).

- Assume that the i-th hash function for the signature is `h(x,i) = (3x + 13i) % 100`, where `x` is the original row number in the matrix.

- Apply LSH to speed up the process of finding similar users, where the signature is divided into 5 bands, with 4 values in each band.

- Finding similar users: Based on the LSH result, for each user U, find top-5 users who are most similar to U (by their *Jaccard* similarity, if same, choose the user that has smallest ID). If there aren’t 5 similar users, output all of them.

- Computation of signatures, LSH, and Jaccard similarities of similar users need to be done in parallel.(While computing LSH, take the signatures of one band as key, the user ID as value, and then find the candidate pairs.)

### Input & Output

Each line of the input file represents a user (with ID “U1” for example) and a list of movies the user has watched (e.g., movie #0, 12, 45). Each user has watched at least one movie.
```
U1,0,12,45
U2,2,3,5,99
…
```

For each user with that we could find similar users, output their top-5 similar users to `output.txt`.
```
U2:U9,U10
U3:U8
U8:U3
…
```
Users are output in the increasing order of the integer part (e.g., 1, 5, 10) of their IDs (e.g., U1, U5, U10).

Similar users for each user are ordered in the same way. If there are not 5 similar users after applying LSH, i.e. U2 is only similar with U9, U10, output all them (U9, U10).

### Execution

The program should be invoked as follows.
```
bin/spark-submit lshrec.py input.txt output.txt
```

## References

- [LSH](https://en.wikipedia.org/wiki/Locality-sensitive_hashing)
- [MinHash](https://en.wikipedia.org/wiki/MinHash)