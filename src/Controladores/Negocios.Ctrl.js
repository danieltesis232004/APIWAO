import { sql } from '../bd.js';


export const crearNegocio = async (req, res) => {

    try {

        const id_usuario = req.usuario.id_usuario;

        const {
            id_tipo_negocio,
            nombre,
            descripcion,
            ubicacion,
            tarifa,
            latitud,
            longitud,
            telefono,
            sitio_web
        } = req.body;

        const [result] = await sql.query(
            `INSERT INTO Negocios(
                id_usuario,
                id_tipo_negocio,
                nombre,
                descripcion,
                ubicacion,
                tarifa,
                latitud,
                longitud,
                telefono,
                sitio_web
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_usuario,
                id_tipo_negocio,
                nombre,
                descripcion,
                ubicacion,
                tarifa,
                latitud,
                longitud,
                telefono,
                sitio_web
            ]
        );

        res.status(201).json({
            success: true,
            id_negocio: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// =======================
// TODOS LOS NEGOCIOS
// =======================
export const obtenerNegocios = async (req, res) => {

    try {

        const [negocios] = await sql.query(
            `SELECT *
             FROM Negocios
             WHERE estado = 1
             ORDER BY fecha_registro DESC`
        );

        res.json(negocios);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// =======================
// NEGOCIO POR ID
// =======================
export const obtenerNegocio = async (req, res) => {

    try {

        const { id_negocio } = req.params;

        const [negocio] = await sql.query(
            `SELECT *
             FROM Negocios
             WHERE id_negocio = ?`,
            [id_negocio]
        );

        if (negocio.length === 0) {

            return res.status(404).json({
                success: false,
                message: 'Negocio no encontrado'
            });

        }

        res.json(negocio[0]);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// =======================
// MIS NEGOCIOS
// =======================
export const misNegocios = async (req, res) => {

    console.log("ENTRO A MIS NEGOCIOS");
    console.log(req.usuario);

    try {

        const id_usuario = req.usuario.id_usuario;

        const [negocios] = await sql.query(
            `SELECT *
             FROM Negocios
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        res.json(negocios);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// =======================
// ACTUALIZAR NEGOCIO
// =======================
export const actualizarNegocio = async (req, res) => {

    try {

        const { id_negocio } = req.params;
        const id_usuario = req.usuario.id_usuario;

        const {
            id_tipo_negocio,
            nombre,
            descripcion,
            ubicacion,
            tarifa,
            latitud,
            longitud,
            telefono,
            sitio_web
        } = req.body;

        const [existe] = await sql.query(
            `SELECT id_negocio
             FROM Negocios
             WHERE id_negocio = ?
             AND id_usuario = ?`,
            [
                id_negocio,
                id_usuario
            ]
        );

        if (existe.length === 0) {

            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para editar este negocio'
            });

        }

        await sql.query(
            `UPDATE Negocios
             SET
                id_tipo_negocio=?,
                nombre=?,
                descripcion=?,
                ubicacion=?,
                tarifa=?,
                latitud=?,
                longitud=?,
                telefono=?,
                sitio_web=?
             WHERE id_negocio=?`,
            [
                id_tipo_negocio,
                nombre,
                descripcion,
                ubicacion,
                tarifa,
                latitud,
                longitud,
                telefono,
                sitio_web,
                id_negocio
            ]
        );

        res.json({
            success: true,
            message: 'Negocio actualizado'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// =======================
// ELIMINAR NEGOCIO
// =======================
export const eliminarNegocio = async (req, res) => {

    try {

        const { id_negocio } = req.params;
        const id_usuario = req.usuario.id_usuario;

        const [existe] = await sql.query(
            `SELECT id_negocio
             FROM Negocios
             WHERE id_negocio = ?
             AND id_usuario = ?`,
            [
                id_negocio,
                id_usuario
            ]
        );

        if (existe.length === 0) {

            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este negocio'
            });

        }

        await sql.query(
            `UPDATE Negocios
             SET estado = 0
             WHERE id_negocio = ?`,
            [id_negocio]
        );

        res.json({
            success: true,
            message: 'Negocio eliminado'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};