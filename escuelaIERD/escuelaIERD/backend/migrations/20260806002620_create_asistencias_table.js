exports.up = function(knex) {
  return knex.schema.createTable('asistencias', (table) => {
    table.increments('id').primary();
    table.integer('estudiante_id').unsigned().notNullable()
      .references('id').inTable('estudiantes').onDelete('CASCADE');
    table.date('fecha').notNullable();
    table.enum('estado', ['Presente', 'Ausente', 'Justificado']).notNullable();
    table.enum('grupo', ['Infantil', 'Prejuvenil', 'Juvenil', 'Femenino']).notNullable();
    table.timestamps(true, true);
    table.unique(['estudiante_id', 'fecha']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('asistencias');
};