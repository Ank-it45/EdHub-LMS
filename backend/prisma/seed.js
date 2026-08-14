const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EdHub database seeding...');

  // 1. Clean existing records in reverse dependency order
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Password123!', salt);

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@edhub.dev',
      passwordHash: defaultPassword,
      role: 'ADMIN',
      bio: 'Platform Administrator managing courses, users, and transactions.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
  });

  const instructorPriya = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.dev@edhub.dev',
      passwordHash: defaultPassword,
      role: 'INSTRUCTOR',
      bio: 'Senior Full Stack Engineer & Tech Lead specializing in React, Node.js, and Cloud Architectures.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    },
  });

  const instructorRahul = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul.cloud@edhub.dev',
      passwordHash: defaultPassword,
      role: 'INSTRUCTOR',
      bio: 'Cloud Architect & DevOps Specialist specializing in AWS, Docker, Kubernetes, and Microservices.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
  });

  const studentAnkit = await prisma.user.create({
    data: {
      name: 'Ankit Chaudhary',
      email: 'ankit.student@edhub.dev',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      bio: 'Aspiring full stack developer passionate about building scalable web applications.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    },
  });

  const studentElena = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena.code@edhub.dev',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      bio: 'Frontend developer learning backend microservices and databases.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    },
  });

  console.log('✅ Users seeded.');

  // 3. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Full-Stack Modern React & Node.js Mastery',
      description:
        'Master modern web development from ground up. Learn React 18, Node.js, Express, PostgreSQL, Prisma, JWT authentication, and build robust production applications with responsive UI design.',
      price: 89.99,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      category: 'Development',
      level: 'Intermediate',
      learningOutcomes: ['Build production-ready React and Node.js applications.', 'Implement secure JWT authentication and server-side RBAC.', 'Design PostgreSQL schemas with Prisma and robust transactions.', 'Create responsive glassmorphic interfaces with Bootstrap 5.'],
      instructorId: instructorPriya.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Cloud Infrastructure & DevOps with Docker and Kubernetes',
      description:
        'Deploy scalable microservices in production. Hands-on labs with Docker containerization, Kubernetes orchestration, CI/CD pipelines, AWS deployment, and infrastructure monitoring.',
      price: 119.99,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
      category: 'DevOps',
      level: 'Advanced',
      learningOutcomes: ['Containerize applications with Docker.', 'Deploy and scale services with Kubernetes.', 'Build reliable CI/CD pipelines for production delivery.', 'Monitor cloud infrastructure and microservices effectively.'],
      instructorId: instructorRahul.id,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Prisma ORM & PostgreSQL Database Architecture',
      description:
        'Deep dive into relational databases with PostgreSQL and Prisma ORM. Learn complex relationships, transactions, indexes, migrations, schema modeling, and query optimization.',
      price: 59.99,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
      category: 'Database',
      level: 'Intermediate',
      learningOutcomes: ['Model relational data with PostgreSQL and Prisma.', 'Implement relationships, constraints, and atomic transactions.', 'Optimize queries with indexes and efficient schema design.', 'Build maintainable database-backed applications.'],
      instructorId: instructorPriya.id,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'UI/UX Glassmorphism & Modern Web Styling',
      description:
        'Craft ultra-sleek, premium user interfaces with modern glassmorphism aesthetics, responsive Bootstrap grid layouts, translucent depth, glowing accents, and micro-interactions.',
      price: 49.99,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      category: 'Design',
      level: 'Beginner',
      learningOutcomes: ['Create polished glassmorphic interfaces.', 'Build responsive layouts with Bootstrap 5.', 'Use spacing, typography, and contrast for accessible UI.', 'Add subtle micro-interactions and visual depth.'],
      instructorId: instructorPriya.id,
    },
  });

  const course5 = await prisma.course.create({
    data: {
      title: 'RESTful API Security & Microservice Authentication',
      description:
        'Protect your backend applications. Master JWT tokens, RBAC permissions, request sanitization, rate limiting, hashing, and OWASP top security guidelines in Node.js Express.',
      price: 74.99,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      category: 'Security',
      level: 'Intermediate',
      learningOutcomes: ['Implement JWT authentication for REST APIs.', 'Apply server-side RBAC authorization.', 'Secure APIs with validation, hashing, and sanitization.', 'Design safer Node.js Express microservices.'],
      instructorId: instructorRahul.id,
    },
  });

  console.log('✅ Courses seeded.');

  // 4. Create Initial Sample Enrollment & Order
  const order1 = await prisma.order.create({
    data: {
      userId: studentAnkit.id,
      courseId: course1.id,
      amount: course1.price,
      status: 'PLACED',
      payment: {
        create: {
          amount: course1.price,
          status: 'SUCCESS',
          transactionId: 'MOCK_TXN_20260814_9A81E4',
        },
      },
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: studentAnkit.id,
      courseId: course1.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Sample orders and enrollments seeded.');
  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
