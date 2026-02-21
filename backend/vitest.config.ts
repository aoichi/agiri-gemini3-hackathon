import { join } from 'node:path';
import { defaultServerConditions } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, type TestProjectConfiguration } from 'vitest/config';

const appDir = join(__dirname, '.');

const resolveConditions = [
  '@growthverse/development',
  ...defaultServerConditions,
] satisfies string[];

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [tsconfigPaths()],
        ssr: {
          resolve: {
            // サーバー側でconditionsを適用する場合はここに指定する必要がある
            conditions: resolveConditions,
          },
        },
        test: {
          root: appDir,
          typecheck: {
            tsconfig: join(appDir, 'tsconfig.json'),
          },
          include: [join(appDir, '**/*.spec.ts'), join(appDir, '**/*.test.ts')],
          environment: 'node',
          clearMocks: true,
        },
      } satisfies TestProjectConfiguration,
    ],
  },
});
