import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');
  console.log('📊 Creating realistic business scenarios for testing...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);

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

  // Create additional teachers
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

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@randtrainingcollege.com' },
    update: {},
    create: {
      email: 'teacher2@randtrainingcollege.com',
      password: hashedPassword,
      name: 'Prof. Michael Chen',
      role: 'TEACHER',
      isActive: true
    }
  });

  console.log('✅ Admin and teacher users created');

  // Create diverse families with different scenarios
  const families = [
    {
      id: 'family-1',
      name: 'The Johnson Family',
      address: '123 Oak Street, Springfield, IL 62701',
      phone: '+1-217-555-0101',
      email: 'johnson.family@email.com',
      discountAmount: 500, // Family discount
      isActive: true
    },
    {
      id: 'family-2',
      name: 'The Chen Family',
      address: '456 Maple Avenue, Springfield, IL 62702',
      phone: '+1-217-555-0102',
      email: 'chen.family@email.com',
      discountAmount: 0, // No family discount
      isActive: true
    },
    {
      id: 'family-3',
      name: 'The Rodriguez Family',
      address: '789 Pine Road, Springfield, IL 62703',
      phone: '+1-217-555-0103',
      email: 'rodriguez.family@email.com',
      discountAmount: 300, // Moderate family discount
      isActive: true
    },
    {
      id: 'family-4',
      name: 'The Williams Family',
      address: '321 Elm Street, Springfield, IL 62704',
      phone: '+1-217-555-0104',
      email: 'williams.family@email.com',
      discountAmount: 0,
      isActive: true
    },
    {
      id: 'family-5',
      name: 'The Davis Family',
      address: '654 Cedar Lane, Springfield, IL 62705',
      phone: '+1-217-555-0105',
      email: 'davis.family@email.com',
      discountAmount: 800, // Large family discount
      isActive: true
    }
  ];

  const createdFamilies = [];
  for (const familyData of families) {
    const family = await prisma.family.upsert({
      where: { id: familyData.id },
      update: {},
      create: familyData
    });
    createdFamilies.push(family);
  }

  console.log(
    '✅ Created 5 diverse families with different discount scenarios'
  );

  // Create parent user (linked to Johnson family)
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@randtrainingcollege.com' },
    update: {},
    create: {
      email: 'parent@randtrainingcollege.com',
      password: hashedPassword,
      name: 'Johnson Family Parent',
      role: 'PARENT',
      familyId: 'family-1', // Now exists
      isActive: true
    }
  });

  // Create student user (Emma Johnson)
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@randtrainingcollege.com' },
    update: {},
    create: {
      email: 'student@randtrainingcollege.com',
      password: hashedPassword,
      name: 'Emma Johnson',
      role: 'STUDENT',
      familyId: 'family-1', // Now exists
      isActive: true
    }
  });

  console.log('✅ Parent and student users created');

  // Create comprehensive course catalog
  const courses = [
    {
      id: 'math-advanced',
      name: 'Advanced Mathematics',
      description:
        'Calculus, Statistics, and Advanced Algebra for high school students',
      grade: 'Grade 11-12',
      isActive: true,
      capacity: 25,
      teacherId: teacher1.id
    },
    {
      id: 'math-basic',
      name: 'Foundation Mathematics',
      description: 'Basic algebra, geometry, and arithmetic fundamentals',
      grade: 'Grade 8-10',
      isActive: true,
      capacity: 30,
      teacherId: teacher1.id
    },
    {
      id: 'science-physics',
      name: 'Physics',
      description: 'Mechanics, thermodynamics, and modern physics',
      grade: 'Grade 11-12',
      isActive: true,
      capacity: 20,
      teacherId: teacher2.id
    },
    {
      id: 'science-chemistry',
      name: 'Chemistry',
      description: 'Organic, inorganic, and physical chemistry',
      grade: 'Grade 10-12',
      isActive: true,
      capacity: 22,
      teacherId: teacher2.id
    },
    {
      id: 'english-literature',
      name: 'English Literature',
      description: 'Classic and modern literature analysis and writing',
      grade: 'Grade 9-12',
      isActive: true,
      capacity: 28,
      teacherId: adminUser.id
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      description: 'Programming, algorithms, and software development',
      grade: 'Grade 10-12',
      isActive: true,
      capacity: 18,
      teacherId: adminUser.id
    },
    {
      id: 'art-design',
      name: 'Art & Design',
      description: 'Visual arts, digital design, and creative expression',
      grade: 'Grade 8-12',
      isActive: true,
      capacity: 15,
      teacherId: teacher1.id
    }
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { id: courseData.id },
      update: {},
      create: courseData
    });
    createdCourses.push(course);
  }

  console.log(
    '✅ Created 7 diverse courses across different subjects and grade levels'
  );

  // Create comprehensive services
  const services = [
    {
      id: 'transport-bus',
      name: 'Bus Transportation',
      description: 'Daily school bus service with multiple routes'
    },
    {
      id: 'transport-van',
      name: 'Van Transportation',
      description: 'Smaller vehicle transport for specific areas'
    },
    {
      id: 'meals-lunch',
      name: 'Lunch Service',
      description: 'Nutritious daily lunch meals'
    },
    {
      id: 'meals-snacks',
      name: 'Snack Service',
      description: 'Healthy morning and afternoon snacks'
    },
    {
      id: 'library-access',
      name: 'Library Access',
      description: 'Extended library hours and digital resources'
    },
    {
      id: 'sports-program',
      name: 'Sports Program',
      description: 'After-school sports and physical activities'
    },
    {
      id: 'tutoring',
      name: 'Extra Tutoring',
      description: 'One-on-one and small group tutoring sessions'
    }
  ];

  const createdServices = [];
  for (const serviceData of services) {
    const service = await prisma.service.upsert({
      where: { id: serviceData.id },
      update: {},
      create: serviceData
    });
    createdServices.push(service);
  }

  console.log(
    '✅ Created 7 diverse services covering transportation, meals, and activities'
  );

  // Create comprehensive fee structures for all courses and services
  const feeStructures = [
    // Course fees - varying by complexity and grade level
    { amount: 2500, billingCycle: 'MONTHLY', courseId: 'math-advanced' },
    { amount: 2000, billingCycle: 'MONTHLY', courseId: 'math-basic' },
    { amount: 2800, billingCycle: 'MONTHLY', courseId: 'science-physics' },
    { amount: 2600, billingCycle: 'MONTHLY', courseId: 'science-chemistry' },
    { amount: 2200, billingCycle: 'MONTHLY', courseId: 'english-literature' },
    { amount: 3000, billingCycle: 'MONTHLY', courseId: 'computer-science' },
    { amount: 1800, billingCycle: 'MONTHLY', courseId: 'art-design' },

    // Service fees - varying by service type
    { amount: 1000, billingCycle: 'MONTHLY', serviceId: 'transport-bus' },
    { amount: 800, billingCycle: 'MONTHLY', serviceId: 'transport-van' },
    { amount: 1500, billingCycle: 'MONTHLY', serviceId: 'meals-lunch' },
    { amount: 600, billingCycle: 'MONTHLY', serviceId: 'meals-snacks' },
    { amount: 400, billingCycle: 'MONTHLY', serviceId: 'library-access' },
    { amount: 700, billingCycle: 'MONTHLY', serviceId: 'sports-program' },
    { amount: 1200, billingCycle: 'MONTHLY', serviceId: 'tutoring' }
  ];

  for (const feeData of feeStructures) {
    if (feeData.courseId) {
      await prisma.feeStructure.upsert({
        where: { courseId: feeData.courseId },
        update: {},
        create: {
          amount: feeData.amount,
          billingCycle: feeData.billingCycle,
          courseId: feeData.courseId
        }
      });
    } else if (feeData.serviceId) {
      await prisma.feeStructure.upsert({
        where: { serviceId: feeData.serviceId },
        update: {},
        create: {
          amount: feeData.amount,
          billingCycle: feeData.billingCycle,
          serviceId: feeData.serviceId
        }
      });
    }
  }

  console.log(
    '✅ Created comprehensive fee structures for all 7 courses and 7 services'
  );

  // Create diverse students across different families and grade levels
  const students = [
    // Johnson Family - 2 children
    {
      id: 'student-1',
      name: 'Emma Johnson',
      grade: 'Grade 11',
      dateOfBirth: new Date('2007-03-12'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU001',
      familyId: 'family-1'
    },
    {
      id: 'student-2',
      name: 'Liam Johnson',
      grade: 'Grade 9',
      dateOfBirth: new Date('2009-07-22'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU002',
      familyId: 'family-1'
    },
    // Chen Family - 1 child
    {
      id: 'student-3',
      name: 'Sophie Chen',
      grade: 'Grade 12',
      dateOfBirth: new Date('2006-11-08'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU003',
      familyId: 'family-2'
    },
    // Rodriguez Family - 3 children
    {
      id: 'student-4',
      name: 'Carlos Rodriguez',
      grade: 'Grade 10',
      dateOfBirth: new Date('2008-01-15'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU004',
      familyId: 'family-3'
    },
    {
      id: 'student-5',
      name: 'Maria Rodriguez',
      grade: 'Grade 8',
      dateOfBirth: new Date('2010-05-30'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU005',
      familyId: 'family-3'
    },
    {
      id: 'student-6',
      name: 'Diego Rodriguez',
      grade: 'Grade 12',
      dateOfBirth: new Date('2006-09-18'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU006',
      familyId: 'family-3'
    },
    // Williams Family - 1 child
    {
      id: 'student-7',
      name: 'Ava Williams',
      grade: 'Grade 10',
      dateOfBirth: new Date('2008-04-25'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU007',
      familyId: 'family-4'
    },
    // Davis Family - 4 children (large family)
    {
      id: 'student-8',
      name: 'Noah Davis',
      grade: 'Grade 11',
      dateOfBirth: new Date('2007-12-03'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU008',
      familyId: 'family-5'
    },
    {
      id: 'student-9',
      name: 'Olivia Davis',
      grade: 'Grade 9',
      dateOfBirth: new Date('2009-02-14'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU009',
      familyId: 'family-5'
    },
    {
      id: 'student-10',
      name: 'Ethan Davis',
      grade: 'Grade 8',
      dateOfBirth: new Date('2010-08-07'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU010',
      familyId: 'family-5'
    },
    {
      id: 'student-11',
      name: 'Isabella Davis',
      grade: 'Grade 12',
      dateOfBirth: new Date('2006-06-20'),
      enrollmentDate: new Date('2023-08-15'),
      isActive: true,
      studentId: 'STU011',
      familyId: 'family-5'
    }
  ];

  const createdStudents = [];
  for (const studentData of students) {
    const student = await prisma.student.upsert({
      where: { id: studentData.id },
      update: {},
      create: studentData
    });
    createdStudents.push(student);
  }

  console.log(
    '✅ Created 11 students across 5 families with diverse grade levels'
  );

  // Import and run comprehensive data creation
  const {
    createStudentSubscriptionsAndFees,
    createFeeAllocationsAndPayments,
    createPaymentHistory,
    createAcademicLogs
  } = await import('./comprehensive-seed');

  await createStudentSubscriptionsAndFees();
  await createFeeAllocationsAndPayments();
  await createPaymentHistory();
  await createAcademicLogs();

  console.log('🎉 Comprehensive database seeding completed successfully!');
  console.log('');
  console.log('📊 Database Summary:');
  console.log('   👥 5 Families with varying discount structures');
  console.log('   👨‍🎓 11 Students across different grade levels');
  console.log('   📚 7 Courses with different fee structures');
  console.log('   🚌 7 Services (transport, meals, activities)');
  console.log('   💰 6 months of fee allocations and payment history');
  console.log('   📝 Diverse academic logs and progress records');
  console.log('');
  console.log('🎯 Business Scenarios Covered:');
  console.log('   ✅ Single child families (Chen, Williams)');
  console.log('   ✅ Multiple child families (Johnson, Rodriguez, Davis)');
  console.log('   ✅ Large family discounts (Davis family - 4 children)');
  console.log('   ✅ Individual student discounts (merit-based)');
  console.log('   ✅ Mixed payment patterns (90% paid, 10% pending)');
  console.log('   ✅ Diverse course combinations per student');
  console.log('   ✅ Realistic fee calculation scenarios');
  console.log('');
  console.log('📋 Login Credentials:');
  console.log('   Admin: admin@randtrainingcollege.com / admin123');
  console.log('   Teacher 1: teacher1@randtrainingcollege.com / admin123');
  console.log('   Teacher 2: teacher2@randtrainingcollege.com / admin123');
  console.log('');
  console.log(
    '🔗 Access the application at: https://rand-training-college-management-system.vercel.app'
  );
  console.log('');
  console.log('📈 Reports Dashboard will now show:');
  console.log('   💵 Monthly revenue from payments');
  console.log('   📊 Outstanding dues from pending allocations');
  console.log('   🎓 Student enrollment statistics');
  console.log('   📚 Course popularity and revenue data');
  console.log('   👨‍👩‍👧‍👦 Family payment patterns and discount analysis');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
