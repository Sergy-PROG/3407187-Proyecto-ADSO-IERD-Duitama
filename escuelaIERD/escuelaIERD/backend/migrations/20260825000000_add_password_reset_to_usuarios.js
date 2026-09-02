exports.up = function(knex) {
  return knex.schema.alterTable('usuarios', (table) => {
    // Se guarda el HASH (sha256) del token de restablecimiento, nunca el token
    // "en crudo" que recibe el usuario -- mismo principio que con la contraseña.
    table.string('reset_password_token', 255).nullable();
    table.dateTime('reset_password_expires').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('usuarios', (table) => {
    table.dropColumn('reset_password_token');
    table.dropColumn('reset_password_expires');
  });
};