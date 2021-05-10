
exports.up = knex => knex.schema.createTable('users', table => {
    table.increments('account_id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.decimal('budget').defaultTo(0);
  });


exports.down = knex => knex.schema.dropTable('users');
