exports.up = function(knex) {
  return knex.schema.alterTable('estudiantes', (table) => {
    table.text('logros').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('estudiantes', (table) => {
    table.dropColumn('logros');
  });
};
