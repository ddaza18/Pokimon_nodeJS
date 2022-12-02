const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const PORT = process.env.PORT || 3050;
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//PASAMOS DE EJS A HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//PARA QUE EXPRESS USE LA CARPETA PUBLIC "ESTILOS,IMAGENES,JS ETC"
app.use(express.static(__dirname + "/public"));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
//CONECTION WITH THE DATABASE
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sisc_node"
});

//ROUTES

app.get("/login",(req,res)=>{
    res.render("login");
    
});
//LOGIN AUTENTICACION
app.post("/auth",(req,res)=>{
    let user = req.body.user;
	let pass = req.body.pass;

    if (user && pass) {
        conexion.query('SELECT * FROM entrenadores WHERE user = ? AND pass = ?',[user,pass],function(error, results, fields) {
            if (error) throw error;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.user = user;
				res.redirect('/pokimon');
                
        
    } else {
        res.redirect('/error')
    }
    res.end();
});
    }else{
        res.send('Ingrese el Usuario y la Contraseña');
        console.log(`SELECT * FROM entrenadores WHERE user = ${req.body.user} AND pass = ${req.body.pass}`);
	res.end();
    }
});



app.get("/",function(req,res){
   res.render("Index");
});
app.get("/error",(req,res)=>{
    res.render("Error");
});

//GET DE LA PAGINA POKIMON
app.get("/pokimon",(req,res)=>{
    res.render("Pokimon");
    
});

//TODOS LOS POKIMONES
app.get('/pokimones', (req, res) => {

    const sql = `SELECT * FROM pokimon`;
    conexion.query(sql, (err, resutl) => {
        if(err) throw error;

        if(resutl.length > 0){
            res.json(resutl);
        }else{
            res.send('No result')
        }
   })
})
//REGISTRO DE POKIMON (SOLO SE MUESTRA EN BD)
app.post("/registrar", async (req,res)=>{
    const nombre = req.body.nombre;
    const raza = req.body.raza;
    const punt_ataque = req.body.punt_ataque;
    const punt_defensa = req.body.punt_defensa;
    
    conexion.query("INSERT INTO pokimon SET ?", {nombre:nombre, raza:raza, punt_ataque:punt_ataque, punt_defensa:punt_defensa}, async (error,results)=>{
        if (error) {
            console.log("Error en el Registro de Datos");
        }else{
            res.redirect('/pokimon'); 
            
        }
    })
});

/////////////////////////////////////////////////////////////////////////


//GET DE LA PAGINA ENTRENADOR
app.get("/entrenador",(req,res)=>{
    res.render("Entrenador");
    
});

//TODOS LOS ENTRENADORES
app.get('/entrenadores' ,(req,res)=>{
    const sql = `SELECT * FROM entrenadores`;
    conexion.query(sql, (err, resutl) => {
        if(err) throw error;

        if(resutl.length > 0){
            res.json(resutl);
        }else{
            res.send('No results')
        }
   })
})
//REGISTRO DE ENTRENADOR (SOLO SE MUESTRA EN BD)
app.post("/registrarEN", async (req, res)=>{
    const user = req.body.user;
    const correo = req.body.correo;
    const direccion = req.body.direccion;
    const pass = req.body.pass;
    
    conexion.query("INSERT INTO entrenadores SET ?", {user:user, correo:correo, direccion:direccion, pass:pass}, async (error,results)=>{
        if (error) {
            console.log("Error en el Registro de Datos");
        }else{
            res.redirect('/entrenador'); 
            
        }
    })
});
//CHECK CONECTION  TO DATABASE
conexion.connect(err=>{
    if (err) throw console.error();{
    }
});

app.listen(PORT,()=>console.log(`Server Running in: http://localhost:${PORT}`));
