#!/bin/bash
set -e

VERSION="1.0.0"

show_version() {
    echo "disk-analyzer v${VERSION}"
}

show_help() {
    cat << EOF
disk-analyzer v${VERSION} - Advanced disk usage analyzer

Usage:
  disk-analyzer <command> [options]

Commands:
  analyze <path>         Analyze disk usage for directory
  large-files <path>     Find large files above threshold
  file-types <path>      Aggregate files by type/extension
  cleanup-report <path>  Generate cleanup recommendations
  version                Show version information
  help                   Show this help message

Global Options:
  --json                 Output in JSON format
  --min-size SIZE        Minimum file size (e.g., 100M, 1G)
  --depth N              Directory depth for analysis
  --top N                Show top N results
  --aggressive           More aggressive cleanup recommendations

Examples:
  disk-analyzer analyze /home/user
  disk-analyzer analyze /var/log --depth 3 --json
  disk-analyzer large-files /home/user --min-size 100M --top 20
  disk-analyzer file-types /home/user/projects
  disk-analyzer cleanup-report /var/log --aggressive
EOF
}

analyze_directory() {
    local path="$1"
    local depth="${2:-2}"
    local json_output="$3"
    
    if [[ ! -d "$path" ]]; then
        echo "Error: Directory '$path' does not exist" >&2
        exit 1
    fi
    
    if [[ "$json_output" == "true" ]]; then
        echo '{"version":"1.0","path":"'"$path"'","depth":'"$depth"',"directories":['
        du -h --max-depth="$depth" "$path" 2>/dev/null | sort -hr | head -20 | while read size dir; do
            echo '{"size":"'"$size"'","path":"'"$dir"'"},'
        done | sed '$ s/,$//'
        echo ']}'
    else
        echo "Disk usage analysis for: $path"
        echo "Depth: $depth"
        echo "================================"
        echo "Top directories by size:"
        du -h --max-depth="$depth" "$path" 2>/dev/null | sort -hr | head -20
        echo ""
        echo "Total size:"
        du -sh "$path" 2>/dev/null
    fi
}

find_large_files() {
    local path="$1"
    local min_size="${2:-100M}"
    local top="${3:-10}"
    local json_output="$4"
    
    if [[ ! -d "$path" ]]; then
        echo "Error: Directory '$path' does not exist" >&2
        exit 1
    fi
    
    if [[ "$json_output" == "true" ]]; then
        echo '{"version":"1.0","path":"'"$path"'","min_size":"'"$min_size"'","files":['
        find "$path" -type f -size +"$min_size" 2>/dev/null | xargs ls -lhS 2>/dev/null | head -"$top" | while read line; do
            # Parse ls output: permissions links owner group size month day time/year filename
            size=$(echo "$line" | awk '{print $5}')
            filename=$(echo "$line" | awk '{for(i=9;i<=NF;i++) printf $i" "; print ""}' | sed 's/[[:space:]]*$//')
            echo '{"size":"'"$size"'","path":"'"$filename"'"},'
        done | sed '$ s/,$//'
        echo ']}'
    else
        echo "Large files analysis for: $path"
        echo "Minimum size: $min_size"
        echo "================================"
        find "$path" -type f -size +"$min_size" 2>/dev/null | xargs ls -lhS 2>/dev/null | head -"$top"
    fi
}

analyze_file_types() {
    local path="$1"
    local json_output="$2"
    
    if [[ ! -d "$path" ]]; then
        echo "Error: Directory '$path' does not exist" >&2
        exit 1
    fi
    
    if [[ "$json_output" == "true" ]]; then
        echo '{"version":"1.0","path":"'"$path"'","file_types":{'
        find "$path" -type f 2>/dev/null | sed 's/.*\.//' | sort | uniq -c | sort -rn | while read count ext; do
            if [[ -n "$ext" ]]; then
                echo '"'"$ext"'":'"$count"','
            fi
        done | sed '$ s/,$//'
        echo '}}'
    else
        echo "File type analysis for: $path"
        echo "================================"
        echo "File extensions by count:"
        find "$path" -type f 2>/dev/null | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -20
        echo ""
        echo "Total files:"
        find "$path" -type f 2>/dev/null | wc -l
    fi
}

