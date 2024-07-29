import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/addMens', (req, res) => {
    res.render('mensualidades/addMens', { message: null });
});

router.post('/addMens', async (req, res) => {
    try {
        const { id_alumno, fecha_pago, monto } = req.body;

        // valida si el id del estudiante existe
        const [alumno] = await pool.query('SELECT * FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        if (alumno.length === 0) {
            return res.render('mensualidades/addMens', {
                message: 'El ID del alumno no existe.',
            });
        }

        const newMens = { id_alumno, fecha_pago, monto };
        await pool.query('INSERT INTO mensualidades SET ?', [newMens]);
        res.redirect('/listMens');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/listMens', async (req, res) => {
    try {
        const { id_alumno } = req.query;
        let query = 'SELECT * FROM mensualidades';
        let queryParams = [];

        if (id_alumno) {
            query += ' WHERE id_alumno = ?';
            queryParams.push(id_alumno);
        }

        const [mensual] = await pool.query(query, queryParams);
        res.render('mensualidades/listMens', { mensual });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/editMens/:id_mensualidad', async (req, res) => {
    try {
        const { id_mensualidad } = req.params;
        const [mensuali] = await pool.query('SELECT * FROM mensualidades WHERE id_mensualidad = ?', [id_mensualidad]);
        //vuelve a validar
        if (mensuali.length === 0) {
            return res.render('mensualidades/editMens', {
                message: 'La mensualidad no existe.',
                mensuali: null,
            });
        }

        const mensualiEdit = mensuali[0];
        res.render('mensualidades/editMens', { mensuali: mensualiEdit, message: null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editMens/:id_mensualidad', async (req, res) => {
    try {
        const { id_alumno, fecha_pago, monto } = req.body;
        const { id_mensualidad } = req.params;

        const [alumno] = await pool.query('SELECT * FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        if (alumno.length === 0) {
            return res.render('mensualidades/editMens', {
                message: 'El ID del alumno no existe.',
                mensuali: null,
            });
        }

        const editmensual = { id_alumno, fecha_pago, monto };
        await pool.query('UPDATE mensualidades SET ? WHERE id_mensualidad = ?', [editmensual, id_mensualidad]);
        res.redirect('/listMens');
    } catch (err) {
        res.status (500).json({ message: err.message });
    }
});

router.get('/deleteM/:id_mensualidad', async (req, res) => {
    try {
        const { id_mensualidad } = req.params;
        await pool.query('DELETE FROM mensualidades WHERE id_mensualidad = ?', [id_mensualidad]);
        res.redirect('/listMens');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

