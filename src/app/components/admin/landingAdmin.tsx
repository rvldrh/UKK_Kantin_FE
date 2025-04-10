"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/app/services/menu.service";
import { diskonService } from "@/app/services/diskon.service";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useMutationHandler } from "@/app/utils/useMutationHandler";
import Image from "next/image";

export const LandingAdmin = () => {
  const [stanId, setStanId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [deleteMenu, setDeleteMenu] = useState(null);
  const [menuForm, setMenuForm] = useState({
    nama_makanan: "",
    harga: "",
    jenis: "makanan",
    deskripsi: "",
    foto: null,
    id_diskon: "",
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setStanId(parsedUser.profile._id);
      } catch (error) {
        console.error("Gagal membaca data user:", error);
      }
    }
  }, []);

  const { data: menus = [], isLoading: isLoadingMenus } = useQuery({
    queryKey: ["menus", stanId],
    queryFn: async () => {
      if (!stanId) return [];
      return await menuService.getMenuByIdStand(stanId);
    },
    enabled: !!stanId,
  });

  const { data: diskons = [] } = useQuery({
    queryKey: ["diskons", stanId],
    queryFn: async () => {
      if (!stanId) return [];
      return await diskonService.getByStanId(stanId);
    },
    enabled: !!stanId,
  });

  const addMenuMutation = useMutationHandler({
  mutationFn: async (formData) => await menuService.create(formData),
  onSuccessMessage: "Menu berhasil ditambahkan",
  queryKey: ["menus", stanId],
  onSuccess: () => setOpenModal(false), // ✅ Modal tertutup setelah sukses
});

const updateMenuMutation = useMutationHandler({
  mutationFn: async ({ menuId, formData }) =>
    await menuService.update(menuId, formData),
  onSuccessMessage: "Menu berhasil diperbarui",
  queryKey: ["menus", stanId],
  onSuccess: () => setOpenModal(false), // ✅ Modal tertutup setelah sukses
});


  const deleteMenuMutation = useMutationHandler({
    mutationFn: async (menuId) => await menuService.delete(menuId),
    onSuccessMessage: "Menu berhasil dihapus",
    queryKey: ["menus", stanId],
  });
  const handleUpdateDiskon = (menuId, diskonId) => {
    updateMenuMutation.mutate({
      menuId,
      formData: { id_diskon: diskonId === "" ? null : diskonId },
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMenuForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setMenuForm((prev) => ({ ...prev, foto: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(menuForm).forEach(([key, value]) => {
      if (key === "foto" && value instanceof File) {
        formData.append(key, value);
      } else if (key !== "foto") {
        formData.append(key, value);
      }
    });
    formData.append("id_stan", stanId);

    if (editMenu) {
      updateMenuMutation.mutate({ menuId: editMenu._id, formData });
    } else {
      addMenuMutation.mutate(formData);
    }
  };

  const handleEdit = (menu) => {
    setMenuForm({
      nama_makanan: menu.nama_makanan,
      harga: menu.harga,
      jenis: menu.jenis,
      deskripsi: menu.deskripsi,
      foto: null,
      id_diskon: menu.id_diskon?._id || "",
    });
    setEditMenu(menu);
    setOpenModal(true);
  };

  const handleDelete = (menuId) => {
    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      deleteMenuMutation.mutate(menuId);
    }
  };

  const confirmDeleteMenu = () => {
    if (deleteMenu) {
      deleteMenuMutation.mutate(deleteMenu._id);
    }
  };


  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" gutterBottom align="center">
        Daftar Menu
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditMenu(null);
          setMenuForm({
            nama_makanan: "",
            harga: "",
            jenis: "makanan",
            deskripsi: "",
            foto: null,
            id_diskon: "",
          });
          setOpenModal(true);
        }}
      >
        Tambah Menu
      </Button>
      {isLoadingMenus ? (
        <div className="flex justify-center py-6">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>No</TableCell>
                <TableCell>Foto</TableCell> {/* Tambahkan kolom Foto */}
                <TableCell>Nama Menu</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Diskon</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {menus?.data?.map((menu, index) => (
                <TableRow key={menu._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={`/img/menuImg/${menu.foto}`}
                      alt={menu.nama_makanan}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  </TableCell>
                  <TableCell>{menu.nama_makanan}</TableCell>
                  <TableCell>Rp {menu.harga.toLocaleString()}</TableCell>
                  <TableCell>{menu.jenis}</TableCell>
                  <TableCell>{menu.deskripsi}</TableCell>
                  <TableCell>
                    <Select
                      value={menu.id_diskon?._id || ""}
                      onChange={(e) =>
                        handleUpdateDiskon(menu._id, e.target.value)
                      }
                      displayEmpty
                    >
                      <MenuItem value="">Tanpa Diskon</MenuItem>
                      {diskons?.data?.map((diskon) => (
                        <MenuItem key={diskon._id} value={diskon._id}>
                          {diskon.nama_diskon}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(menu)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(menu._id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{editMenu ? "Edit Menu" : "Tambah Menu"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            name="nama_makanan"
            label="Nama Menu"
            value={menuForm.nama_makanan}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="dense"
            name="harga"
            label="Harga"
            type="number"
            value={menuForm.harga}
            onChange={handleFormChange}
          />
          <Select
            fullWidth
            value={menuForm.jenis}
            name="jenis"
            onChange={handleFormChange}
          >
            <MenuItem value="makanan">Makanan</MenuItem>
            <MenuItem value="minuman">Minuman</MenuItem>
          </Select>
          <TextField
            fullWidth
            margin="dense"
            name="deskripsi"
            label="Deskripsi"
            multiline
            rows={3}
            value={menuForm.deskripsi}
            onChange={handleFormChange}
          />
          {editMenu?.foto && !menuForm.foto && (
            <Image
              src={`/img/menuImg/${editMenu?.foto}`}
              alt="Menu Image"
              layout="responsive"
              width={16}
              height={9}
            />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Batal</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteMenu} onClose={() => setDeleteMenu(null)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus menu{" "}
            <strong>{deleteMenu?.nama_makanan}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMenu(null)}>Batal</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteMenu}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
