import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const passwordHash = await bcrypt.hash('123456', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kidsworld.com' },
    update: {
      name: 'مدير النظام الرئيسي',
      phone: '0599000000',
      address: 'نابلس - نابلس الجديدة',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
    },
    create: {
      email: 'admin@kidsworld.com',
      name: 'مدير النظام الرئيسي',
      phone: '0599000000',
      address: 'نابلس - نابلس الجديدة',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Admin user created/updated:', admin.email);

  // 2. Create Classes
  const classA = await prisma.class.upsert({
    where: { id: 'class-birds-3-4' },
    update: { name: 'روضة العصافير', ageGroup: '3-4 سنوات', capacity: 20 },
    create: { id: 'class-birds-3-4', name: 'روضة العصافير', ageGroup: '3-4 سنوات', capacity: 20 },
  });

  const classB = await prisma.class.upsert({
    where: { id: 'class-flowers-4-5' },
    update: { name: 'روضة الزهور', ageGroup: '4-5 سنوات', capacity: 22 },
    create: { id: 'class-flowers-4-5', name: 'روضة الزهور', ageGroup: '4-5 سنوات', capacity: 22 },
  });

  const classC = await prisma.class.upsert({
    where: { id: 'class-hope-2-3' },
    update: { name: 'روضة الأمل', ageGroup: '2-3 سنوات', capacity: 15 },
    create: { id: 'class-hope-2-3', name: 'روضة الأمل', ageGroup: '2-3 سنوات', capacity: 15 },
  });
  console.log('✅ Classes created:', classA.name, classB.name, classC.name);

  // 3. Create Teachers
  const teacher1 = await prisma.user.upsert({
    where: { email: 'nora@kidsworld.com' },
    update: {
      name: 'أ. نورة النابلسي',
      phone: '0599111222',
      address: 'نابلس - رفيديا',
      passwordHash,
      role: 'TEACHER',
      isActive: true,
      isVerified: true,
    },
    create: {
      email: 'nora@kidsworld.com',
      name: 'أ. نورة النابلسي',
      phone: '0599111222',
      address: 'نابلس - رفيديا',
      passwordHash,
      role: 'TEACHER',
      isActive: true,
      isVerified: true,
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'sara@kidsworld.com' },
    update: {
      name: 'أ. سارة الخالد',
      phone: '0599333444',
      address: 'نابلس - المعاجين',
      passwordHash,
      role: 'TEACHER',
      isActive: true,
      isVerified: true,
    },
    create: {
      email: 'sara@kidsworld.com',
      name: 'أ. سارة الخالد',
      phone: '0599333444',
      address: 'نابلس - المعاجين',
      passwordHash,
      role: 'TEACHER',
      isActive: true,
      isVerified: true,
    },
  });

  // Assign teachers to classes
  await prisma.teacherClass.upsert({
    where: { teacherId_classId: { teacherId: teacher1.id, classId: classA.id } },
    update: {},
    create: { teacherId: teacher1.id, classId: classA.id },
  });

  await prisma.teacherClass.upsert({
    where: { teacherId_classId: { teacherId: teacher2.id, classId: classB.id } },
    update: {},
    create: { teacherId: teacher2.id, classId: classB.id },
  });
  console.log('✅ Teachers created & assigned');

  // 4. Create Parents
  const parent1 = await prisma.user.upsert({
    where: { email: 'ahmed.parent@gmail.com' },
    update: {
      name: 'أحمد الشكعة',
      phone: '0599888777',
      alternatePhone: '0599888778',
      address: 'نابلس - شارع سفيان',
      passwordHash,
      role: 'PARENT',
      isActive: true,
      isVerified: true,
    },
    create: {
      email: 'ahmed.parent@gmail.com',
      name: 'أحمد الشكعة',
      phone: '0599888777',
      alternatePhone: '0599888778',
      address: 'نابلس - شارع سفيان',
      passwordHash,
      role: 'PARENT',
      isActive: true,
      isVerified: true,
    },
  });

  const parent2 = await prisma.user.upsert({
    where: { email: 'marian.parent@gmail.com' },
    update: {
      name: 'مريم المصري',
      phone: '0599555666',
      alternatePhone: '0599555667',
      address: 'نابلس - نابلس الجديدة',
      passwordHash,
      role: 'PARENT',
      isActive: true,
      isVerified: true,
    },
    create: {
      email: 'marian.parent@gmail.com',
      name: 'مريم المصري',
      phone: '0599555666',
      alternatePhone: '0599555667',
      address: 'نابلس - نابلس الجديدة',
      passwordHash,
      role: 'PARENT',
      isActive: true,
      isVerified: true,
    },
  });

  const parent3 = await prisma.user.upsert({
    where: { email: 'khaled.parent@gmail.com' },
    update: {
      name: 'خالد جودت',
      phone: '0599222111',
      address: 'نابلس - الجبل الشمالي',
      passwordHash,
      role: 'PARENT',
      isActive: true,
      isVerified: true,
    },
    create: {
      email: 'khaled.parent@gmail.com',
      name: 'خالد جودت',
      phone: '0599222111',
      address: 'نابلس - الجبل الشمالي',
      passwordHash,
      role: 'PARENT',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Parents created');

  // 5. Create Children
  const now = new Date();
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const thirtyFiveDaysAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);
  const fortyDaysAgo = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000);

  const child1 = await prisma.child.upsert({
    where: { id: 'child-omar-shakaa' },
    update: {
      name: 'عمر أحمد الشكعة',
      parentId: parent1.id,
      classId: classA.id,
      dob: new Date('2022-04-15'),
      gender: 'male',
      medicalNotes: 'حساسية خفيفة من السمسم - يرجى الانتباه عند تقديم الطعام',
      enrollmentDate: tenDaysAgo,
    },
    create: {
      id: 'child-omar-shakaa',
      name: 'عمر أحمد الشكعة',
      parentId: parent1.id,
      classId: classA.id,
      dob: new Date('2022-04-15'),
      gender: 'male',
      medicalNotes: 'حساسية خفيفة من السمسم - يرجى الانتباه عند تقديم الطعام',
      enrollmentDate: tenDaysAgo,
    },
  });

  const child2 = await prisma.child.upsert({
    where: { id: 'child-layan-shakaa' },
    update: {
      name: 'ليان أحمد الشكعة',
      parentId: parent1.id,
      classId: classC.id,
      dob: new Date('2023-08-10'),
      gender: 'female',
      medicalNotes: 'لا يوجد أية حساسية معروفة',
      enrollmentDate: fiveDaysAgo,
    },
    create: {
      id: 'child-layan-shakaa',
      name: 'ليان أحمد الشكعة',
      parentId: parent1.id,
      classId: classC.id,
      dob: new Date('2023-08-10'),
      gender: 'female',
      medicalNotes: 'لا يوجد أية حساسية معروفة',
      enrollmentDate: fiveDaysAgo,
    },
  });

  const child3 = await prisma.child.upsert({
    where: { id: 'child-sara-masri' },
    update: {
      name: 'سارة مريم المصري',
      parentId: parent2.id,
      classId: classB.id,
      dob: new Date('2021-11-20'),
      gender: 'female',
      medicalNotes: 'تضع نظارات طبية للقراءة والأنشطة',
      enrollmentDate: thirtyFiveDaysAgo,
    },
    create: {
      id: 'child-sara-masri',
      name: 'سارة مريم المصري',
      parentId: parent2.id,
      classId: classB.id,
      dob: new Date('2021-11-20'),
      gender: 'female',
      medicalNotes: 'تضع نظارات طبية للقراءة والأنشطة',
      enrollmentDate: thirtyFiveDaysAgo,
    },
  });

  const child4 = await prisma.child.upsert({
    where: { id: 'child-yousef-jowdat' },
    update: {
      name: 'يوسف خالد جودت',
      parentId: parent3.id,
      classId: classA.id,
      dob: new Date('2022-01-05'),
      gender: 'male',
      medicalNotes: 'ربو خفيف - بخاخ فنتولين عند الحاجة',
      enrollmentDate: fortyDaysAgo,
    },
    create: {
      id: 'child-yousef-jowdat',
      name: 'يوسف خالد جودت',
      parentId: parent3.id,
      classId: classA.id,
      dob: new Date('2022-01-05'),
      gender: 'male',
      medicalNotes: 'ربو خفيف - بخاخ فنتولين عند الحاجة',
      enrollmentDate: fortyDaysAgo,
    },
  });
  console.log('✅ Children created:', child1.name, child2.name, child3.name, child4.name);

  // 6. Create Attendance Records for Children
  for (let i = 0; i < 15; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (d.getDay() === 5) continue; // Skip Friday

    const dateStr = d.toISOString().split('T')[0];
    const targetDate = new Date(dateStr);

    await prisma.attendanceRecord.upsert({
      where: { childId_date: { childId: child1.id, date: targetDate } },
      update: { status: i % 7 === 0 ? 'ABSENT' : 'PRESENT' },
      create: { childId: child1.id, date: targetDate, status: i % 7 === 0 ? 'ABSENT' : 'PRESENT' },
    });

    await prisma.attendanceRecord.upsert({
      where: { childId_date: { childId: child2.id, date: targetDate } },
      update: { status: 'PRESENT' },
      create: { childId: child2.id, date: targetDate, status: 'PRESENT' },
    });

    await prisma.attendanceRecord.upsert({
      where: { childId_date: { childId: child3.id, date: targetDate } },
      update: { status: i % 5 === 0 ? 'LATE' : 'PRESENT' },
      create: { childId: child3.id, date: targetDate, status: i % 5 === 0 ? 'LATE' : 'PRESENT' },
    });
  }
  console.log('✅ Attendance records created');

  // 7. Create Complaints & Messages
  await prisma.complaint.create({
    data: {
      title: 'استفسار عن برنامج الوجبات اليومية والمواصلات',
      description: 'نود الاستفسار عن تفاصيل وجبة الإفطار للأسبوع القادم وهل تشمل الفواكه الطازجة، بالإضافة لموعد الانطلاق في الرحلة القادمة.',
      status: 'RESOLVED',
      parentId: parent1.id,
      childId: child1.id,
    },
  });

  await prisma.complaint.create({
    data: {
      title: 'ملاحظة بشأن ميعاد تسليم الطفل بعد الظهر',
      description: 'يرجى التنسيق معنا قبل 10 دقائق من وصول الحافلة إلى نابلس الجديدة.',
      status: 'OPEN',
      parentId: parent2.id,
      childId: child3.id,
    },
  });

  await prisma.message.create({
    data: {
      senderId: parent1.id,
      receiverId: teacher1.id,
      content: 'مرحباً أستاذة نورة، كيف كان أداء عمر اليوم في نشاط الرسم والتلوين؟',
      isRead: true,
    },
  });

  await prisma.message.create({
    data: {
      senderId: teacher1.id,
      receiverId: parent1.id,
      content: 'أهلاً سيد أحمد، عمر كان ممتازاً جداً وشارك بشغف ورسم لوحة جميلة للطبيعة!',
      isRead: true,
    },
  });
  console.log('✅ Complaints & Messages created');

  // 8. Create Incidents
  await prisma.incident.create({
    data: {
      childId: child1.id,
      date: new Date(),
      time: '10:30 ص',
      severity: 'LOW',
      description: 'سقوط خفيف أثناء اللعب في ساحة الألعاب الخارجية، نتج عنه خدش بسيط جداً في الركبة اليمنى.',
      actionTaken: 'تم تنظيف الخدش وتطهيره ووضع ضمادة طبية مع تهدئة الطفل وإعادته للعب بسلام.',
      followUp: 'الطفل بخير وتم إعلام ولي الأمر.',
      isVisibleToParent: true,
    },
  });
  console.log('✅ Incident created');

  // 9. Create Events
  await prisma.event.create({
    data: {
      titleEn: 'Annual Children Art Exhibition',
      titleAr: 'معرض الرسومات والأشغال اليدوية السنوي',
      descriptionEn: 'An exhibition showcasing the beautiful artwork and handcrafts of our creative children.',
      descriptionAr: 'معرض فني يضم أجمل لوحات وأعمال أطفالنا الإبداعية بحضور أولياء الأمور الكرام.',
      imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isPublished: true,
    },
  });

  await prisma.event.create({
    data: {
      titleEn: 'Sports and Fun Day',
      titleAr: 'يوم الرياضة والمرح الصيفي',
      descriptionEn: 'Fun outdoor games and athletic activities for all age groups.',
      descriptionAr: 'أنشطة رياضية وألعاب تفاعلية ممتعة في الهواء الطلق لتنمية مهارات الحركة واللياقة.',
      imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800',
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isPublished: true,
    },
  });
  console.log('✅ Events created');

  // 10. Create Gallery Images
  const galleryUrls = [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800',
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800',
  ];

  for (let i = 0; i < galleryUrls.length; i++) {
    await prisma.galleryImage.create({
      data: {
        url: galleryUrls[i],
        captionAr: `نشاط تعليمي وترفيهي - صورة رقم ${i + 1}`,
        captionEn: `Educational activity photo #${i + 1}`,
        isPublished: true,
        orderIndex: i,
      },
    });
  }
  console.log('✅ Gallery images created');

  // 11. Create Weekly Notes & Evaluations
  await prisma.weeklyNote.create({
    data: {
      childId: child1.id,
      weekStartDate: new Date(),
      behavior: 'ممتاز وهادئ ومتعاون مع زملائه',
      participation: 'تفاعل عالي في حصة القراءة والإنشاد',
      socialSkills: 'يبادر باللعب ومشاركة الألعاب مع الآخرين',
      communication: 'يعبر بوضوح عن احتياجاته وأفكاره',
      learning: 'استوعب الحروف والأرقام الجديدة بسرعة',
      activities: 'شارك في تلوين اللوحات وزراعة الشتلات',
      generalNotes: 'طفل متميز وذكي جداً',
    },
  });

  await prisma.evaluation.create({
    data: {
      childId: child1.id,
      term: 'الفصل الأول 2026',
      learning: 5,
      communication: 5,
      socialSkills: 4,
      participation: 5,
      behavior: 5,
      creativity: 4,
      motorSkills: 5,
    },
  });

  await prisma.evaluation.create({
    data: {
      childId: child3.id,
      term: 'الفصل الأول 2026',
      learning: 4,
      communication: 4,
      socialSkills: 5,
      participation: 4,
      behavior: 5,
      creativity: 5,
      motorSkills: 4,
    },
  });

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
