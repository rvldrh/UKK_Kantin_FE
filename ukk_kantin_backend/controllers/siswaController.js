const { Siswa } = require('../models/main.model');


exports.getAllSiswa = async (req, res) => {
    try {
        const siswa = await Siswa.find();
        res.status(200).json({
            status: 'success',
            data: siswa
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


exports.createSiswa = async (req, res) => {
    try {
        const newSiswa = await Siswa.create({
            nama_siswa: req.body.nama_siswa,
            alamat: req.body.alamat,
            telp: req.body.telp,
            foto: req.body.foto,
            id_user: req.body.id_user
        });
        res.status(201).json({
            status: 'success',
            data: newSiswa
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};


exports.updateSiswa = async (req, res) => {
    try {
        const siswa = await Siswa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json({
            status: 'success',
            data: siswa
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};


exports.deleteSiswa = async (req, res) => {
    try {
        await Siswa.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}; 