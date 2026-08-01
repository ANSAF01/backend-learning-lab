const express = require('express');
const path = require('path');
const cors = require('cors')
const multer = require('multer');
const upload = upload = multer({ dest: 'uploads/' });
const userRoutes = require('./routes/userRoutes');
const app = express()
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');

//Auth Middleware
const authenticateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401);

    jwt.verify(token,process.env.JWT_SECRET, (err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.use(express.json()) //Middleware to Parse Json body
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({
    origin: 'https://myfrontend.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
//loggerMiddleware
const loggerMiddleware = (req, res, next) => {
    console.log(` ${[new Date().toISOString()]} ${req.method} ${req.url}`)
    next();
}
app.use(loggerMiddleware)

app.post('/api/upload', upload.single('avatar'), (req, res) => {
    res.json({ file: req.file })
})

app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { category, page } = req.query;
    res.send({ id, category, page })
})

app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
    res.json("You are in Home Page")
})

//Global Error Handler (Must be used After all routes)
app.use((err, req, res, next) => {
    console.log(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))