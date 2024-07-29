import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/addProduct', (req, res) => {
    res.render('ventas/addProduct', { message: null });
});

router.post('/addProduct', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;
        const newProducto = { nombre, descripcion, precio, stock };
        await pool.query('INSERT INTO productos SET ?', [newProducto]);
        res.redirect('/listProducts');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/listProducts', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM productos');
        res.render('ventas/listProducts', { productos: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/editProduct/:id_producto', async (req, res) => {
    try {
        const { id_producto } = req.params;
        const [producto] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id_producto]);
        //validacion de que el id del producto existe
        if (producto.length === 0) {
            return res.render('ventas/editProduct', { //redirecciona el formulario para que el user lo vuela a intentar
                message: 'El ID del producto no existe.',
                producto: null,
            });
        }

        const productoEdit = producto[0];
        res.render('ventas/editProduct', { producto: productoEdit, message: null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editProduct/:id_producto', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;
        const { id_producto } = req.params;
        const editProduct = { nombre, descripcion, precio, stock };
        
        const [producto] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id_producto]);
        //validacion de que el id del producto existe
        if (producto.length === 0) {
            return res.render('ventas/editProduct', { 
                message: 'El ID del producto no existe.',
                producto: null,
            });
        }

        await pool.query('UPDATE productos SET ? WHERE id_producto = ?', [editProduct, id_producto]);
        res.redirect('/listProducts');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deleteP/:id_producto', async (req, res) => {
    try {
        const { id_producto } = req.params;
        await pool.query('DELETE FROM productos WHERE id_producto = ?', [id_producto]);
        res.redirect('/listProducts');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/addVenta', (req, res) => {
    res.render('ventas/addVenta', { message: null });
});

router.post('/addVenta', async (req, res) => {
    try {
        const { cantidad, fecha_venta, id_producto, id_alumno, total, product_descrip } = req.body;
        const [producto] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id_producto]);
        //valida que el producto existe
        if (producto.length === 0) {
            return res.render('ventas/addVenta', {
                message: 'El ID del producto no existe.',
            });
        }
        const [alumno] = await pool.query('SELECT * FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        //valida que el alumno existe
        if (alumno.length === 0) {
            return res.render('ventas/addVenta', {
                message: 'El ID del alumno no existe.',
            });
        }
        const newVenta = {
            cantidad, fecha_venta, id_producto, id_alumno, total, product_descrip
        }
        await pool.query('INSERT INTO ventas SET ?', [newVenta]);
        res.redirect('/listVentas');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List sales
router.get('/listVentas', async (req, res) => {
    try {
        const [ventas] = await pool.query('SELECT * FROM ventas');
        res.render('ventas/listVentas', { ventas });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;