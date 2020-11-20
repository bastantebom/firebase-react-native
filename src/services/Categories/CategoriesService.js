import BaseAPI from '@/services/BaseAPI'

const createCategory = categoryName => {
  return BaseAPI({
    url: `/categories`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { category: categoryName },
  })
}

const getCategories = async () => {
  let response = await BaseAPI({
    url: `/categories`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { data, message } = response

  return data
}

const editCategory = (id, newName) => {
  return BaseAPI({
    url: `/categories/${id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { category: newName },
  })
}

const deleteCategory = id => {
  return BaseAPI({
    url: `/categories/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const CategoryService = {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
}

export default CategoryService
