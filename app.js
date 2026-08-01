const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json()) //Middleware to Parse Json body

//loggerMiddleware
const loggerMiddleware = (req, res, next) => {
    console.log(` ${[new Date().toISOString()]} ${req.method} ${req.url}`)
    next();
}
app.use(loggerMiddleware)

app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    const { category, page } = req.query;
    res.send({ id, category, page })
    console.log(id)
})

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