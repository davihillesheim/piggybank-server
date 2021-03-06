const knex = require('../database/connection');


module.exports = {
  async createTransaction(request, response) {
    const {
      user_id,
      category_id,
      amount,
      date
    } = request.body;

    const trx = await knex.transaction();
    const transaction = {
      user_id,
      category_id,
      amount,
      date
    }

    const id = await trx('expenses').insert(transaction).returning('expense_id');
    const expense_id = id[0];

    const category = await trx('categories').select('*').where('category_id', '=', category_id);
    const name = category[0].name;

    await trx.commit();

    return response.json({
      id: expense_id,
      amount: amount,
      date: date,
      name: name,
      category_id: category_id
    })
  },

  async deleteTransaction(request, response) {
    const { expense_id } = request.body;

    const deletedTransaction = await knex('expenses').select('*').where('expense_id', '=', expense_id).del();

    return response.json({
      expense_id
    })
  },

  async userTransactions(request, response) {
    const {
      user_id,
    } = request.body;

    // selects all the user transactions in the time constraint
    const transactionList = await knex('expenses')
      .select('*')
      .where('user_id', user_id)

    // for each transaction, get their respective category
    const serializedTransactions = await Promise.all(transactionList.map(async transaction => {

      const category = await knex('categories')
        .join('expenses', 'categories.category_id', '=', transaction.category_id)
        .select('*')
        .first();

      return {
        id: transaction.expense_id,
        amount: transaction.amount,
        date: transaction.date,
        name: category.name,
        category_id: transaction.category_id,
      }
    }));

    return response.json(serializedTransactions);
  }
};
