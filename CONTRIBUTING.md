# Contributing to Kumak's Blog

Thank you for your interest in contributing! This document outlines the development workflow and best practices for this project.

## Development Setup

### Prerequisites
- [Deno](https://deno.com/) (latest stable version)
- [Git](https://git-scm.com/)
- [GitHub CLI](https://cli.github.com/) (optional but recommended)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/szymdzum/blog.git
   cd blog
   ```

2. **Start development server**
   ```bash
   deno task dev
   ```

3. **Run tests and checks**
   ```bash
   deno task test
   deno task check-all
   ```

## Git Workflow

This project uses a simple Git workflow with feature branches.

### Branch Strategy

- **`main`** - Production branch, always deployable
- **`feature/xyz`** - Feature branches for new work
- **`fix/xyz`** - Bug fix branches
- **`docs/xyz`** - Documentation updates

### Working with Feature Branches

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit**
   ```bash
   # Stage your changes
   git add .
   
   # Commit with a descriptive message
   git commit -m "feat: add your feature description"
   ```

3. **Push your feature branch**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Process

1. **Run all checks before creating PR**
   ```bash
   deno task check-all
   deno task test
   deno task build
   ```

2. **Create a Pull Request**
   ```bash
   gh pr create --title "feat: your feature title" --body "Description of your changes"
   ```

3. **Address review feedback**
   - Make changes and add commits to your feature branch
   - Push updates to your branch

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:
```bash
feat: add dark mode toggle
fix: resolve mobile navigation overflow
docs: update deployment instructions
style: format code with prettier
refactor: extract header component
test: add unit tests for date utilities
chore: update dependencies
```

## Code Quality

### Before Committing
Always run these checks:

```bash
# Format code
deno task format

# Lint code
deno task lint

# Run tests
deno task test

# Run all checks
deno task check-all
```

### Code Style
- Use TypeScript for all new code
- Follow the existing code style (configured in `deno.json`)
- Write self-documenting code with clear variable names
- Add comments for complex logic

### Testing
- Write tests for new features
- Update tests when modifying existing code
- Ensure all tests pass before submitting PR

## Deployment

The project uses GitHub Actions for CI/CD:

- **On push to `main`**: Automatic deployment to Deno Deploy
- **On PR**: Runs tests and build checks
- **Security**: Dependabot updates dependencies automatically

## Development Tips

### Useful Commands
```bash
# Start development with file watching
deno task dev

# Build and preview production build
deno task build && deno task preview

# Run specific test file
deno test tests/specific-test.ts

# Format specific files
deno fmt src/components/Header.astro

# Check TypeScript without running
deno run -A npm:astro check
```

### Debugging
- Use browser dev tools for client-side debugging
- Use `console.log()` for server-side debugging during development
- Check the build output in `dist/` folder after `deno task build`

## Getting Help

- Check the [Astro documentation](https://docs.astro.build)
- Review [Deno documentation](https://docs.deno.com)
- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas

## Project Structure Notes

- **Components**: Keep them small and focused
- **Styles**: Use CSS custom properties for theming
- **Content**: Follow the frontmatter schema in `src/content/config.ts`
- **Utils**: Write pure functions when possible

---

**Remember**: Keep commits small and focused, rebase regularly, and maintain a clean history. Quality over quantity!