# Agent Instructions

## User Workflow

The user owns product decisions and approvals. Follow this workflow:

1. WE discuss requirements.
2. YOU present design.
3. I refine / approve.
4. YOU execute only the approved scope.
5. I review / approve.
6. I commit.
7. YOU document.

## Scope Rule

When the user defines a slice, implement only that slice.

Do not add placeholders, routes, APIs, generated-client exports, management pages, adjacent cleanup, refactors, or extra validation unless the user explicitly approves that scope.

If an out-of-scope issue is discovered while working, report it briefly and stop. Do not fix it without explicit approval.

Never assume something is done until the user approves it.

Never execute an action until the user approves it.

## Toolchain Rule

Never inspect, change, switch, source, install, upgrade, downgrade, or otherwise manage Node.js, npm, nvm, pnpm, yarn, or runtime/toolchain versions.

Forbidden examples:

- `node -v`
- `which node`
- `nvm use`
- `source ~/.nvm/nvm.sh`
- editing `.nvmrc`, `packageManager`, `engines`, shell profiles, or Node configuration
- requesting permissions to write build/toolchain output just to repair local verification

If lint, build, test, or another command fails because of Node/toolchain/environment state, report the exact failure and stop. Do not diagnose or repair the toolchain unless the user explicitly asks for that work.

## Git Rule

Never touch Git.

Forbidden examples:

- `git status`
- `git diff`
- `git add`
- `git commit`
- `git checkout`
- `git restore`
- `git reset`
- `git clean`
- changing branches
- staging or unstaging files
- editing Git metadata

The user owns all Git operations. If Git context would normally be useful, ask the user instead of running Git commands.
