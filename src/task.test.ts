import test from 'ava';

import { CORRECT } from './correctResult';
import { INPUT } from './input';
import { CategoryProvider, categoryTree } from './task';

const mockProvider: CategoryProvider = {
  getCategories: async () => ({ data: INPUT }),
};

test('categoryTree should properly sort categories and set correct orders', async (t) => {
  const result = await categoryTree(mockProvider);

  // Test top level sorting
  t.is(result[0].order, 2);

  // Test second level sorting
  const secondLevel = result[0].children;
  t.is(secondLevel[0].order, 1);
  t.is(secondLevel[1].order, 2);
  t.is(secondLevel[2].order, 3);
  t.is(secondLevel[3].order, 4);

  // Test complete output matches expected result
  t.deepEqual(result, CORRECT);
});

test('categoryTree should handle empty data', async (t) => {
  const emptyProvider: CategoryProvider = {
    getCategories: async () => ({ data: [] }),
  };

  const result = await categoryTree(emptyProvider);
  t.deepEqual(result, []);
});
