const express = require('express') 
const env = require('dotenv')
const routes = require('./routes');
const db = require('./config/dbConfig');
const cors=require('cors');


env.config();

const app=express();
app.use(express.json());
app.use(cors({}))
app.use(express.urlencoded({ extended: false }));

db.sequelize.authenticate().then(() => console.log("DB Connected")).catch(e => console.log(e))


app.use(routes)


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
