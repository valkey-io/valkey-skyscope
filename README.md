# Valkey Skyscope

## Getting Started (Development)

### Start Valkey Cluster

1. From the root directory, run `tools/valkey-cluster/scripts/build_run_cluster.sh`.
    1. This will build and run the cluster.
    2. Master hostname will be `localhost`.
    3. Master nodes ports will be `7001` - `7003`.

### Running the apps

1. Install all dependencies from the project root: `npm ci`
2. Run both server and frontend: `npm run dev`

## IDE Setup

### VSCode

The repository includes settings for the ESLint extension. Please install it.

**Note:** If you have a formatter i.e. Prettier, it could interfere with the ESLint extension. Please disable it from the workspace.

This requires ESLint v9.0.0 and above.

## Create DMG
In the root directory, create a DMG by running `npm run package:mac`.
**Note:** The DMG is not signed. Distributing it will lead to a `"Skyscope" is damaged and can't be opened` error when running the application. To bypass this, run `xattr -c <path/to/app>` in terminal to disable the quarantine flag.

TEST_PUSH