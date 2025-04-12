#!/usr/bin/env bash
#----------------------------------------------------------------------------
#  img-optimize.sh  In-place image optimization script
#----------------------------------------------------------------------------
# Website:       https://virtubox.net
# GitHub:        https://github.com/VirtuBox/img-optimize
# Author:        VirtuBox (modified by you)
# License:       M.I.T
# ----------------------------------------------------------------------------
# This version optimizes only JPEG and PNG files in place.
# It does not convert files (thus preserving original file names)
# and uses quality settings tuned to reduce size while keeping quality high.
# ----------------------------------------------------------------------------

CSI='\033['
CEND="${CSI}0m"
CGREEN="${CSI}1;32m"
FIND_ARGS=""
PNG_ARGS=""
JPG_ARGS=""
IMG_PATH="."  # default: current directory

_help() {
    echo "Bash script to optimize your JPEG and PNG images in place."
    echo "Usage: img-optimize.sh [options] <images path>"
    echo "If images path isn't defined, the current directory is used."
    echo ""
    echo "  Options:"
    echo "       --jpg       optimize all jpg images"
    echo "       --png       optimize all png images"
    echo "       --std       optimize both png & jpg images"
    echo "       -i, --interactive    run in interactive mode"
    echo "       -q, --quiet  run optimization quietly"
    echo "       --path <images path>    define images path"
    echo "       --cmin [+|-]<n>  optimize files changed exactly/less/greater than n minutes ago"
    echo "       -h, --help, help      displays this help information"
    echo ""
    echo "Note: Conversion to other formats is disabled to ensure file names remain unchanged."
    echo ""
    return 0
}

##################################
# Parse script arguments
##################################

if [ "$#" -eq 0 ]; then
    _help
    exit 1
else
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --jpg)
                JPG_OPTIMIZATION="y"
                ;;
            --png)
                PNG_OPTIMIZATION="y"
                ;;
            --std)
                JPG_OPTIMIZATION="y"
                PNG_OPTIMIZATION="y"
                ;;
            -i|--interactive)
                INTERACTIVE_MODE="1"
                ;;
            -q|--quiet)
                PNG_ARGS=" -quiet"
                JPG_ARGS=" --quiet"
                ;;
            --cmin)
                if [ -n "$2" ]; then
                    FIND_ARGS="$2"
                    shift
                fi
                ;;
            --path)
                if [ -n "$2" ]; then
                    IMG_PATH="$2"
                    shift
                fi
                ;;
            -h|--help|help)
                _help
                exit 0
                ;;
            *)
                ;;
        esac
        shift
    done
fi

# If neither optimization flag was provided, default to optimizing both
if [ -z "$JPG_OPTIMIZATION" ] && [ -z "$PNG_OPTIMIZATION" ]; then
    JPG_OPTIMIZATION="y"
    PNG_OPTIMIZATION="y"
fi

##################################
# Prevent multi execution on same directory
##################################
lock=$(echo -n "$IMG_PATH" | md5sum | cut -d" " -f1)
if [ -f "/tmp/$lock" ]; then
    echo "The directory \"$IMG_PATH\" is already being processed."
    exit 1
else
    touch "/tmp/$lock"
fi

##################################
# Welcome
##################################
echo ""
echo "Welcome to img-optimize.sh – In-place image optimization."
echo "Optimizing JPEG and PNG files in: \"$IMG_PATH\""
echo ""

if [ "$INTERACTIVE_MODE" = "1" ]; then
    if [ -z "$IMG_PATH" ]; then
        echo "Enter the path of images you want to optimize (e.g., /var/www/images):"
        read -r IMG_PATH
    fi
    if [ -z "$JPG_OPTIMIZATION" ]; then
        echo ""
        echo "Do you want to optimize JPEG images in \"$IMG_PATH\"? (y/n)"
        while [[ "$JPG_OPTIMIZATION" != "y" && "$JPG_OPTIMIZATION" != "n" ]]; do
            read -r -p "Select an option [y/n]: " JPG_OPTIMIZATION
        done
    fi
    if [ -z "$PNG_OPTIMIZATION" ]; then
        echo ""
        echo "Do you want to optimize PNG images in \"$IMG_PATH\"? (y/n)"
        while [[ "$PNG_OPTIMIZATION" != "y" && "$PNG_OPTIMIZATION" != "n" ]]; do
            read -r -p "Select an option [y/n]: " PNG_OPTIMIZATION
        done
    fi
fi

##################################
# Optimize JPEG images
##################################
if [ "$JPG_OPTIMIZATION" = "y" ]; then
    if [ -z "$(command -v jpegoptim)" ]; then
        echo "Error: jpegoptim is not installed."
        rm "/tmp/$lock"
        exit 1
    fi
    echo -ne 'Optimizing JPEG images...                   [..]\r'
    cd "$IMG_PATH" || exit 1
    if [ -n "$FIND_ARGS" ]; then
        find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -cmin "$FIND_ARGS" -print0 | \
            xargs -r -0 jpegoptim $JPG_ARGS -p --all-progressive -m90 --strip-all
    else
        find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0 | \
            xargs -r -0 jpegoptim $JPG_ARGS -p --all-progressive -m90 --strip-all
    fi
    echo -ne "Optimizing JPEG images...                   [${CGREEN}OK${CEND}]\r"
    echo ""
fi

##################################
# Optimize PNG images
##################################
if [ "$PNG_OPTIMIZATION" = "y" ]; then
    if [ -z "$(command -v optipng)" ]; then
        echo "Error: optipng is not installed."
        rm "/tmp/$lock"
        exit 1
    fi
    echo -ne 'Optimizing PNG images...                    [..]\r'
    cd "$IMG_PATH" || (rm "/tmp/$lock" && exit 1)
    if [ -n "$FIND_ARGS" ]; then
        find . -type f -iname "*.png" -cmin "$FIND_ARGS" -print0 | \
            xargs -r -0 optipng $PNG_ARGS -o5 -strip all
    else
        find . -type f -iname "*.png" -print0 | \
            xargs -r -0 optipng $PNG_ARGS -o5 -strip all
    fi
    echo -ne "Optimizing PNG images...                    [${CGREEN}OK${CEND}]\r"
    echo ""
fi

##################################
# Finished processing
##################################
echo ""
echo -e "${CGREEN}Image optimization completed successfully!${CEND}"
echo ""

# Free the lock
rm "/tmp/$lock"
