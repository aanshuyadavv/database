const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

const { v4: uuidv4 } = require('uuid');


const express = require('express')
const app = express()

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

const path = require("path")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'anshu@9889'
});


let getRandomUser = () => {
    return [

        faker.datatype.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password()
    ];

}




app.get("/", (req, res) => {
    let q = ` SELECT COUNT(*) FROM userr`;
    try {

        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["COUNT(*)"]
            res.render("home.ejs", { count })
        })

    } catch (err) {

        console.log(err)
        res.send("error")

    }

})

app.get("/user", (req, res) => {
    let q = `SELECT * FROM userr`
    try {

        connection.query(q, (err, users) => {
            if (err) throw err;
            // console.log(users)
            res.render("showUsers.ejs", { users })

        })

    } catch (err) {

        console.log(err)
        res.send("error")

    }
})

app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM userr WHERE id='${id}'`;
    try {

        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0]
            console.log(user)
            res.render("edit.ejs", { user })

        })

    } catch (err) {

        console.log(err)
        res.send("error")

    }

})

app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM userr WHERE id='${id}'`;
    let { password: formPassword, username: newUsername } = req.body;
    try {

        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0]
            if (formPassword != user.password) {
                res.send("wrong password")
            } else {
                let q2 = `UPDATE userr SET username='${newUsername}' WHERE id='${id}' `;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user")
                })
            }

        })

    } catch (err) {

        console.log(err)
        res.send("error")

    }
})

app.post("/user", (req, res) => {
    res.render("add.ejs")
})

app.post("/user/add", (req, res) => {
    const obj = req.body;
    obj.id = uuidv4();
    // console.log(obj);

    const sql = 'INSERT INTO userr (id, username, email, password) VALUES (?, ?, ?, ?)';
    const values = [obj.id, obj.username, obj.email, obj.password];



    try {

        connection.query(sql, values, (err, result) => {
            if (err) throw err; 
            res.redirect("/user")

        });

    } catch (err) {
        res.send('error')

    }
});


app.get("/user/:id", (req, res) => {
    // res.send("delete")
    res.render("delete.ejs")
})

app.delete("/user/delete", (req, res) => {

    let { email: email, password: password } = req.body;
    // console.log(email, password)
    let q = `SELECT * FROM userr WHERE email='${email}'`;

    try {

        connection.query(q, (err, result) => {
            if (err) throw err;
            let data = result[0]

            if (email != data.email && password != data.password) {
                console.log('error apka')



            } else {

                let q2 = `DELETE FROM userr WHERE email='${data.email}'`;

                connection.query(q2, (req, result) => {
                    if (err) throw err;
                    res.redirect("/user")
                })

            }
        })

    } catch (err) {
        console.log("err")
    }
})



app.listen("8080", () => {
    console.log("listening on port 8080")
})
// connection.end();