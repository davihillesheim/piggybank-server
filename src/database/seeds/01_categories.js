
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        {name: 'Home', icon: 'home.svg'},
        {name: 'Food', icon: 'food.svg'},
        {name: 'Car', icon: 'car.svg'},
        {name: 'Groceries', icon: 'groceries.svg'},
        {name: 'Clothes', icon: 'clothes.svg'},
        {name: 'Health', icon: 'health.svg'},
        {name: 'Social', icon: 'social.svg'},
        {name: 'Travel', icon: 'travel.svg'},
        {name: 'Transportation', icon: 'transportation.svg'},
        {name: 'Bills', icon: 'bills.svg'},
        {name: 'Education', icon: 'education.svg'},
        {name: 'Others', icon: 'others.svg'},
      ]);
    });
};
