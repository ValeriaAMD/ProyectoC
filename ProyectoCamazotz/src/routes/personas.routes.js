import {Router} from 'express'
import pool from '../database.js'

const router = Router();

router.get('/add', (req,res)=>{
    res.render('alumnos/add');
});

router.post('/add', async(req, res)=>{
    try{
        const {nombre, apellido, fecha_nacimiento, email, telefono, direccion} = req.body;
        const newPersona = {
            nombre, apellido, fecha_nacimiento, email, telefono, direccion
        }
        await pool.query('INSERT INTO alumnos SET ?', [newPersona]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/list', async(req, res)=>{
    try{
        const [result] = await pool.query('SELECT * FROM alumnos');
        res.render('alumnos/list', {alumnos: result});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/edit/:id_alumno', async(req, res)=>{
    try{
        const {id_alumno} = req.params;
        const [alumno] = await pool.query('SELECT * FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        const alumnoEdit = alumno[0];
        res.render('alumnos/edit', {alumno: alumnoEdit});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.post('/edit/:id_alumno', async(req, res)=>{
    try{
        const {nombre, apellido, fecha_nacimiento, email, telefono, direccion} = req.body;
        const {id_alumno} = req.params;
        const editalumno = {nombre, apellido, fecha_nacimiento, email, telefono, direccion};
        await pool.query('UPDATE alumnos SET ? WHERE id_alumno = ?', [editalumno, id_alumno]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/delete/:id_alumno', async(req, res)=>{
    try{
        const {id_alumno} = req.params;
        await pool.query('DELETE FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
export default router;