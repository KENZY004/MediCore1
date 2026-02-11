const axios = require('axios');

const login = async (email, password, description) => {
    try {
        console.log(`Testing: ${description}`);
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
        });
        console.log(`[SUCCESS] Login succeeded for ${email}`);
        console.log('User Type:', response.data.user?.userType);
    } catch (error) {
        if (error.response) {
            console.log(`[EXPECTED] Login failed: ${error.response.status}`);
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`[ERROR] Request failed: ${error.message}`);
        }
    }
    console.log('---');
};

const runTests = async () => {
    // 1. Valid Admin
    await login('kenznajeeb@gmail.com', 'admin123', 'Valid Admin Info');

    // 2. Non-existent User
    await login('fake@test.com', 'fakepass', 'Non-existent User');

    // 3. Random String
    await login('random', 'random', 'Random String');

    // 4. Empty Credentials
    await login('', '', 'Empty Credentials');

    // 5. Register and Try Login (Pending Status)
    try {
        const rand = Math.floor(Math.random() * 10000);
        const hospitalData = {
            name: `Test Hospital ${rand}`,
            email: `hospital${rand}@test.com`,
            password: 'password123',
            phone: '1234567890',
            registrationNumber: `REG${rand}`,
            licenseNumber: `LIC${rand}`,
            address: { street: 'Main St', city: 'City', state: 'State', pincode: '123456' },
            adminContact: { name: 'Admin', email: `admin${rand}@test.com`, phone: '1234567890' }
        };

        console.log(`Registering hospital: ${hospitalData.email}`);
        await axios.post('http://localhost:5000/api/hospitals/register', hospitalData);

        console.log('Attempting login with pending hospital...');
        await login(hospitalData.email, hospitalData.password, 'Pending Hospital Login');

    } catch (error) {
        console.log(`[ERROR] Registration failed: ${error.message} ${error.response ? JSON.stringify(error.response.data) : ''}`);
    }
};

runTests();
