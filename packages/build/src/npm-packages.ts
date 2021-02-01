import * as spawn from 'cross-spawn';
import path from 'path';

const PLACEHOLDER_VERSION = '0.0.0-dev.0';
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const LERNA_BIN = path.resolve(PROJECT_ROOT, 'node_modules', '.bin', 'lerna');

export function bumpNpmPackages(version: string): void {
  if (!version || version === PLACEHOLDER_VERSION) {
    console.info('mongosh: Not bumping package version, keeping at placeholder');
    return;
  }

  console.info(`mongosh: Bumping package versions to ${version}`);
  spawn.sync(LERNA_BIN, [
    'version',
    version,
    '--no-changelog',
    '--no-push',
    '--exact',
    '--no-git-tag-version',
    '--force-publish',
    '--yes'
  ], {
    stdio: 'inherit',
    cwd: PROJECT_ROOT
  });
}

export function publishNpmPackages(): void {
  const packages = listNpmPackages();

  const versions = Array.from(new Set(packages.map(({ version }) => version)));

  if (versions.length !== 1) {
    throw new Error(`Refusing to publish packages with multiple versions: ${versions}`);
  }

  if (versions[0] === PLACEHOLDER_VERSION) {
    throw new Error('Refusing to publish packages with placeholder version');
  }

  spawn.sync(LERNA_BIN, [
    'publish',
    'from-package',
    '--no-changelog',
    '--no-push',
    '--exact',
    '--no-git-tag-version',
    '--force-publish',
    '--yes'
  ], {
    stdio: 'inherit',
    cwd: PROJECT_ROOT
  });
}

export function listNpmPackages(): {name: string; version: string}[] {
  const lernaListOutput = spawn.sync(
    LERNA_BIN, [
      'list',
      '--json',
    ],
    {
      cwd: PROJECT_ROOT,
      encoding: 'utf8'
    }
  );

  return JSON.parse(lernaListOutput.stdout);
}