const mongoose = require('mongoose');

const uri = 'mongodb+srv://minhakenzyom23_db_user:I6ck9I7QiYyjK9zw@medicore1.rz2tqbv.mongodb.net/medicore?retryWrites=true&w=majority&appName=MediCore1';

console.log('Testing connection to:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR: Could not connect', err);
        process.exit(1);
    });
