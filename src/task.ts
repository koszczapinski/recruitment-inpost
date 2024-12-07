interface CategorySource {
  id: number;
  name: string;
  Title: string;
  MetaTagDescription: string;
  children: CategorySource[];
}

export interface CategoryProvider {
  getCategories(): Promise<{ data: CategorySource[] }>;
}

interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

const extractOrder = (
  title: string | undefined,
  defaultValue: number
): number => {
  if (!title) return defaultValue;

  const orderStr = title.includes('#') ? title.split('#')[0] : title;
  const order = parseInt(orderStr);
  return isNaN(order) ? defaultValue : order;
};

const mapCategory = (
  source: CategorySource,
  level: number
): CategoryListElement => {
  const order = extractOrder(source.Title, source.id);

  const children =
    source.children?.map((child) => mapCategory(child, level + 1)) || [];

  if (children.length > 0) {
    children.sort((a, b) => a.order - b.order);
  }

  return {
    id: source.id,
    name: source.name,
    image: source.MetaTagDescription,
    order,
    children,
    showOnHome: false,
  };
};

const determineHomeVisibility = (
  categories: CategoryListElement[],
  markedIds: number[]
): void => {
  if (categories.length <= 5) {
    categories.forEach((cat) => (cat.showOnHome = true));
  } else if (markedIds.length > 0) {
    categories.forEach((cat) => (cat.showOnHome = markedIds.includes(cat.id)));
  } else {
    categories.forEach((cat, index) => (cat.showOnHome = index < 3));
  }
};

export const categoryTree = async (
  provider: CategoryProvider
): Promise<CategoryListElement[]> => {
  const res = await provider.getCategories();

  if (!res.data) {
    return [];
  }

  const markedForHome: number[] = [];

  // Extract IDs marked for home display
  res.data.forEach((category) => {
    if (category.Title?.includes('#')) {
      markedForHome.push(category.id);
    }
  });

  // Map and transform categories
  const result = res.data.map((category) => mapCategory(category, 1));

  // Sort top level categories
  result.sort((a, b) => a.order - b.order);

  // Set home visibility
  determineHomeVisibility(result, markedForHome);

  return result;
};
