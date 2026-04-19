/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-module-internal',
      comment:
        'Módulo só pode importar de outro módulo via /api. domain/, db/, events/ são internos (ADR-001).',
      severity: 'error',
      from: { path: '^packages/modules/([^/]+)/' },
      to: {
        path: '^packages/modules/(?!\\1)([^/]+)/src/(domain|db|events|internal)',
        pathNot: '^packages/modules/([^/]+)/src/api',
      },
    },
    {
      name: 'no-direct-integration-adapter',
      comment:
        'Módulos devem importar a factory (index) — nunca mock/sandbox/production direto (ADR-004).',
      severity: 'error',
      from: { path: '^packages/modules/' },
      to: {
        path: '^packages/integrations/[^/]+/(mock|sandbox|production)\\.ts$',
      },
    },
    {
      name: 'no-anthropic-sdk',
      comment: 'Claude API é proibida no MVP (ADR-003).',
      severity: 'error',
      from: {},
      to: { path: '^@anthropic-ai/' },
    },
    {
      name: 'no-circular',
      comment: 'Ciclos entre módulos são proibidos.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      comment: 'Arquivos órfãos indicam código morto.',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.json$',
          '(^|/)next-env\\.d\\.ts$',
          'next\\.config\\.(ts|js|mjs)$',
          'postcss\\.config\\.(mjs|js)$',
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsConfig: { fileName: 'tsconfig.base.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'default'],
    },
    includeOnly: '^(apps|packages)/',
    exclude: {
      path: ['node_modules', 'dist', '\\.next', 'test(s)?'],
    },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/(?:@[^/]+/)?[^/]+' },
    },
  },
};
