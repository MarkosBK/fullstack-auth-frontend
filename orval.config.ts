import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:4000/api-json', // URL вашего Swagger JSON
    },
    output: {
      target: './lib/api/generated', // Папка для сгенерированных файлов
      schemas: './lib/api/generated/schemas',
      client: 'react-query', // Это правильно - Orval использует старое название
      mode: 'tags-split',
      namingConvention: 'camelCase',
      override: {
        mutator: {
          path: './lib/api/mutator.ts', // Кастомный клиент (ваш axios)
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
