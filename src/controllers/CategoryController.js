const knex =  require('../database/connection');

module.exports = {
  async categoryIndex (req, res) {
    const categories = await knex('categories').select('*');

    const serializedCategories = categories.map(category => {
      return {
        id: category.category_id,
        name: category.name,
        icon_url: `http://localhost:3001/uploads/${category.icon}`,
      }
    })

    return res.json(serializedCategories);
  }
};
