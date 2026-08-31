import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses Seeding Database SDN 2 Tegalsari Kepanjen...');

  // DevSecOps Salt Rounds: 12 (Strong hashing resistance against brute-force)
  const saltRounds = 12;
  const adminPasswordHash = await bcrypt.hash('AdminSecure2026!', saltRounds);
  const teacherPasswordHash = await bcrypt.hash('GuruSecure2026!', saltRounds);
  const studentPasswordHash = await bcrypt.hash('SiswaSecure2026!', saltRounds);

  // 1. Seed Default Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sdn2tegalsari.sch.id' },
    update: {},
    create: {
      name: 'Administrator Utama',
      email: 'admin@sdn2tegalsari.sch.id',
      password_hash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Default Admin user siap: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Seed Sample Classrooms
  const class1A = await prisma.classRoom.upsert({
    where: { name: '1A' },
    update: {},
    create: {
      name: '1A',
      capacity: 28,
    },
  });

  await prisma.classRoom.upsert({
    where: { name: '1B' },
    update: {},
    create: {
      name: '1B',
      capacity: 28,
    },
  });
  console.log('✅ Ruang Kelas (1A, 1B) siap.');

  // 3. Seed Sample Teacher User & Profile
  const teacherUser = await prisma.user.upsert({
    where: { email: 'guru@sdn2tegalsari.sch.id' },
    update: {},
    create: {
      name: 'Ibu Juwita Saraswati, S.Pd.',
      email: 'guru@sdn2tegalsari.sch.id',
      password_hash: teacherPasswordHash,
      role: Role.TEACHER,
      teacherProfile: {
        create: {
          nip: '198805122011012001',
          subject: 'Matematika & Tematik',
        },
      },
    },
  });
  console.log(`✅ Sample Teacher siap: ${teacherUser.email}`);

  // 4. Seed Sample Student User & Profile
  const studentUser = await prisma.user.upsert({
    where: { email: 'siswa@sdn2tegalsari.sch.id' },
    update: {},
    create: {
      name: 'Ahmad Rizky Pratama',
      email: 'siswa@sdn2tegalsari.sch.id',
      password_hash: studentPasswordHash,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          nisn: '0089123456',
          birth_date: new Date('2015-08-17'),
          address: 'Jl. Raya Kepanjen No. 45, Malang',
          classId: class1A.id,
        },
      },
    },
  });
  console.log(`✅ Sample Student siap: ${studentUser.email}`);

  // 5. Seed Sample Initial Post for Company Profile
  await prisma.post.upsert({
    where: { slug: 'selamat-datang-di-portal-sdn-2-tegalsari' },
    update: {},
    create: {
      title: 'Selamat Datang di Portal Resmi SDN 2 Tegalsari Kepanjen',
      slug: 'selamat-datang-di-portal-sdn-2-tegalsari',
      content: 'SDN 2 Tegalsari Kepanjen terus berkomitmen mewujudkan generasi cerdas, berkarakter mulia, dan unggul dalam prestasi dengan dukungan fasilitas teknologi modern serta tenaga pendidik yang berdedikasi tinggi.',
      image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      authorId: adminUser.id,
      published: true,
    },
  });
  console.log('✅ Post Company Profile awal siap.');

  console.log('✨ Seeding selesai secara aman!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
