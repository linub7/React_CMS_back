import Category from '../models/category';

export const addCategory = async (req, res) => {
  try {
    const {
      body: { name },
    } = req;

    const existCategory = await Category.findOne({ name: name.toLowerCase() });
    if (existCategory) {
      return res.status(400).json({
        error: 'Category already exist',
      });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    return res.json({ category: newCategory });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return res.json({ categories });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const {
      params: { categoryId },
    } = req;
    const existCategory = await Category.findById(categoryId);
    if (!existCategory) {
      return res.status(404).json({
        error: 'Category does not exist',
      });
    }

    await Category.findByIdAndDelete(categoryId);
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const {
      params: { categoryId },
      body: { name },
    } = req;
    console.log(name);

    const existCategory = await Category.findById(categoryId);
    if (!existCategory) {
      return res.status(404).json({
        error: 'Category does not exist',
      });
    }
    const newCategory = await Category.findOneAndUpdate(
      { _id: categoryId },
      { name: name.toLowerCase() },
      { new: true }
    );
    return res.json({ category: newCategory });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
