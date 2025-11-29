// Script para probar el endpoint de registro
async function testRegister() {
  try {
    console.log('Testing registration endpoint...\n');

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ Registration successful!');
      if (data.verificationToken) {
        console.log('\n📧 Verification URL:');
        console.log(`http://localhost:3000/verify-email?token=${data.verificationToken}`);
      }
    } else {
      console.log('\n❌ Registration failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRegister();
