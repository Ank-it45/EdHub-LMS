process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('../src/server');

let server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  server = app.listen(PORT, async () => {
    console.log(`\n🧪 Running Automated API Integration Tests on port ${PORT}...\n`);

    try {
      // 1. Health check
      const health = await makeRequest('GET', '/health');
      if (health.status !== 200 || health.body.status !== 'OK') {
        throw new Error(`Health check failed: ${JSON.stringify(health)}`);
      }
      console.log('✅ 1. Health check: PASSED');

      // 2. Auth: Student Login
      const studentLogin = await makeRequest('POST', '/auth/login', {
        email: 'elena.code@edhub.dev',
        password: 'Password123!',
      });
      if (studentLogin.status !== 200 || !studentLogin.body.data?.token) {
        throw new Error(`Student login failed: ${JSON.stringify(studentLogin)}`);
      }
      const studentToken = studentLogin.body.data.token;
      console.log('✅ 2. Student Login: PASSED');

      // 3. Auth: Instructor Login
      const instructorLogin = await makeRequest('POST', '/auth/login', {
        email: 'priya.dev@edhub.dev',
        password: 'Password123!',
      });
      if (instructorLogin.status !== 200) {
        throw new Error(`Instructor login failed: ${JSON.stringify(instructorLogin)}`);
      }
      const instructorToken = instructorLogin.body.data.token;
      console.log('✅ 3. Instructor Login: PASSED');

      // 4. Fetch Courses
      const coursesRes = await makeRequest('GET', '/courses');
      if (coursesRes.status !== 200 || !coursesRes.body.data?.length) {
        throw new Error(`Fetch courses failed: ${JSON.stringify(coursesRes)}`);
      }
      console.log(`✅ 4. Fetch Courses (${coursesRes.body.data.length} found): PASSED`);

      // 5. RBAC: Student cannot create course
      const unauthorizedCourse = await makeRequest(
        'POST',
        '/courses',
        {
          title: 'Hacked Course',
          description: 'Should fail',
          price: 10,
        },
        studentToken
      );
      if (unauthorizedCourse.status !== 403) {
        throw new Error(`RBAC check failed: status ${unauthorizedCourse.status}`);
      }
      console.log('✅ 5. RBAC Protection (Student forbidden from creating courses): PASSED');

      // 6. Instructor can create course
      const newCourse = await makeRequest(
        'POST',
        '/courses',
        {
          title: 'Automated Test Course',
          description: 'Created by automated test suite',
          price: 29.99,
          category: 'Development',
          level: 'Beginner',
          learningOutcomes: [
            'Build a complete full-stack application.',
            'Secure the application with JWT and RBAC.',
          ],
        },
        instructorToken
      );
      if (newCourse.status !== 201 || newCourse.body.data?.title !== 'Automated Test Course') {
        throw new Error(`Instructor course creation failed: ${JSON.stringify(newCourse)}`);
      }
      const createdCourseId = newCourse.body.data.id;
      if (!Array.isArray(newCourse.body.data?.learningOutcomes) || newCourse.body.data.learningOutcomes.length !== 2) {
        throw new Error(`Learning outcomes were not saved on course creation: ${JSON.stringify(newCourse)}`);
      }
      console.log('✅ 6. Instructor Course Creation with Learning Outcomes: PASSED');

      // 7. Instructor can edit What You'll Master
      const updatedCourse = await makeRequest(
        'PATCH',
        `/courses/${createdCourseId}`,
        {
          learningOutcomes: [
            'Build a production-ready full-stack application.',
            'Deploy and secure the application.',
            'Optimize PostgreSQL queries.',
          ],
        },
        instructorToken
      );
      if (updatedCourse.status !== 200 || updatedCourse.body.data?.learningOutcomes?.length !== 3) {
        throw new Error(`Learning outcomes update failed: ${JSON.stringify(updatedCourse)}`);
      }
      console.log('✅ 7. Instructor Learning Outcomes Edit: PASSED');

      // 8. Instructor cannot purchase their own course
      const selfOrderRes = await makeRequest(
        'POST',
        '/orders',
        { courseId: createdCourseId },
        instructorToken
      );
      if (selfOrderRes.status !== 403) {
        throw new Error(`Instructor self-purchase protection failed: ${JSON.stringify(selfOrderRes)}`);
      }
      console.log('✅ 8. Instructor Self-Purchase Protection: PASSED');

      // 8. Student creates order for course
      const orderRes = await makeRequest(
        'POST',
        '/orders',
        { courseId: createdCourseId },
        studentToken
      );
      if (orderRes.status !== 201 || orderRes.body.data?.status !== 'PENDING') {
        throw new Error(`Order creation failed: ${JSON.stringify(orderRes)}`);
      }
      const orderId = orderRes.body.data.id;
      if (orderRes.body.data.amount !== 29.99) {
        throw new Error('Order amount did not match DB course price');
      }
      console.log(`✅ 9. Order Creation with Server Price Check (₹${orderRes.body.data.amount}): PASSED`);

      // 8. Confirm Mock Payment
      const mockPayRes = await makeRequest(
        'POST',
        `/orders/${orderId}/mock-pay`,
        {},
        studentToken
      );
      if (
        mockPayRes.status !== 200 ||
        mockPayRes.body.data?.order?.status !== 'PLACED' ||
        mockPayRes.body.data?.payment?.status !== 'SUCCESS' ||
        !mockPayRes.body.data?.transactionId?.startsWith('MOCK_TXN_') ||
        !mockPayRes.body.data?.enrollment
      ) {
        throw new Error(`Mock payment failed: ${JSON.stringify(mockPayRes)}`);
      }
      console.log(`✅ 10. Mock Payment Confirmation (Txn: ${mockPayRes.body.data.transactionId}): PASSED`);

      // 9. Prevent Duplicate Enrollment
      const duplicateOrderRes = await makeRequest(
        'POST',
        '/orders',
        { courseId: createdCourseId },
        studentToken
      );
      if (duplicateOrderRes.status !== 400) {
        throw new Error('Duplicate enrollment prevention failed');
      }
      console.log('✅ 11. Duplicate Enrollment Prevention: PASSED');

      // 10. Student Enrollments List
      const enrollmentsRes = await makeRequest('GET', '/enrollments/me', null, studentToken);
      if (enrollmentsRes.status !== 200 || !enrollmentsRes.body.data?.length) {
        throw new Error('Fetch enrollments failed');
      }
      console.log(`✅ 12. Student Enrollments Listing: PASSED`);

      console.log('\n========================================');
      console.log('🎉 ALL 12 BACKEND INTEGRATION TESTS PASSED!');
      console.log('========================================\n');
    } catch (err) {
      console.error('❌ Test execution error:', err);
    } finally {
      server.close(() => process.exit(0));
    }
  });
}

runTests();
