
require('dotenv').config();
const mongoose = require('mongoose');

const dbState = [{
    value: 0,
    label: "Disconnected"
},
{
    value: 1,
    label: "Connected"
},
{
    value: 2,
    label: "Connecting"
},
{
    value: 3,
    label: "Disconnecting"
}];


const connection = async () => {
    try { 
        await mongoose.connect(process.env.MONGO_DB_URL, { 
            //useNewUrlParser: true, 
            //useUnifiedTopology: true
        }); 
        const state = Number(mongoose.connection.readyState); 
        console.log(dbState.find(f => f.value === state).label, "to database");
        } 
        catch (error) { 
            console.error('Error connect to DB: ', error); 
            process.exit(1); 
        }
}
module.exports = connection;
