
exports.up = knex => knex.schema.createTable('expenses', table => {
  table.increments('expense_id').primary();
  table.integer('user_id').notNullable();
  table.integer('category_id').notNullable();
  table.decimal('amount').notNullable();
  table.date('date').notNullable();
});


exports.down = knex => knex.schema.dropTable('expenses');
