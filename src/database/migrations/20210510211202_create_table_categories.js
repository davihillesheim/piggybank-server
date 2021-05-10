
exports.up = knex => knex.schema.createTable('categories', table => {
  table.increments('category_id').primary();
  table.string('name');
  table.string('icon');
});


exports.down = knex => knex.schema.dropTable('categories');
