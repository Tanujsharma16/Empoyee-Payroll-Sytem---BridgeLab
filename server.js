const express = require('express');
const path = require('path');
const fileHandler = require('./modules/fileHandler');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
    res.render('index', { employees });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', async (req, res) => {
    const { name, position, salary, gender, DateOfJoining } = req.body;

    const employees = await fileHandler.read();

    employees.push({
        id: Date.now(),
        name,
        position,
        gender: gender || "Not set",
        DateOfJoining,
        salary: Number(salary)
    });

    await fileHandler.write(employees);
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const employee = employees.find(e => e.id == req.params.id);
    res.render('edit', { employee });
});

app.post('/edit/:id', async (req, res) => {
    const { name, position, salary, gender, DateOfJoining } = req.body;
    let employees = await fileHandler.read();

    employees = employees.map(emp =>
        emp.id == req.params.id
            ? { ...emp, name, position, gender, salary: Number(salary), DateOfJoining }
            : emp
    );

    await fileHandler.write(employees);
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    let employees = await fileHandler.read();
    employees = employees.filter(emp => emp.id != req.params.id);
    await fileHandler.write(employees);
    res.redirect('/');
});

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);