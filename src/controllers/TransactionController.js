const knex = require('../database/connection');


module.exports = {
  async createTransaction(request, response) {
    const {
      user_id,
      category_id,
      amount,
      description,
      date
    } = request.body;

    const trx = await knex.transaction();
    const transaction = {
      user_id,
      category_id,
      amount,
      description,
      date
    }

    const id = await trx('expenses').insert(transaction).returning('expense_id');
    const expense_id = id[0];

    const category = await trx('categories').select('*').where('category_id', '=', category_id);
    const name = category[0].name;

    await trx.commit();

    return response.json({
      expense_id,
      user_id,
      category_id,
      name,
      amount,
      description,
      date})
  },

  async userTransactions(request, response) {
    const {
      user_id,
      not_before,
      not_after
    } = request.body;

    // selects all the user transactions in the time constraint
    const transactionList = await knex('expenses')
                                  .select('*')
                                  .where('user_id', user_id)
                                  .where('date', '>=', not_before)
                                  .where('date', '<', not_after);

    // for each transaction, get their respective category
    const serializedTransactions = await Promise.all(transactionList.map(async transaction => {

      const category = await knex('categories')
                                .join('expenses', 'categories.category_id', '=', transaction.category_id)
                                .select('*')
                                .first();

      return {
        id: transaction.expense_id,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        name: category.name,
        category_id: transaction.category_id,
      }
    }));

    return response.json(serializedTransactions);
  }
};