generate_cleanup_report() {
    local path="$1"
    local aggressive="$2"
    local json_output="$3"
    
    if [[ ! -d "$path" ]]; then
        echo "Error: Directory '$path' does not exist" >&2
        exit 1
    fi
    
    # Common cleanup targets
    local targets=(
        "node_modules:*/node_modules:Development dependencies"
        ".git:*/.git:Git repositories (use with caution)"
        "cache:*/.cache:Application cache"
        "log:*.log:Log files"
        "tmp:*tmp*:Temporary files"
    )
    
    if [[ "$json_output" == "true" ]]; then
        echo '{"version":"1.0","path":"'"$path"'","mode":"'"$([ "$aggressive" == "true" ] && echo "aggressive" || echo "conservative")"'","recommendations":['
        
        for target in "${targets[@]}"; do
            IFS=':' read -r pattern description <<< "$target"
            count=$(find "$path" -type d -name "$pattern" 2>/dev/null | wc -l)
            if [[ $count -gt 0 ]]; then
                echo '{"pattern":"'"$pattern"'","description":"'"$description"'","count":'"$count"',"action":"review"},'
            fi
        done | sed '$ s/,$//'
        
        # Large files recommendation
        large_count=$(find "$path" -type f -size +100M 2>/dev/null | wc -l)
        if [[ $large_count -gt 0 ]]; then
            echo '{"pattern":"large-files","description":"Files larger than 100M","count":'"$large_count"',"action":"review"},'
        fi | sed '$ s/,$//'
        
        echo ']}'
    else
        echo "Cleanup report for: $path"
        echo "Mode: $([ "$aggressive" == "true" ] && echo "aggressive" || echo "conservative")"
        echo "================================"
        echo "Potential cleanup targets:"
        for target in "${targets[@]}"; do
            IFS=':' read -r pattern description <<< "$target"
            count=$(find "$path" -type d -name "$pattern" 2>/dev/null | wc -l)
            if [[ $count -gt 0 ]]; then
                echo "  $pattern: $count found - $description"
            fi
        done
        
        echo ""
        echo "Large files (>100M):"
        find "$path" -type f -size +100M 2>/dev/null | wc -l
        echo ""
        echo "Total disk usage:"
        du -sh "$path" 2>/dev/null
    fi
}

# Parse arguments
json_output=false
min_size="100M"
depth=2
top=10
aggressive=false
command=""
path=""

# Parse all arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        analyze|large-files|file-types|cleanup-report|version|help|--help|-h)
            command="$1"
            shift
            ;;
        --json)
            json_output=true
            shift
            ;;
        --min-size)
            min_size="$2"
            shift 2
            ;;
        --depth)
            depth="$2"
            shift 2
            ;;
        --top)
            top="$2"
            shift 2
            ;;
        --aggressive)
            aggressive=true
            shift
            ;;
        -*)
            echo "Error: Unknown option '$1'" >&2
            show_help
            exit 1
            ;;
        *)
            # Assume it's a path argument
            path="$1"
            shift
            ;;
    esac
done

if [[ -z "$command" ]]; then
    show_help
    exit 0
fi

case "$command" in
    analyze)
        if [[ -z "$path" ]]; then
            echo "Error: path required" >&2
            show_help
            exit 1
        fi
        analyze_directory "$path" "$depth" "$json_output"
        ;;
    large-files)
        if [[ -z "$path" ]]; then
            echo "Error: path required" >&2
            show_help
            exit 1
        fi
        find_large_files "$path" "$min_size" "$top" "$json_output"
        ;;
    file-types)
        if [[ -z "$path" ]]; then
            echo "Error: path required" >&2
            show_help
            exit 1
        fi
        analyze_file_types "$path" "$json_output"
        ;;
    cleanup-report)
        if [[ -z "$path" ]]; then
            echo "Error: path required" >&2
            show_help
            exit 1
        fi
        generate_cleanup_report "$path" "$aggressive" "$json_output"
        ;;
    version)
        show_version
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Error: Unknown command '$command'" >&2
        show_help
        exit 1
        ;;
esac