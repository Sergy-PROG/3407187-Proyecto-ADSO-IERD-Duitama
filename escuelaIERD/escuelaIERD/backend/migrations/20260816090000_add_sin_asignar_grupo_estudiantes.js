exports.up = async function(knex) {
  await knex.raw(
    "ALTER TABLE estudiantes MODIFY COLUMN grupo ENUM('Infantil','Prejuvenil','Juvenil','Femenino','Sin asignar') NOT NULL"
  );
};

exports.down = async function(knex) {
  // Antes de revertir el ENUM, reasigna cualquier estudiante pendiente
  // a 'Infantil' para evitar dejar datos que ya no encajen en el ENUM viejo.
  await knex('estudiantes').where({ grupo: 'Sin asignar' }).update({ grupo: 'Infantil' });
  await knex.raw(
    "ALTER TABLE estudiantes MODIFY COLUMN grupo ENUM('Infantil','Prejuvenil','Juvenil','Femenino') NOT NULL"
  );
};