// seed.js
// สคริปต์เติมข้อมูลเริ่มต้น (users + samples) ลงในฐานข้อมูล SQLite ด้วย Prisma
// ใช้ bcrypt เพื่อ hash รหัสผ่าน (commonjs syntax เนื่องจาก package.json มี "type": "commonjs")

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  // ---------- Users ----------
  const users = [
    { username: 'admin', password: 'password', role: 'lab', fullname: 'ดร. สมภพ รักชาติ' },
    { username: 'lab', password: 'password', role: 'lab', fullname: 'นสพ.วิทยา รักดี' },
    { username: 'collector', password: 'password', role: 'collector', fullname: 'นายสมคิด สุขใจ' },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        password: hash,
        role: u.role,
        fullname: u.fullname,
      },
    });
  }
  console.log('✅ Users seeded');

  // ---------- Samples ----------
  const now = new Date();
  const samples = [
    {
      ref_id: 'TEMP-10001',
      lab_id: 'SSK-2026-0001',
      form_type: 'MU.10-001',
      agency: 'สสจ.ศรีสะเกษ',
      location_type: 'ตลาดสด',
      location_name: 'ตลาดสดเทศบาล',
      province: 'ศรีสะเกษ',
      amphoe: 'เมือง',
      tambon: 'เมืองเหนือ',
      collector_name: 'นายสมคิด สุขใจ',
      sampling_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      sample_name: 'ผักคะน้า',
      sample_qty: 1,
      distributor: 'แผงผัก ป้าแดง',
      source: 'ตลาดไท',
      status: 'approved',
      analysis_analyst: 'นสพ.วิทยา รักดี',
      analysis_date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      analysis_details: 'ไม่พบการตกค้างของยาฆ่าแมลงกลุ่มออร์กาโนฟอสเฟต',
      analysis_summary: 'ผ่านเกณฑ์มาตรฐาน',
      approver_name: 'ดร. สมภพ รักชาติ',
      created_at: now,
    },
    {
      ref_id: 'TEMP-10002',
      sample_name: 'ลูกชิ้นหมู',
      sample_qty: 2,
      distributor: 'เฮียชัย',
      source: 'ผลิตเอง',
      status: 'approved',
      analysis_analyst: 'นสพ.วิทยา รักดี',
      analysis_date: now,
      analysis_details: 'ตรวจพบสารบอแรกซ์ 0.5 ppm',
      analysis_summary: 'ไม่ผ่านเกณฑ์มาตรฐาน',
      approver_name: 'ดร. สมภพ รักชาติ',
      created_at: now,
    },
  ];

  for (const s of samples) {
    await prisma.sample.upsert({
      where: { ref_id: s.ref_id },
      update: {},
      create: s,
    });
  }
  console.log('✅ Samples seeded');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
