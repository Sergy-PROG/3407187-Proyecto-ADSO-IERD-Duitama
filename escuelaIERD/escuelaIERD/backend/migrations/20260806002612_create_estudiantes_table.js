exports.up = function(knex) {
  return knex.schema.createTable('estudiantes', (table) => {
    table.increments('id').primary();
    table.string('nombre', 120).notNullable();
    table.string('documento', 30).notNullable().unique();
    table.enum('grupo', ['Infantil', 'Prejuvenil', 'Juvenil', 'Femenino']).notNullable();
    table.string('acudiente', 120);
    table.enum('estado', ['Activo', 'Inactivo']).defaultTo('Activo');
    table.string('foto', 255);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('estudiantes');
};