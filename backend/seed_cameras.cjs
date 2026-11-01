const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🎥 Seeding 7 nursery cameras: 4 Nap Rooms + 3 Playroom Cameras...');

  // 1. Ensure the 4 sleeping rooms + playroom areas exist in Class model
  const classes = [
    { id: 'class-sleep-1', name: 'غرفة نوم الأطفال (عمر سنة)', ageGroup: 'سنة واحدة', capacity: 10 },
    { id: 'class-sleep-2', name: 'غرفة نوم الأطفال (عمر سنتين)', ageGroup: 'سنتين', capacity: 12 },
    { id: 'class-sleep-3', name: 'غرفة نوم الأطفال (عمر 3 سنوات)', ageGroup: '3 سنوات', capacity: 15 },
    { id: 'class-sleep-4', name: 'غرفة نوم الأطفال (عمر 4 سنوات)', ageGroup: '4 سنوات', capacity: 15 },
    { id: 'class-playroom-1', name: 'غرفة الألعاب (الأنشطة الحركية)', ageGroup: 'مشترك', capacity: 30 },
    { id: 'class-playroom-2', name: 'غرفة الألعاب (ألعاب المهارات والهادئة)', ageGroup: 'مشترك', capacity: 30 },
    { id: 'class-playroom-3', name: 'غرفة الألعاب (الساحة المركزية)', ageGroup: 'مشترك', capacity: 40 }
  ];

  for (const cls of classes) {
    await prisma.class.upsert({
      where: { id: cls.id },
      update: { name: cls.name, ageGroup: cls.ageGroup, capacity: cls.capacity },
      create: cls
    });
  }

  // 2. Upsert 7 Cameras
  const cameras = [
    {
      id: 'cam-sleep-1',
      name: 'غرفة نوم الأطفال (عمر سنة)',
      streamUrl: 'cam1',
      classId: 'class-sleep-1',
      isActive: true
    },
    {
      id: 'cam-sleep-2',
      name: 'غرفة نوم الأطفال (عمر سنتين)',
      streamUrl: 'cam2',
      classId: 'class-sleep-2',
      isActive: true
    },
    {
      id: 'cam-sleep-3',
      name: 'غرفة نوم الأطفال (عمر 3 سنوات)',
      streamUrl: 'cam3',
      classId: 'class-sleep-3',
      isActive: true
    },
    {
      id: 'cam-sleep-4',
      name: 'غرفة نوم الأطفال (عمر 4 سنوات)',
      streamUrl: 'cam4',
      classId: 'class-sleep-4',
      isActive: true
    },
    {
      id: 'cam-play-1',
      name: 'غرفة الألعاب (زاوية الأنشطة الحركية)',
      streamUrl: 'cam5',
      classId: 'class-playroom-1',
      isActive: true
    },
    {
      id: 'cam-play-2',
      name: 'غرفة الألعاب (زاوية الألعاب الهادئة والرسم)',
      streamUrl: 'cam6',
      classId: 'class-playroom-2',
      isActive: true
    },
    {
      id: 'cam-play-3',
      name: 'غرفة الألعاب (الساحة المركزية)',
      streamUrl: 'cam7',
      classId: 'class-playroom-3',
      isActive: true
    }
  ];

  for (const cam of cameras) {
    await prisma.camera.upsert({
      where: { id: cam.id },
      update: {
        name: cam.name,
        streamUrl: cam.streamUrl,
        classId: cam.classId,
        isActive: cam.isActive
      },
      create: cam
    });

    // 3. Clear old schedules & add weekly schedule (0-6) from 06:00 to 22:00
    await prisma.cameraSchedule.deleteMany({ where: { cameraId: cam.id } });

    for (let day = 0; day <= 6; day++) {
      await prisma.cameraSchedule.create({
        data: {
          cameraId: cam.id,
          dayOfWeek: day,
          startTime: '06:00',
          endTime: '22:00',
          isActive: true
        }
      });
    }
  }

  console.log('✅ Successfully seeded 7 nursery cameras (4 Sleep Rooms + 3 Playroom angles)!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding cameras:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
