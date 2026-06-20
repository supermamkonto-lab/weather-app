# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |
| < 1.0   | ❌ No     |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead:

1. Email: security@weather-app-example.com (or contact the maintainer)
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

3. Allow 48 hours for initial response
4. We will work with you to understand and resolve the issue

## Security Considerations

### API Usage
- All API calls use HTTPS
- No sensitive credentials are stored in code
- Use `.env.example` for configuration template
- No API keys hardcoded in source

### Data Storage
- Local data stored in AsyncStorage (encrypted on device)
- No personal data transmitted
- Cache auto-clears if stale

### Permissions
- Only required Android permissions requested
- Location services optional (user-initiated)
- All permissions explained to user

## Best Practices for Users

1. Keep your app updated
2. Review permissions before granting
3. Report suspicious behavior
4. Use device security features

## Dependency Security

- Regularly updated dependencies
- Uses npm audit to check for vulnerabilities
- Monthly security reviews planned

## Contact

For security concerns: Please open a private security advisory on GitHub
