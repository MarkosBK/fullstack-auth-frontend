import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:4000/api-json', // URL of your Swagger JSON
    },
    output: {
      target: './lib/api/generated', // Folder for generated files
      schemas: './lib/api/generated/schemas',
      client: 'react-query', // This is correct - Orval uses the old name
      mode: 'tags-split',
      namingConvention: 'camelCase',
      override: {
        mutator: {
          path: './lib/api/mutator.ts', // Custom client (your axios)
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useMutation: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
