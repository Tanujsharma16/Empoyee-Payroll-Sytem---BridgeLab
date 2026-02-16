const express = require('express');
const fileHandler = require('./modules/fileHandler');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


//  Dashboard
app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
    res.render('index', { employees });
});


//  Add form page
app.get('/add', (req, res) => {
    res.render('add');
});


//  Add employee
app.post('/add', async (req, res) => {
    const { name, department, salary } = req.body;

    if (!name || salary < 0) {
        return res.send("Invalid input");
    }

    const employees = await fileHandler.read();

    employees.push({
        id: Date.now(),
        name,
        department,
        salary: Number(salary)
    });

    await fileHandler.write(employees);
    res.redirect('/');
});


//  Delete employee
app.get('/delete/:id', async (req, res) => {
    let employees = await fileHandler.read();

    employees = employees.filter(emp => emp.id != req.params.id);

    await fileHandler.write(employees);
    res.redirect('/');
});


//  Edit form
app.get('/edit/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const employee = employees.find(emp => emp.id == req.params.id);

    res.render('edit', { employee });
});


//  Update employee
app.post('/edit/:id', async (req, res) => {
    const { name, department, salary } = req.body;

    let employees = await fileHandler.read();

    employees = employees.map(emp =>
        emp.id == req.params.id
            ? { ...emp, name, department, salary: Number(salary) }
            : emp
    );

    await fileHandler.write(employees);
    res.redirect('/');
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});