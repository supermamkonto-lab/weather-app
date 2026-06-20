# Contributing to Weather App

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
npm install
npm start
```

## Code Style

- **TypeScript** - All code must be type-safe
- **Prettier** - Auto-format on save
- **ESLint** - Code quality checks

```bash
npm run lint
npm run format
```

## Testing

Write tests for new features:

```bash
npm test
npx tsc --noEmit
```

## Commit Convention

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(weather): add hourly rain forecast

Implements 6-hour rainfall prediction with percentage visualization.

Fixes #123
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Commit with conventional messages
7. Push to your fork
8. Open a Pull Request

## PR Checklist

- [ ] Tests pass
- [ ] TypeScript strict mode passes
- [ ] No console errors/warnings
- [ ] Follows code style
- [ ] Updated documentation if needed

## Reporting Issues

Use GitHub Issues for:
- Bug reports
- Feature requests
- Questions

Please include:
- Device/OS information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

Thank you for contributing! 🎉
