const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const User = require('./models/user.js');
const accountController = require('./controllers/accountController');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const passport = require('./passport_local_strategy.js');
const newsRoutes = require('./routes/newsRoutes.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
const auth = require('./middleware/auth.js');

const { connect } = require('./Database_mongoose.js');
require('dotenv').config();

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`MongoDB connected ${MONGO_URI}`);
        startServer();
    })
    .catch(err => console.log(err));

function startServer() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    const store = MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: 'sessions'
    });

    // Express Session
    app.use(
        session({
            secret: 'very secret this is',
            resave: false,
            saveUninitialized: true,
            store: store
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api/auth', auth);

    app.get('/', (req, res) => {
        res.send('Introduction JWT Auth');
    });

    app.get('/api/profile', passport.authenticate('jwt', { session: false }), accountController.profile);
    app.post('/api/login', passport.authenticate('local', { session: false }), accountController.login);
    app.post('/api/register', accountController.register);

    app.use('/api/news', newsRoutes);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
