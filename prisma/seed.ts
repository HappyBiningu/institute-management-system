import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Rand Training College courses and fees...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  // Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@randtrainingcollege.com' },
    update: {},
    create: {
      email: 'admin@randtrainingcollege.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      isActive: true
    }
  });

  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@randtrainingcollege.com' },
    update: {},
    create: {
      email: 'teacher1@randtrainingcollege.com',
      password: hashedPassword,
      name: 'Dr. Sarah Johnson',
      role: 'TEACHER',
      isActive: true
    }
  });

  // Courses Data from provided file
  const courseData = [
    // Faculty of Traffic & Policing
    { id: 'traffic-mgmt-l5', name: 'Traffic Management: NQF Level 5', grade: 'Year 1', description: 'National Certificate: Traffic Management', regFee: 500, deposit: 3000, tuitionSemester: 10800, monthly: 1800, total: 25100 },
    { id: 'policing-dip-l6', name: 'National Diploma: Policing', grade: 'Year 2', description: '1 Year if you have Level 5', regFee: 500, deposit: 3000, tuitionSemester: 12000, monthly: 2000, total: 27500 },
    
    // Faculty of Business Studies
    { id: 'bus-mgmt', name: 'Business Management', grade: 'N4-N6', description: 'Faculty of Business Studies', regFee: 500, deposit: 3000, tuitionSemester: 9600, monthly: 1600, total: 32300 },
    { id: 'hr-mgmt', name: 'Human Resource Management', grade: 'N4-N6', description: 'Faculty of Business Studies', regFee: 500, deposit: 3000, tuitionSemester: 9600, monthly: 1600, total: 32300 },
    { id: 'travel-tourism', name: 'Travel & Tourism', grade: 'N4-N6', description: 'Faculty of Business Studies', regFee: 500, deposit: 3000, tuitionSemester: 9600, monthly: 1600, total: 32300 },
    { id: 'hospitality', name: 'Hospitality & Catering Services', grade: 'N4-N6', description: 'Faculty of Business Studies', regFee: 500, deposit: 3000, tuitionSemester: 9600, monthly: 1600, total: 32300 },
    
    // Faculty of Engineering
    { id: 'elec-eng', name: 'Electrical Engineering', grade: 'N4-N6', description: 'Faculty of Engineering Studies', regFee: 500, deposit: 3000, tuitionSemester: 10800, monthly: 1800, total: 35900 },
    { id: 'civil-eng', name: 'Civil Engineering', grade: 'N4-N6', description: 'Faculty of Engineering Studies', regFee: 500, deposit: 3000, tuitionSemester: 10800, monthly: 1800, total: 35900 },
    
    // Faculty of Computer Science
    { id: 'it-end-user', name: 'IT: End User Computing', grade: '1 Year', description: 'Faculty of Computer Science', regFee: 500, deposit: 3000, tuitionSemester: 9600, monthly: 1600, total: 22700 },
    { id: 'it-sys-dev', name: 'IT: Systems Development', grade: '1 Year', description: 'Faculty of Computer Science', regFee: 500, deposit: 3000, tuitionSemester: 10800, monthly: 1800, total: 25100 },
  ];

  for (const c of courseData) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: { name: c.name, description: c.description, grade: c.grade },
      create: {
        id: c.id,
        name: c.name,
        description: c.description,
        grade: c.grade,
        teacherId: teacher1.id,
        feeStructure: {
          create: {
            amount: c.monthly,
            billingCycle: 'MONTHLY'
          }
        }
      }
    });
  }

  // Short Courses
  const shortCourses = [
    { id: 'hotel-waiter', name: 'Hotel Waiter', description: 'Short Course - 4 Months', monthly: 1600 },
    { id: 'ms-office', name: 'Microsoft Office', description: 'Short Course - 5 Months', monthly: 1600 },
    { id: 'graphic-design', name: 'Graphic Design', description: 'Short Course - 6 Months', monthly: 1800 },
  ];

  for (const sc of shortCourses) {
    await prisma.course.upsert({
      where: { id: sc.id },
      update: {},
      create: {
        id: sc.id,
        name: sc.name,
        description: sc.description,
        teacherId: adminUser.id,
        feeStructure: {
          create: {
            amount: sc.monthly,
            billingCycle: 'MONTHLY'
          }
        }
      }
    });
  }

  console.log('✅ Seeded courses from Rand Training College fees structure');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
