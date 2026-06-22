---
name: zet
description: zet — CLI utility for set operations (union, intersection, difference) on lines
---
# zet Plugin

zet — CLI utility for set operations (union, intersection, difference) on lines from files or stdin.

## Quickstart

zet performs set operations (union, intersection, difference, and symmetric difference) on lines from files or stdin.

```bash
# Union of two files
zet union file1.txt file2.txt

# Intersection
zet intersect file1.txt file2.txt

# Difference (lines in A but not in B)
zet diff file1.txt file2.txt

# Symmetric difference
zet symdiff file1.txt file2.txt
```
