# sc-zig Auto-Release Plan

## Overview
Automated GitHub Actions workflow to build and release sc-zig binaries on tag push.

## Trigger
- **Pattern**: `v*-zig` (e.g., `v0.1.0-zig`, `v0.2.0-zig`)
- **Event**: Git tag push to master branch

## Workflow Steps

### 1. Checkout & Setup
- Checkout code at tag
- Setup Zig 0.16.0

### 2. Version Validation
- Extract version from tag (e.g., `v0.1.0-zig`)
- Validate format: `^v[0-9]+\.[0-9]+\.[0-9]+-zig$`
- Fail if tag format is incorrect

### 3. Update install.sh
- Automatically update `VERSION` in install.sh
- Ensures installer uses correct release version

### 4. Multi-Platform Build
Build for 4 platforms:
- `linux-amd64` (x86_64-linux)
- `linux-arm64` (aarch64-linux)
- `darwin-amd64` (x86_64-macos)
- `darwin-arm64` (aarch64-macos)

Build flags: `--release=small` (optimized for size)

### 5. Binary Verification
- Check all 4 binaries exist
- Verify binaries are not empty
- Fail if any binary is missing/corrupted

### 6. GitHub Release Creation
- Create release with tag name
- Upload 5 assets (4 binaries + install.sh)
- Auto-generate release notes
- Mark as official release (not draft/prerelease)

### 7. Release Summary
- Print success message with version info
- Confirm asset count

## Release Assets

| Asset | Platform | Architecture |
|-------|----------|--------------|
| sc-zig-linux-amd64 | Linux | x86_64 |
| sc-zig-linux-arm64 | Linux | ARM64 |
| sc-zig-darwin-amd64 | macOS | Intel |
| sc-zig-darwin-arm64 | macOS | Apple Silicon |
| install.sh | All | Installation script |

## Edge Cases & Rollback Strategy

### Build Failures
- **Issue**: Any platform build fails
- **Handling**: Workflow fails immediately, no release created
- **Recovery**: Fix code, create new tag

### Tag Format Validation
- **Issue**: Invalid tag format (e.g., `v0.1.0`, `v0.1.0-zig-beta`)
- **Handling**: Workflow fails with clear error message
- **Recovery**: Create properly formatted tag

### Binary Verification Failures
- **Issue**: Binary missing or empty after build
- **Handling**: Workflow fails before release creation
- **Recovery**: Investigate build issues, retry

### Release Already Exists
- **Issue**: Tag already has release
- **Handling**: GitHub Actions will fail with "Release already exists"
- **Recovery**: Delete existing release or use new tag

### Broken Release
- **Issue**: Release created but binaries are broken
- **Rollback**: 
  1. Delete the GitHub release
  2. Delete the git tag locally and remotely
  3. Fix the issue
  4. Create new tag for fix

```bash
# Rollback commands
gh release delete v0.1.0-zig
git tag -d v0.1.0-zig
git push origin :refs/tags/v0.1.0-zig
```

## Usage

### Creating a Release
```bash
# Make changes
git add .
git commit -m "feat: new feature"

# Create and push tag
git tag v0.1.1-zig
git push origin v0.1.1-zig

# GitHub Actions will automatically:
# 1. Build all 4 platforms
# 2. Update install.sh version
# 3. Create GitHub release
# 4. Upload all assets
```

### Testing the Workflow
To test without creating a real release:
1. Create a test branch
2. Push workflow changes
3. Create a test tag (e.g., `v0.1.1-zig-test`)
4. Monitor GitHub Actions
5. Delete test release if successful

## Benefits

### Before (Manual Process)
1. Run `build-release.sh` locally
2. Manually commit changes
3. Manually push to GitHub
4. Manually create GitHub release
5. Manually upload 5 assets
6. Update install.sh version manually

### After (Automated Process)
1. Make code changes
2. Create and push tag
3. GitHub Actions handles everything automatically

## Configuration Files

- **Workflow**: `.github/workflows/sc-zig-release.yml` (in main repo)
- **Build script**: `build-release.sh` (kept for local testing)
- **Installer**: `install.sh` (auto-updated by workflow)

## Future Enhancements

- Add checksums for binary verification
- Add automated changelog generation
- Add smoke tests in CI before release
- Add Windows support (if needed)
- Add release notes from git commits

## Rollback Procedure

If a release has critical issues:

1. **Immediate rollback**:
   ```bash
   gh release delete v0.1.1-zig
   git tag -d v0.1.1-zig
   git push origin :refs/tags/v0.1.1-zig
   ```

2. **Fix the issue**:
   ```bash
   # Make fixes
   git add .
   git commit -m "fix: critical issue"
   ```

3. **Create fix release**:
   ```bash
   git tag v0.1.2-zig
   git push origin v0.1.2-zig
   ```

## Monitoring

Monitor releases at:
- GitHub Actions: https://github.com/javimosch/supercli/actions
- Releases page: https://github.com/javimosch/supercli/releases

## Security

- Uses GitHub Actions `GITHUB_TOKEN` (automatically provided)
- No additional secrets required
- Zig version pinned to 0.16.0
- Uses official GitHub Actions from trusted sources