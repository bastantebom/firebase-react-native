let categories = [
  {
    name: 'burgers',
    id: 1,
  },
  {
    name: 'drinks',
    id: 2,
  },
];

const createCategory = (payload) => {
  return [...categories, payload];
};

const getCategories = (payload) => {
  return categories;
};

const editCategory = (id, newName) => {
  return console.log(`edit id ${id} to ${newName}`);
};

const CategoryService = {
  getCategories,
  createCategory,
  editCategory
};

export default CategoryService;
