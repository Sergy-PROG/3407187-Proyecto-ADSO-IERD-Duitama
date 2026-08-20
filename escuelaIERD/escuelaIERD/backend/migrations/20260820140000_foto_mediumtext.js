exports.up = async function(knex) {
  await knex.raw("ALTER TABLE usuarios MODIFY COLUMN foto MEDIUMTEXT");
  await knex.raw("ALTER TABLE estudiantes MODIFY COLUMN foto MEDIUMTEXT");
};

exports.down = async function(knex) {
  await knex.raw("ALTER TABLE usuarios MODIFY COLUMN foto VARCHAR(255)");
  await knex.raw("ALTER TABLE estudiantes MODIFY COLUMN foto VARCHAR(255)");
};
