exports.up = function(knex) {
  return knex.schema.createTable('notas', (table) => {
    table.increments('id').primary();
    table.integer('estudiante_id').unsigned().notNullable()
      .references('id').inTable('estudiantes').onDelete('CASCADE');
    table.date('fecha').notNullable();
    table.decimal('tecnica', 3, 1).notNullable();
    table.decimal('tactica', 3, 1).notNullable();
    table.decimal('actitud', 3, 1).notNullable();
    table.enum('grupo', ['Infantil', 'Prejuvenil', 'Juvenil', 'Femenino']).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notas');
};