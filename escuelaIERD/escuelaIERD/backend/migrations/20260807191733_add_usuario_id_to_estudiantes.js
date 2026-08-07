exports.up = function(knex) {
  return knex.schema.alterTable('estudiantes', (table) => {
    table.integer('usuario_id').unsigned().nullable()
      .references('id').inTable('usuarios').onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('estudiantes', (table) => {
    table.dropColumn('usuario_id');
  });
};