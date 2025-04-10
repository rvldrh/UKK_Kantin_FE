"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siswaService } from "@/app/services/siswa.service";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SiswaPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nama_siswa: "",
    alamat: "",
    telp: "",
    foto: null,
    previewFoto: "",
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: siswa, isLoading, error } = useQuery({
    queryKey: ["siswa"],
    queryFn: siswaService.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (data) => siswaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["siswa"]);
      setIsModalOpen(false);
      setErrors({});
      toast.success("Siswa berhasil ditambahkan!");
    },
    onError: (err) => setErrors(err.response?.data || {}),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => siswaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["siswa"]);
      setEditingId(null);
      setIsModalOpen(false);
      setErrors({});
      toast.success("Data siswa berhasil diperbarui!");
    },
    onError: (err) => setErrors(err.response?.data || {}),
  });

  const deleteMutation = useMutation({
    mutationFn: siswaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["siswa"]);
      toast.success("Siswa berhasil dihapus!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "previewFoto" && value) {
        formDataToSend.append(key, value);
      }
    });

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setFormData({ ...formData, foto: file, previewFoto: fileReader.result });
      };
      fileReader.readAsDataURL(file);
    } else {
      toast.error("Hanya file gambar yang diperbolehkan!");
    }
  };

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching data</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Data Siswa</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingId(null);
            setFormData({ username: "", password: "", nama_siswa: "", alamat: "", telp: "", foto: null, previewFoto: "" });
            setErrors({});
            setIsModalOpen(true);
          }}
        >
          Tambah Siswa
        </Button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Foto</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Alamat</th>
            <th className="border px-4 py-2">Telepon</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {siswa?.data?.map((item) => (
            <tr key={item._id} className="text-center">
              <td className="border px-4 py-2">
                <img src={`/img/siswaImg/${item.foto}`} alt="Foto Siswa" className="w-16 h-16 object-cover rounded-full mx-auto" />
              </td>
              <td className="border px-4 py-2">{item.nama_siswa}</td>
              <td className="border px-4 py-2">{item.alamat}</td>
              <td className="border px-4 py-2">{item.telp}</td>
              <td className="border px-4 py-2 flex justify-center space-x-2">
                <Button variant="contained" color="warning" onClick={() => {
                  setEditingId(item._id);
                  setFormData({ ...item, foto: null, previewFoto: `/img/siswaImg/${item.foto}` });
                  setErrors({});
                  setIsModalOpen(true);
                }}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => deleteMutation.mutate(item._id)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editingId ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <TextField label="Username" fullWidth variant="outlined" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
            <TextField label="Password" fullWidth variant="outlined" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingId} />
            <TextField label="Nama Siswa" fullWidth variant="outlined" value={formData.nama_siswa} onChange={(e) => setFormData({ ...formData, nama_siswa: e.target.value })} required />
            <TextField label="Alamat" fullWidth variant="outlined" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} required />
            <TextField label="Telepon" fullWidth variant="outlined" value={formData.telp} onChange={(e) => setFormData({ ...formData, telp: e.target.value })} required />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.previewFoto && <img src={formData.previewFoto} alt="Preview" className="w-20 h-20 object-cover rounded-md" />}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">Batal</Button>
          <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">{editingId ? "Update" : "Tambah"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
