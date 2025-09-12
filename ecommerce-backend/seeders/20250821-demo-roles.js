export async function up(queryInterface) {
  const now = new Date();
  await queryInterface.bulkInsert('roles', [
    { codigo: 'CLI', descripcion: 'Cliente', createdAt: now, updatedAt: now },
    { codigo: 'ADM', descripcion: 'Administrador', createdAt: now, updatedAt: now }
  ], {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('roles', null, {});
}

