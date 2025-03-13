import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/addClas', (req, res) => {
    res.render('clases/addClas');
});


router.post('/addClas', async (req, res) => {
    try {
        const { nombre, descripcion, fecha_hora } = req.body;
        const newClase = {
            nombre, descripcion, fecha_hora
        };
        await pool.query('INSERT INTO clases set ?', [newClase]);
        res.redirect('/listClas');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/listClas', async (req, res) => {
    try {
        const [clases] = await pool.query('SELECT * FROM clases');
        console.log(clases); //para saber en la consola si la consulta trae la peticion
        res.render('clases/listClas', { clases });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/editClas/:id_clase', async (req, res) => {
    try {
        const { id_clase } = req.params;
        const [clase] = await pool.query('SELECT * FROM clases WHERE id_clase = ?', [id_clase]);
        const claseEdit = clase[0];
        res.render('clases/editClas', { clase: claseEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editClas/:id_clase', async (req, res) => {
    try {
        const { nombre, descripcion, fecha_hora } = req.body;
        const { id_clase } = req.params;
        const editClase = { nombre, descripcion, fecha_hora };
        await pool.query('UPDATE clases SET ? WHERE id_clase = ?', [editClase, id_clase]);
        res.redirect('/listClas');
    } catch (err) {
        res.status_500.json({ message: err.message });
    }
});

router.get('/deleteC/:id_clase', async (req, res) => {
    try {
        const { id_clase } = req.params;
        await pool.query('DELETE FROM clases WHERE id_clase = ?', [id_clase]);
        res.redirect('/listClas');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rutas para agregar alumnos a las clases

router.get('/addAluClas', (req, res) => {
    res.render('clases/addAluClas', { errorMessage: null });
});

router.post('/addAluClas', async (req, res) => {
    try {
        const { id_alumno, id_clase } = req.body;

        // Validación de existencia de alumno y clase
        const [alumno] = await pool.query('SELECT * FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        const [clase] = await pool.query('SELECT * FROM clases WHERE id_clase = ?', [id_clase]);

        if (alumno.length === 0) {
            return res.render('clases/addAluClas', { errorMessage: 'El ID del alumno no existe.' });
        }
        if (clase.length === 0) {
            return res.render('clases/addAluClas', { errorMessage: 'El ID de la clase no existe.' });
        }

        const newAluClase = {
            id_alumno, id_clase
        };
        await pool.query('INSERT INTO alumnos_clases set ?', [newAluClase]);
        res.redirect('/listClas');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/listAluClas', async (req, res) => {
    try {
        const { id_clase } = req.query; 
        let query = `
            SELECT ac.id_alumno, a.nombre, ac.id_clase, c.nombre AS nombre_clase
            FROM alumnos_clases ac
            JOIN alumnos a ON ac.id_alumno = a.id_alumno
            JOIN clases c ON ac.id_clase = c.id_clase
        `;
        let queryParams = [];

        if (id_clase) {
            query += ' WHERE ac.id_clase = ?'; // Filtrar por ID de clase
            queryParams.push(id_clase);
        }

        const [alclases] = await pool.query(query, queryParams);
        res.render('clases/listAluClas', { alclases });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/editAluClas/:id_alumno_clase', async (req, res) => {
    try {
        const { id_alumno_clase } = req.params;
        const [Aluclas] = await pool.query('SELECT * FROM alumnos_clases WHERE id_alumno_clase = ?', [id_alumno_clase]);
        const aluclaseEdit = Aluclas[0];
        res.render('clases/editAluClas', { Aluclas: aluclaseEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editAluClas/:id_alumno_clase', async (req, res) => {
    try {
        const { id_alumno, id_clase } = req.body;
        const { id_alumno_clase } = req.params;
        const editClaseAl = { id_alumno, id_clase };
        await pool.query('UPDATE alumnos_clases SET ? WHERE id_alumno_clase = ?', [editClaseAl, id_alumno_clase]);
        res.redirect('/listAluClas');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deleteAC/:id_alumno_clase', async (req, res) => {
    try {
        const { id_alumno_clase } = req.params;
        await pool.query('DELETE FROM alumnos_clases WHERE id_alumno_clase = ?', [id_alumno_clase]);
        res.redirect('/listAluClas');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
