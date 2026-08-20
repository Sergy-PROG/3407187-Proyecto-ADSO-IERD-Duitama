exports.up = async function(knex) {
  // Quita la restricción UNIQUE sobre email por sí solo...
  await knex.schema.alterTable('usuarios', (table) => {
    table.dropUnique(['email']);
  });
  // ...y la reemplaza por una restricción compuesta (email + rol),
  // para permitir que un padre y su hijo/a compartan el mismo correo
  // (el padre inicia sesión con su contraseña, el estudiante con el
  // documento de identidad como contraseña), sin permitir dos cuentas
  // duplicadas del MISMO rol con el MISMO correo.
  await knex.schema.alterTable('usuarios', (table) => {
    table.unique(['email', 'rol']);
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('usuarios', (table) => {
    table.dropUnique(['email', 'rol']);
  });
  await knex.schema.alterTable('usuarios', (table) => {
    table.unique(['email']);
  });
};