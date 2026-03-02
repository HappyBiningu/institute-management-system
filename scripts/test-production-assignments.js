// Production Assignments API Test
const PRODUCTION_URL = 'https://rand-training-college-management-system.vercel.app';

async function testProductionAssignments() {
  console.log('🧪 Testing Assignments System on Production...\n');

  try {
    // Test 1: Login to get token
    console.log('1. Testing Authentication...');
    const authResponse = await fetch(`${PRODUCTION_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@randtrainingcollege.com',
        password: 'admin123'
      })
    });

    if (!authResponse.ok) {
      console.log('❌ Authentication failed');
      return;
    }

    const authData = await authResponse.json();
    const token = authData.token;
    console.log('✅ Authentication successful');

    // Test 2: Check assignments API
    console.log('\n2. Testing Assignments API...');
    const assignmentsResponse = await fetch(
      `${PRODUCTION_URL}/api/assignments`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (assignmentsResponse.ok) {
      const assignmentsData = await assignmentsResponse.json();
      console.log(
        `✅ Assignments API working - Found ${assignmentsData.assignments?.length || 0} assignments`
      );
    } else {
      console.log('❌ Assignments API failed');
      const error = await assignmentsResponse.text();
      console.log('Error:', error);
    }

    // Test 3: Check assignment stats API
    console.log('\n3. Testing Assignment Stats API...');
    const statsResponse = await fetch(
      `${PRODUCTION_URL}/api/assignments/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Assignment Stats API working');
      console.log('Stats:', JSON.stringify(statsData.stats, null, 2));
    } else {
      console.log('❌ Assignment Stats API failed');
    }

    // Test 4: Check submissions API
    console.log('\n4. Testing Submissions API...');
    const submissionsResponse = await fetch(
      `${PRODUCTION_URL}/api/assignments/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (submissionsResponse.ok) {
      const submissionsData = await submissionsResponse.json();
      console.log(
        `✅ Submissions API working - Found ${submissionsData.submissions?.length || 0} submissions`
      );
    } else {
      console.log('❌ Submissions API failed');
    }

    console.log('\n🎉 Production testing completed!');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testProductionAssignments();
