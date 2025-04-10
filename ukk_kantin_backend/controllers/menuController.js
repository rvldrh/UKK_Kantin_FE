const { Menu, Diskon, Stan } = require('../models/main.model');

exports.getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find().populate('id_stan');
        res.status(200).json({
            status: 'success',
            data: menu
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


exports.createMenu = async (req, res) => {
    const adminStanId = req.user.id;
    const stan = await Stan.findOne({ id_user: adminStanId });
    try {
      if (req.file) {
        req.body.foto = req.file.filename;
      }
      req.body.id_stan = stan._id; // Tambahkan id_stan
      const newMenu = await Menu.create(req.body);
      res.status(201).json(newMenu);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

exports.updateMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json({
            status: 'success',
            data: menu
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.deleteMenu = async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
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

exports.getMenuWithDiskon = async (req, res) => {
    try {
        const menus = await Menu.find()
            .populate('id_stan', 'nama_stan');

        const currentDate = new Date();
        const activeDiskon = await Diskon.find({
            tanggal_awal: { $lte: currentDate },
            tanggal_akhir: { $gte: currentDate }
        });

        const diskonMap = activeDiskon.reduce((acc, diskon) => {
            acc[diskon.id_stan.toString()] = diskon;
            return acc;
        }, {});

        const menusWithDiskon = menus.map(menu => {
            const menuObj = menu.toObject();
            const stanDiskon = diskonMap[menuObj.id_stan._id.toString()];

            if (stanDiskon) {
                const hargaAsli = menuObj.harga;
                const potonganDiskon = (hargaAsli * stanDiskon.persentase_diskon) / 100;
                const hargaSetelahDiskon = hargaAsli - potonganDiskon;

                return {
                    ...menuObj,
                    diskon: {
                        nama_diskon: stanDiskon.nama_diskon,
                        persentase: stanDiskon.persentase_diskon,
                        harga_asli: hargaAsli,
                        harga_setelah_diskon: hargaSetelahDiskon,
                        potongan: potonganDiskon,
                        berlaku_sampai: stanDiskon.tanggal_akhir
                    }
                };
            }
            return menuObj;
        });

        const menuGrouped = {
            makanan: menusWithDiskon.filter(m => m.jenis === 'makanan'),
            minuman: menusWithDiskon.filter(m => m.jenis === 'minuman')
        };

        res.status(200).json({
            status: 'success',
            data: {
                grouped: menuGrouped,
                all: menusWithDiskon
            }
        });

    } catch (error) {
        console.error('Get Menu With Diskon Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


exports.getMenuByStan = async (req, res) => {
    try {
        const { stanId } = req.params;
        const currentDate = new Date();

        const menus = await Menu.find({ id_stan: stanId })
            .populate('id_stan', 'nama_stan');

        const activeDiskon = await Diskon.findOne({
            id_stan: stanId,
            tanggal_awal: { $lte: currentDate },
            tanggal_akhir: { $gte: currentDate }
        });

        const menusWithDiskon = menus.map(menu => {
            const menuObj = menu.toObject();

            if (activeDiskon) {
                const hargaAsli = menuObj.harga;
                const potonganDiskon = (hargaAsli * activeDiskon.persentase_diskon) / 100;
                const hargaSetelahDiskon = hargaAsli - potonganDiskon;

                return {
                    ...menuObj,
                    diskon: {
                        nama_diskon: activeDiskon.nama_diskon,
                        persentase: activeDiskon.persentase_diskon,
                        harga_asli: hargaAsli,
                        harga_setelah_diskon: hargaSetelahDiskon,
                        potongan: potonganDiskon,
                        berlaku_sampai: activeDiskon.tanggal_akhir
                    }
                };
            }
            return menuObj;
        });

        const menuGrouped = {
            makanan: menusWithDiskon.filter(m => m.jenis === 'makanan'),
            minuman: menusWithDiskon.filter(m => m.jenis === 'minuman')
        };

        res.status(200).json({
            status: 'success',
            data: {
                stan: menus[0]?.id_stan,
                diskon: activeDiskon,
                menu: {
                    grouped: menuGrouped,
                    all: menusWithDiskon
                }
            }
        });

    } catch (error) {
        console.error('Get Menu By Stan Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}; 