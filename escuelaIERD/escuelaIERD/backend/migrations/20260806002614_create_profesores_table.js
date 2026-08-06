exports.up = function(knex) {
  return knex.schema.createTable('profesores', (table) => {
    table.increments('id').primary();
    table.string('nombre', 120).notNullable();
    table.string('email', 120).notNullable().unique();
    table.string('especialidad', 120);
    table.string('foto', 255);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('profesores');
};