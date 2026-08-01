const express = require('express');
const path = require('path');
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json()) //Middleware to Parse Json body
app.use(express.static(path.join(__dirname,'public')))
app.use(cors({
    origin : 'https://myfrontend.com',
    method : ['GET','POST','PUT','DELETE'] ,
    credentials : true
}))
//loggerMiddleware
const loggerMiddleware = (req, res, next) => {
    console.log(` ${[new Date().toISOString()]} ${req.method} ${req.url}`)
    next();
}
app.use(loggerMiddleware)

app.get('api/products/:id', (req, res) => {
    const { id } = req.params;
    const { category, page } = req.query;
    res.send({ id, category, page })
    console.log(id)
})

app.use('/api/users',userRoutes)

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