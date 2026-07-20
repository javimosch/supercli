---
name: uplot
description: Use this skill when the user wants terminal charts from CSV or TSV data — bar charts, histograms, scatter plots, and box plots without leaving the shell or opening a GUI.
---

# uplot Plugin

YouPlot (`uplot`) draws charts directly in the terminal. Pipe CSV/TSV data or pass a file to render bar charts, histograms, scatter plots, and more.

## Installation

```bash
brew install youplot
# or
gem install youplot
```

## Basic Usage

```bash
# Bar chart from CSV
uplot bar data.csv

# Histogram
uplot hist values.tsv

# Scatter plot
uplot scatter points.csv

# Pipe data
echo "a\n1\n2\n3" | uplot bar
```

## Usage Examples

- "Draw a bar chart of these sales numbers in the terminal"
- "Show a histogram of response times from this CSV"
- "Plot a scatter chart from data.tsv"

## SuperCLI

```bash
sc uplot plot bar data.csv
sc uplot plot histogram values.tsv
sc plugins learn uplot
```
