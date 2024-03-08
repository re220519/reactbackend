const express= require("express");

const cors = require("cors");
const mysql= require("mysql");

const app= express();
app.use(express.json());

app.use(cors());
const db=mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database: "crud"

})
app.get("/", (req,res) =>{
    const sql= "SELECT * FROM forms";
    db.query(sql, (err,data)=>{
        if(err) return res.json("Error");
        return res.json(data)
    })
})
app.post('/create', (req, res) => {
    const sql = "INSERT INTO forms (`Name`, `Email`) VALUES (?, ?)"; // Use backticks around column names
    const values = [
        req.body.name,
        req.body.email
    ];
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Error inserting data into the database" });
        return res.json({ message: "Data inserted successfully", id: result.insertId });
    });
});
app.put('/update/:id', (req, res) => {
    const sql = "UPDATE forms SET `Name`=? , `Email`=? WHERE ID=?"; // Use backticks around column names
    const values = [
        req.body.name,
        req.body.email,
        req.params.id // Get the ID from the URL parameter
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Error updating data in the database" });
        
        // Check if any rows were affected by the update
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Form not found" });
        }

        return res.json({ message: "Data updated successfully", id: req.params.id });
    });
});
app.delete('/forms/:id', (req, res) => {
    const sql = "DELETE FROM forms WHERE ID=?"; // Use backticks around column names
    const values = [
        req.params.id // Get the ID from the URL parameter
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting data from the database" });
        
        // Check if any rows were affected by the delete operation
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Form not found" });
        }

        return res.json({ message: "Data deleted successfully", id: req.params.id });
    });
});

app.listen(8081,() =>{
    console.log("listening");
})