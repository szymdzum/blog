#!/bin/bash

# ===============================================
# NEW BLOG POST GENERATOR
# ===============================================
# Creates a new blog post from template with
# automatic date/slug generation and validation

set -e  # Exit on any error

# Configuration
TEMPLATE_FILE="src/content/blog/post-template.mdx"
BLOG_DIR="src/content/blog"
CURRENT_DATE=$(date +"%b %d %Y")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to generate slug from title
generate_slug() {
    local title="$1"
    echo "$title" | \
        tr '[:upper:]' '[:lower:]' | \
        sed 's/[^a-z0-9 -]//g' | \
        sed 's/[ ]\+/-/g' | \
        sed 's/^-\+\|-\+$//g'
}

# Function to validate slug
validate_slug() {
    local slug="$1"

    if [[ ! "$slug" =~ ^[a-z0-9-]+$ ]]; then
        print_error "Invalid slug format. Use only lowercase letters, numbers, and hyphens."
        return 1
    fi

    if [[ ${#slug} -lt 3 ]]; then
        print_error "Slug too short. Minimum 3 characters required."
        return 1
    fi

    if [[ ${#slug} -gt 60 ]]; then
        print_error "Slug too long. Maximum 60 characters recommended for SEO."
        return 1
    fi

    return 0
}

# Function to check if file exists
check_file_exists() {
    local filepath="$1"
    if [[ -f "$filepath" ]]; then
        print_error "File already exists: $filepath"
        read -p "Overwrite? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Operation cancelled."
            exit 0
        fi
    fi
}

# Function to create post from template
create_post() {
    local title="$1"
    local slug="$2"
    local category="$3"
    local description="$4"
    local filepath="$BLOG_DIR/$slug.mdx"

    # Copy template
    cp "$TEMPLATE_FILE" "$filepath"

    # Replace template placeholders
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|title: 'Your Compelling Post Title Here'|title: '$title'|g" "$filepath"
        sed -i '' "s|description: 'Write an engaging SEO description.*'|description: '$description'|g" "$filepath"
        sed -i '' "s|pubDate: 'Jan 18 2025'|pubDate: '$CURRENT_DATE'|g" "$filepath"
        sed -i '' "s|category: 'tutorial'|category: '$category'|g" "$filepath"
        sed -i '' "s|draft: true|draft: true|g" "$filepath"
    else
        # Linux
        sed -i "s|title: 'Your Compelling Post Title Here'|title: '$title'|g" "$filepath"
        sed -i "s|description: 'Write an engaging SEO description.*'|description: '$description'|g" "$filepath"
        sed -i "s|pubDate: 'Jan 18 2025'|pubDate: '$CURRENT_DATE'|g" "$filepath"
        sed -i "s|category: 'tutorial'|category: '$category'|g" "$filepath"
        sed -i "s|draft: true|draft: true|g" "$filepath"
    fi

    print_success "Created: $filepath"
    return 0
}

# Function to open file in editor
open_in_editor() {
    local filepath="$1"

    # Try to detect available editors
    if command -v code > /dev/null; then
        print_info "Opening in VS Code..."
        code "$filepath"
    elif command -v vim > /dev/null; then
        print_info "Opening in Vim..."
        vim "$filepath"
    elif command -v nano > /dev/null; then
        print_info "Opening in nano..."
        nano "$filepath"
    else
        print_warning "No editor detected. File created at: $filepath"
    fi
}

# Main script
main() {
    cd "$PROJECT_ROOT"

    print_info "Blog Post Generator for Kumak's Blog"
    echo "======================================"

    # Check if template exists
    if [[ ! -f "$TEMPLATE_FILE" ]]; then
        print_error "Template file not found: $TEMPLATE_FILE"
        print_info "Run this script from the project root directory."
        exit 1
    fi

    # Get post title
    if [[ -n "$1" ]]; then
        title="$1"
    else
        read -p "📝 Post title: " title
    fi

    if [[ -z "$title" ]]; then
        print_error "Post title is required."
        exit 1
    fi

    # Generate and validate slug
    suggested_slug=$(generate_slug "$title")

    if [[ -n "$2" ]]; then
        slug="$2"
    else
        read -p "🔗 URL slug [$suggested_slug]: " slug
        slug=${slug:-$suggested_slug}
    fi

    if ! validate_slug "$slug"; then
        exit 1
    fi

    # Get category
    echo "📂 Available categories:"
    echo "   1) tutorial    - Step-by-step guides and how-tos"
    echo "   2) opinion     - Personal thoughts and industry commentary"
    echo "   3) project     - Project showcases and case studies"
    echo "   4) philosophy  - High-level thinking and principles"

    if [[ -n "$3" ]]; then
        case "$3" in
            1|tutorial) category="tutorial" ;;
            2|opinion) category="opinion" ;;
            3|project) category="project" ;;
            4|philosophy) category="philosophy" ;;
            *) print_error "Invalid category: $3"; exit 1 ;;
        esac
    else
        read -p "Select category (1-4): " cat_choice
        case "$cat_choice" in
            1) category="tutorial" ;;
            2) category="opinion" ;;
            3) category="project" ;;
            4) category="philosophy" ;;
            *) print_error "Invalid category selection."; exit 1 ;;
        esac
    fi

    # Get description
    if [[ -n "$4" ]]; then
        description="$4"
    else
        read -p "📄 SEO description (120-160 chars): " description
    fi

    if [[ -z "$description" ]]; then
        print_warning "No description provided. Remember to add one for better SEO."
        description="Add your SEO description here (120-160 characters recommended)"
    fi

    # Validate description length
    desc_length=${#description}
    if [[ $desc_length -gt 160 ]]; then
        print_warning "Description is $desc_length characters (over 160). Consider shortening for SEO."
    fi

    # Create post
    filepath="$BLOG_DIR/$slug.mdx"
    check_file_exists "$filepath"

    print_info "Creating post..."
    create_post "$title" "$slug" "$category" "$description"

    # Summary
    echo ""
    print_success "Post created successfully!"
    echo "=========================="
    echo "📝 Title: $title"
    echo "🔗 Slug: $slug"
    echo "📂 Category: $category"
    echo "📄 File: $filepath"
    echo "🌐 URL: http://localhost:4321/blog/$slug"
    echo ""

    # Next steps
    print_info "Next steps:"
    echo "1. Edit the content in: $filepath"
    echo "2. Set draft: false when ready to publish"
    echo "3. Run: deno task dev (to preview)"
    echo "4. Run: deno task check-all (to validate)"
    echo ""

    # Ask to open in editor
    read -p "Open in editor? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        open_in_editor "$filepath"
    fi
}

# Show help
show_help() {
    echo "Blog Post Generator"
    echo "=================="
    echo ""
    echo "Usage:"
    echo "  $0                              # Interactive mode"
    echo "  $0 'Post Title'                 # With title"
    echo "  $0 'Post Title' slug            # With title and slug"
    echo "  $0 'Post Title' slug 1          # With title, slug, and category"
    echo "  $0 'Post Title' slug 1 'Desc'   # All parameters"
    echo ""
    echo "Categories:"
    echo "  1 = tutorial    3 = project"
    echo "  2 = opinion     4 = philosophy"
    echo ""
    echo "Examples:"
    echo "  $0 'Getting Started with Astro'"
    echo "  $0 'My Thoughts on Web Dev' custom-slug 2"
    echo ""
}

# Check for help flag
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Run main function
main "$@"