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
    const { name, position, salary, Gender, DateOfJoining } = req.body;
    const employees = await fileHandler.read();
    const newEmployee = {
        id: Date.now(),
        name,
        position,
        Gender,
        DateOfJoining,
        salary: parseFloat(salary)
    };
    employees.push(newEmployee);
    await fileHandler.write(employees);
    res.redirect('/');

 })

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const employees = await fileHandler.read();
    const employee = employees.find(emp => emp.id === parseInt(id));
    if (employee) {
        res.render('edit', { employee });
    } else {
        res.status(404).send('Employee not found');
    }
});

app.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, position, salary, Gender, DateOfJoining } = req.body;
    const employees = await fileHandler.read();
    const index = employees.findIndex(emp => emp.id === parseInt(id));
    if (index !== -1) {
        employees[index] = {
            id: parseInt(id),
            name,
            position,
            salary: parseFloat(salary),
            Gender,
            DateOfJoining
        };
        await fileHandler.write(employees);
        res.redirect('/');
    } else {
        res.status(404).send('Employee not found');
    }
});

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const employees = await fileHandler.read();
    const updatedEmployees = employees.filter(emp => emp.id !== parseInt(id));
    await fileHandler.write(updatedEmployees);
    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const employees = await fileHandler.read();
    const updatedEmployees = employees.filter(emp => emp.id !== parseInt(id));
    await fileHandler.write(updatedEmployees);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
