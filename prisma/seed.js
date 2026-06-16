const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.notification.deleteMany()
  await prisma.applicationDocument.deleteMany()
  await prisma.application.deleteMany()
  await prisma.document.deleteMany()
  await prisma.scholarship.deleteMany()
  await prisma.counselorStudent.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding users...')
  
  // Create provider
  const provider = await prisma.user.create({
    data: {
      email: 'provider@example.com',
      name: 'Global Opportunities Foundation',
      role: 'PROVIDER',
      location: 'Jakarta, Indonesia',
      phone: '+62 812-3456-7890'
    }
  })

  // Create student
  const student = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT',
      location: 'Jakarta, Indonesia',
      phone: '+62 878-1234-5678',
      profile: {
        create: {
          gpa: 3.85,
          graduationYear: 2027,
          major: 'Computer Science',
          university: 'Universitas Indonesia',
          highSchool: 'SMA Negeri 8 Jakarta',
          country: 'Indonesia',
          financialNeed: true,
          firstGenStudent: false
        }
      }
    }
  })

  // Create counselor
   await prisma.user.create({
    data: {
      email: 'counselor@example.com',
      name: 'Jane Smith',
      role: 'COUNSELOR',
      location: 'Depok, Indonesia'
    }
  })

  console.log('Seeding scholarships...')
  const scholarshipsData = [
    {
      title: 'Beasiswa Unggulan Kemendikbud 2026',
      description: 'Beasiswa untuk mahasiswa berprestasi dari keluarga kurang mampu yang memiliki komitmen untuk memajukan pendidikan Indonesia.',
      amount: 24000000.0,
      currency: 'IDR',
      deadline: new Date('2026-07-15'),
      status: 'ACTIVE',
      category: ['S1', 'S2', 'S3'],
      requirements: ['GPA minimum 3.25', 'Surat rekomendasi dari kampus', 'Essay rencana studi'],
      minGpa: 3.25,
      country: 'Indonesia',
      major: ['Semua Jurusan']
    },
    {
      title: 'Yayasan Pendidikan Telkom Scholarship',
      description: 'Beasiswa untuk mahasiswa aktif jurusan teknologi informasi dan telekomunikasi di seluruh Indonesia.',
      amount: 12000000.0,
      currency: 'IDR',
      deadline: new Date('2026-08-01'),
      status: 'ACTIVE',
      category: ['S1', 'Teknologi'],
      requirements: ['GPA minimum 3.0', 'Jurusan Teknik Informatika / Sistem Informasi / Telekomunikasi'],
      minGpa: 3.0,
      country: 'Indonesia',
      major: ['Computer Science', 'Information Systems', 'Telecommunication Engineering']
    },
    {
      title: 'BCA Finance Scholarship Program',
      description: 'Program beasiswa untuk mahasiswa berprestasi di bidang ekonomi, manajemen, dan akuntansi.',
      amount: 18000000.0,
      currency: 'IDR',
      deadline: new Date('2026-06-30'),
      status: 'ACTIVE',
      category: ['S1', 'Ekonomi', 'Bisnis'],
      requirements: ['GPA minimum 3.4', 'Semester 4 ke atas'],
      minGpa: 3.4,
      country: 'Indonesia',
      major: ['Accounting', 'Management', 'Economics']
    },
    {
      title: 'Djarum Foundation Scholarship',
      description: 'Beasiswa bergengsi dari Djarum Foundation untuk mahasiswa berprestasi dengan kemampuan kepemimpinan.',
      amount: 36000000.0,
      currency: 'IDR',
      deadline: new Date('2026-09-15'),
      status: 'ACTIVE',
      category: ['S1', 'Kepemimpinan'],
      requirements: ['GPA minimum 3.2', 'Aktif berorganisasi'],
      minGpa: 3.2,
      country: 'Indonesia',
      major: ['Semua Jurusan']
    },
    {
      title: 'LPDP Beasiswa Reguler',
      description: 'Beasiswa pemerintah untuk jenjang magister dan doktoral di dalam dan luar negeri.',
      amount: 120000000.0,
      currency: 'IDR',
      deadline: new Date('2026-10-01'),
      status: 'ACTIVE',
      category: ['S2', 'S3'],
      requirements: ['GPA minimum 3.0', 'Sertifikat TOEFL / IELTS'],
      minGpa: 3.0,
      country: 'Indonesia',
      major: ['Semua Jurusan']
    }
  ]

  const createdScholarships = []
  for (const s of scholarshipsData) {
    const created = await prisma.scholarship.create({
      data: {
        ...s,
        providerId: provider.id
      }
    })
    createdScholarships.push(created)
  }

  console.log('Seeding applications...')
  await prisma.application.create({
    data: {
      userId: student.id,
      scholarshipId: createdScholarships[0].id,
      status: 'SUBMITTED',
      essay: 'My plan to contribute to the education in Indonesia...',
      submittedAt: new Date('2026-06-01')
    }
  })

  await prisma.application.create({
    data: {
      userId: student.id,
      scholarshipId: createdScholarships[2].id,
      status: 'UNDER_REVIEW',
      essay: 'Why I deserve this scholarship...',
      submittedAt: new Date('2026-06-05')
    }
  })

  await prisma.application.create({
    data: {
      userId: student.id,
      scholarshipId: createdScholarships[1].id,
      status: 'DRAFT',
      essay: 'Draft essay for Telkom scholarship...'
    }
  })

  await prisma.application.create({
    data: {
      userId: student.id,
      scholarshipId: createdScholarships[3].id,
      status: 'ACCEPTED',
      essay: 'Leadership and organization experiences...',
      submittedAt: new Date('2026-05-20'),
      reviewedAt: new Date('2026-06-10')
    }
  })

  console.log('Seeding notifications...')
  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        title: 'Application Accepted!',
        message: 'Congratulations! Your application for Djarum Foundation Scholarship has been accepted.',
        type: 'success',
        link: '/dashboard/applications',
        read: false
      },
      {
        userId: student.id,
        title: 'Deadline Approaching',
        message: 'BCA Finance Scholarship Program is closing in 14 days. Complete your application now!',
        type: 'warning',
        link: '/dashboard/scholarships',
        read: false
      }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
