import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.sessionNote.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.moodLog.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  const student1 = await prisma.user.create({
    data: {
      name: 'Stephen Indongo',
      email: 'stephen.indongo@nust.na',
      institution_code: 'STD-001',
      password: 'password123',
      role: 'student',
      faculty: 'Computing',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: 'Alice Mwale',
      email: 'alice.mwale@nust.na',
      institution_code: 'STD-002',
      password: 'password123',
      role: 'student',
      faculty: 'Engineering',
    },
  })

  const counsellor1 = await prisma.user.create({
    data: {
      name: 'Dr. Maria Eriksson',
      email: 'maria.eriksson@nust.na',
      institution_code: 'CNS-001',
      password: 'password123',
      role: 'counsellor',
      faculty: 'Psychology',
    },
  })

  const counsellor2 = await prisma.user.create({
    data: {
      name: 'Prof. John Smith',
      email: 'john.smith@nust.na',
      institution_code: 'CNS-002',
      password: 'password123',
      role: 'counsellor',
      faculty: 'Counselling',
    },
  })

  // Create availability slots
  const tomorrow = '2026-04-15'
  const nextWeek = '2026-04-21'

  await prisma.availability.createMany({
    data: [
      {
        counsellor_id: counsellor1.id,
        date: tomorrow,
        startTime: '09:00',
        endTime: '09:30',
      },
      {
        counsellor_id: counsellor1.id,
        date: tomorrow,
        startTime: '10:00',
        endTime: '10:30',
      },
      {
        counsellor_id: counsellor1.id,
        date: tomorrow,
        startTime: '14:00',
        endTime: '14:30',
      },
      {
        counsellor_id: counsellor1.id,
        date: nextWeek,
        startTime: '11:00',
        endTime: '11:30',
      },
      {
        counsellor_id: counsellor2.id,
        date: tomorrow,
        startTime: '13:00',
        endTime: '13:30',
      },
    ],
  })

  // Create appointments
  await prisma.appointment.createMany({
    data: [
      {
        student_id: student1.id,
        counsellor_id: counsellor1.id,
        date: tomorrow,
        startTime: '10:00',
        endTime: '10:30',
        reason: 'Academic stress management',
        status: 'confirmed',
      },
      {
        student_id: student2.id,
        counsellor_id: counsellor1.id,
        date: nextWeek,
        startTime: '11:00',
        endTime: '11:30',
        reason: 'Career guidance',
        status: 'confirmed',
      },
    ],
  })

  // Create mood logs
  await prisma.moodLog.createMany({
    data: [
      {
        student_id: student1.id,
        date: '2026-04-14',
        mood: 'Good',
        sleep: '7',
        appetite: 'Normal',
        energy: '8',
        stress: '4',
      },
      {
        student_id: student2.id,
        date: '2026-04-14',
        mood: 'Stressed',
        sleep: '5',
        appetite: 'Low',
        energy: '3',
        stress: '8',
      },
    ],
  })

  // Create resources
  await prisma.resource.createMany({
    data: [
      {
        title: 'Managing Stress in University',
        type: 'article',
        url: 'https://www.mindtools.com/stress-management',
      },
      {
        title: 'Mindfulness Meditation Guide',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=mindfulness',
      },
      {
        title: 'Time Management Tool',
        type: 'tool',
        url: 'https://www.timemanagement.app',
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

