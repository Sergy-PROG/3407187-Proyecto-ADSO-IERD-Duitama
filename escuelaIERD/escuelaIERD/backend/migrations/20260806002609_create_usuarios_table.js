exports.up = function(knex) {
  return knex.schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.string('nombre', 120).notNullable();
    table.string('email', 120).notNullable().unique();
    table.string('password', 255).notNullable();
    table.enum('rol', ['admin', 'profesor', 'estudiante', 'padre']).notNullable();
    table.string('apodo', 60);
    table.string('telefono', 20);
    table.date('cumpleanos');
    table.string('foto', 255);
    table.string('hijo', 120);
    table.string('parentesco', 60);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuarios');
};