# Finding Frequent Itemsets

Implementation of SON algorithm `SON.py` in *Apache Spark* using Python 2.7.

## Introduction to SON (Savasere, Omiecinski & Navathe)

### Steps

1. Divide basket file into chunks ,each is the fraction p of the entire file
2. Treat each chunk as a sample
3. Run discovery algorithm on the sample

    support threshold = `ps`
    `s` is the support threshold of entire file (support ratio stays the same in chunks)

4. Collect frequent itemsets from each chunk, whick form the candidate itemsets
5. Make a second pass through baskets
  - Collect counts of candidates
  - Return frequent itemsets

### Why the second pass?

- Memory may not be sufficient to keep counts for all itemsets, including counts for infrequent itemsets in individual chunks
- A global frequent itemset may be not frequent in some chunks (local frequent)

### Properties

- *Global frequent* is an itemset frequent in the entire data set while *local frequent* is an itemset frequent in its own chunk
- A global frequent itemset may not be (local) frequent in all chunks, but it must be frequent in at least one chunk
- Local false negatives possible: itemset *I* not frequent in some chunk but global frequent
- No global negatives: since `sup(I) < ps * 1/p = s`
- Local false positives possible: frequent in some chunks, but not frequent overall
- No global false positives: makes a second pass through the dataset to eliminate false positives

### SON via MapReduce

| | Phase 1 | Phase 2 |
|------|------|------|
| **Task** | Find candidate itemsets (local frequent) | Collect counts & find global frequent itemsets |
| **Map** | Input: a chunk of baskets<br>Output: `(F, 1)`'s, where *F* is a local frequent itemset | Input: all candidate itemsets and a subset of baskets<br>Output: `(C, v)`'s, where *C* is a candidate itemset, *v* is *C*'s count in the subset |
| **Reduce** | Input: `(F, a list of 1's)`<br>Output: `(F, 1)` | Input: `(C, list of v's)`<br>Output: `(C, sum of v's)` if frequent |

## Description

Given a set of baskets, SON algorithm divides them into chunks/partitions and then proceed in two stages.
1. First, local frequent itemsets are collected, which form candidates;
2. Second, it makes second pass through data to determine which candidates are globally frequent.

### Input & Output

`baskets.txt` is a text file which contains a basket (a list of comma-separated item numbers) per line. For example:
```
1,2,3
1,2,5
1,3,4
2,3,4
1,2,3,4
2,3,5
1,2,4
1,2
1,2,3
1,2,3,4,5
```

All frequent itemsets are saved into `putput.txt`, each line of which contains one itemset (a list of comma-separated item numbers) with no particular order. For example,
```
4
1,3,4
1,2,3
2
1,3
2,4
2,3
1
2,3,4
1,4
3
3,4
1,2,4
2,5
1,2
```

### Execution

The program takes 3 arguments (input file, minimum support ratio, output file) and should be invoked as follows.
```
bin/spark-submit SON.py baskets.txt .3 output.txt
```
`.3` is a minimum *support ratio* (that is, for an itemset to be frequent, it should appear in at least 30% of the baskets).

## Notes

- Assuming all basket item are positive integers.
- A standalone *Apriori* algorithm was implemented in stage one.
- The second stage was done in *Spark* (using `mapPartitions()`).

## References

- [Python itertools package](https://docs.python.org/2/library/itertools.html#itertools.combinations)