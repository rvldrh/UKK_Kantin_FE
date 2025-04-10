const {
  Transaksi,
  DetailTransaksi,
  Menu,
  Diskon,
} = require("../models/main.model");

const getActiveDiskon = async (tanggal, id_stan) => {
  try {
    const diskon = await Diskon.findOne({
      id_stan: id_stan,
      tanggal_awal: { $lte: tanggal },
      tanggal_akhir: { $gte: tanggal },
    });
    return diskon;
  } catch (error) {
    console.error("Error getting active diskon:", error);
    return null;
  }
};
exports.getAllTransaksi = async (req, res) => {
  try {
    if (req.user.role === "siswa") {
      return res.status(403).json({
        status: "error",
        message: "Tidak memiliki akses",
      });
    }

    const transaksi = await Transaksi.find()
      .populate("id_stan")
      .populate("id_siswa");

    res.json(transaksi);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createTransaksi = async (req, res) => {
  try {
    const { detail_pesanan } = req.body;

    if (!detail_pesanan || !Array.isArray(detail_pesanan)) {
      return res.status(400).json({
        status: "error",
        message: "Detail pesanan harus diisi",
      });
    }

    const menuDetails = await Promise.all(
      detail_pesanan.map((item) => Menu.findById(item.id_menu))
    );

    const stanId = menuDetails[0].id_stan.toString();
    console.log(menuDetails);
    console.log(stanId);
    const isAllSameStan = menuDetails.every(
      (menu) => menu.id_stan.toString() === stanId.toString()
    );

    if (!isAllSameStan) {
      const uniqueStans = new Set(
        menuDetails.map((menu) => menu.id_stan.toString())
      );
      if (uniqueStans.size > 1) {
        return res.status(400).json({
          status: "error",
          message: "Ada beberapa makanan dari stan yang berbeda",
        });
      }
    }

    let total = 0;
    detail_pesanan.forEach((item, index) => {
      total += menuDetails[index].harga * item.qty;
    });

    const today = new Date().toISOString();

    const cobaDiskon = await Diskon.findOne({
      id_stan: stanId
    });

    console.log("diskon", cobaDiskon);

    const availableDiskon = await Diskon.findOne({
      id_stan: stanId,
      tanggal_awal: { $lte: today },
      tanggal_akhir: { $gte: today },
    });

    console.log("Tanggal:", today);
    console.log("Stan ID:", stanId);
    console.log("availableDiskon", availableDiskon);

    let total_akhir = total;
    let diskonInfo = null;

    if (availableDiskon) {
      const potongan = (total * availableDiskon.persentase_diskon) / 100;
      total_akhir = total - potongan;
      diskonInfo = {
        nama_diskon: availableDiskon.nama_diskon,
        persentase: availableDiskon.persentase_diskon,
        potongan: potongan,
      };
    }

    const transaksi = new Transaksi({
      tanggal: new Date(),
      id_stan: stanId,
      id_siswa: req.user.id,
      total: total,
      total_akhir: total_akhir,
      diskon: diskonInfo,
      status: "belum dikonfirm",
    });

    await transaksi.save();

    const detailTransaksi = detail_pesanan.map((item) => ({
      id_transaksi: transaksi._id,
      id_menu: item.id_menu,
      qty: item.qty,
      harga_beli:
        menuDetails.find((m) => m._id.toString() === item.id_menu.toString())
          .harga * item.qty,
    }));

    await DetailTransaksi.insertMany(detailTransaksi);

    res.status(201).json({
      status: "success",
      data: {
        transaksi,
        detail: detailTransaksi,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["belum dikonfirm", "dimasak", "diantar", "sampai"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Status tidak valid",
      });
    }

    // Update status transaksi
    const transaksi = await Transaksi.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("id_siswa")
      .populate("id_stan");

    if (!transaksi) {
      return res.status(404).json({
        status: "error",
        message: "Transaksi tidak ditemukan",
      });
    }

    const details = await DetailTransaksi.find({ id_transaksi: id }).populate(
      "id_menu"
    );

    res.status(200).json({
      status: "success",
      data: {
        transaksi,
        details,
      },
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
