exports.up = function(knex) {
  return knex.schema.createTable('pagos', (table) => {
    table.increments('id').primary();
    table.integer('estudiante_id').unsigned().notNullable()
      .references('id').inTable('estudiantes').onDelete('CASCADE');
    table.string('concepto', 120).notNullable();
    table.decimal('monto', 10, 2).notNullable();
    table.enum('estado', ['Pagado', 'Pendiente']).defaultTo('Pendiente');
    table.date('fecha').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pagos');
};