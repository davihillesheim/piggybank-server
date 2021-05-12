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

    await trx('expenses').insert(transaction);

    await trx.commit();

    return response.json({
      user_id,
      category_id,
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
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        name: category.name,
        icon: category.icon
      }
    }));

    return response.json(serializedTransactions);
  }
};
