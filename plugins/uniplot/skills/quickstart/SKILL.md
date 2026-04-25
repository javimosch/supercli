# uniplot - Terminal Plotting

## Overview
uniplot provides lightweight plotting to the terminal with 4x resolution via Unicode. Create scatter plots, line plots, and histograms directly in the terminal.

## Quick Start

### Plot data
```bash
sc uniplot plot data <data>
```

### Passthrough to uniplot CLI
```bash
sc uniplot _ <uniplot-args>
```

## Key Features

- **Lightweight**: Fast and efficient terminal plotting
- **4x Resolution**: Unicode characters for higher resolution
- **Multiple Plot Types**: Scatter plots, line plots, histograms
- **Customizable**: Adjustable colors, markers, and styles
- **Streaming**: Experimental streaming support
- **Terminal Native**: Works in any terminal without GUI

## Installation

```bash
pip install uniplot
```

## Usage Examples

### Basic scatter plot
```bash
uniplot plot x=[1,2,3] y=[4,5,6]
```

### Line plot
```bash
uniplot plot x=[1,2,3] y=[4,5,6] --style line
```

### Histogram
```bash
uniplot histogram data=[1,2,3,4,5,6,7,8,9,10]
```

### Custom colors
```bash
uniplot plot x=[1,2,3] y=[4,5,6] --color red
```

## Notes

- Run `uniplot --help` to see all available options
- Supports experimental streaming for real-time data
- Can be integrated with other programs via pipe
