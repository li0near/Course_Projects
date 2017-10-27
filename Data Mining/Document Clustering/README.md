# Document Clustering

Implementation of the Hierarchical (Agglomerative/bottom-up) Clustering HAC (in Python).

## Description

Representing each document as a unit vector. The unit vector of a document is obtained from `tf*idf` vector of the document, normalized (divided) by its Euclidean length. *tf* is term frequency (# of occurrences of word in the document) and *idf* is given by `log (N+1)/df+1` (use base 2), where N is the number of documents in the given collection and df is the number of documents where the word appears.

- Use Cosine function `A*B/|A||B|` to measure their similarity/distance.
- Use the distance between centroids to measure the distance of two clusters in hierarchical clustering.
- The centroid is given by taking the average over the unit vectors in the cluster. The centroid isn't normalized.
- Use heap-based priority queue to store pairwise distances of clusters. 

Take care on how to handle the removal of nodes that involve the clusters which have been merged: the implementation does not enumerate all nodes in the queue which would take `O(n^2)` time where n is the number of data points to be clustered. Since Python doesn’t provide an efficient way to delete node from heap, use delayed deletion here:

1. Instead of removing old nodes from heap, just keep these nodes in the heap.
2. Every time remove an element from the heap, check if this element is valid (does not contain old clusters) or not. If it is invalid, continue to pop another one.

### Data Sets

use the [Bag-of-words dataset](https://archive.ics.uci.edu/ml/datasets/Bag+of+Words) at UCI Machine Learning Repository to test the algorithms.

The data set contains five collections of documents. Documents have been pre-processed and each collection consists of two files: *vocabulary file* and *document-word file*. Will only use the later one.

For example, [vocab.enron.txt](https://archive.ics.uci.edu/ml/machine-learning-databases/bag-of-words/vocab.enron.txt) is the vocabulary file for the *Enron* email collection which contains a list of words, e.g., “aaa”, “aaas”, etc. [docword.enron.txt.gz](https://archive.ics.uci.edu/ml/machine-learning-databases/bag-of-words/docword.enron.txt.gz) is the (compressed) document-word file, which has the following format:
```
39861
28102
3710420
1 118 1
1 285 1
1 1229 1
1 1688 1
1 2068 1
…
```
- The first line is the number of documents in the collection (39861).
- The second line is the number of words in the vocabulary (28102). Note that the vocabulary only contains the words that appear in at least 10 documents.
- The third line (3710420) is the number of works that appear in at least one document.
- Starting from the fourth line, the content is `<document id> <word id> <tf>`. For example, document #1 has word #118 (i.e., the line number in the vocabulary file) that occurs once.

Since the number of words in the vocabulary may be very big, use `SparseVector` or `csc_matrix`.

### Input & Output

The program takes 2 arguments:
- `docword.txt` is a document-word file.
- `k` is the desired number of clusters.

For each cluster, print to standard output documents IDs that belong to this cluster in one line. Each ID is separated by comma. For example,
```
96,50
79,86,93
97
4,65,69,70
…
```
### Execution

The program should be invoked as follows.
```
python hac.py docword.txt k
```

## References

- [Hierarchical clustering](https://en.wikipedia.org/wiki/Hierarchical_clustering)
- [Python heapq module](https://docs.python.org/2/library/heapq.html)
- [SparseVector](https://spark.apache.org/docs/latest/api/python/pyspark.mllib.html#pyspark.mllib.linalg.SparseVector)
- [csc_matrix](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csc_matrix.html#scipy.sparse.csc_matrix)