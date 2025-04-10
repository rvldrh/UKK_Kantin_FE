"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stanService } from "@/app/services/stan.service";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-hot-toast";

export const ProfileStan = () => {
  const [openModal, setOpenModal] = useState(false);
  const [stanData, setStanData] = useState(null);
  const [stanForm, setStanForm] = useState({
    nama_stan: "",
    nama_pemilik: "",
    telp: "",
  });

  const queryClient = useQueryClient();

  const { data: stan, isLoading } = useQuery({
    queryKey: ["stanUser"],
    queryFn: async () => {
      return await stanService.getByUser();
    },
  });

  useEffect(() => {
    if (stan) {
      setStanData(stan.data);
      setStanForm({
        nama_stan: stan.data.nama_stan || "",
        nama_pemilik: stan.data.nama_pemilik || "",
        telp: stan.data.telp || "",
      });
    }
  }, [stan]);

  const updateStanMutation = useMutation({
    mutationFn: async (formData) => {
      return await stanService.update(stanData._id, formData);
    },
    onSuccess: () => {
      toast.success("Profil Stan berhasil diperbarui!");
      queryClient.invalidateQueries(["stanUser"]);
      setOpenModal(false);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Gagal memperbarui profil stan.";
      
      if (errorMessage.includes("Stan dengan nama")) {
        toast.error(errorMessage); 
      } else {
        toast.error("Terjadi kesalahan, coba lagi nanti.");
      }
    },
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setStanForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    updateStanMutation.mutate(stanForm);
  };

  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" gutterBottom align="center">
        Profil Stan
      </Typography>

      {isLoading ? (
        <Typography align="center">Memuat data...</Typography>
      ) : stanData ? (
        <Card sx={{ maxWidth: 500, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5">{stanData.nama_stan}</Typography>
            <Typography variant="body1" color="textSecondary">
              Pemilik: {stanData.nama_pemilik}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No. Telepon: {stanData.telp}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() => setOpenModal(true)}
            >
              Edit Profil
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography align="center">Stan tidak ditemukan</Typography>
      )}

      {/* Modal Edit Profil Stan */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Edit Profil Stan</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            name="nama_stan"
            label="Nama Stan"
            value={stanForm.nama_stan}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="dense"
            name="nama_pemilik"
            label="Nama Pemilik"
            value={stanForm.nama_pemilik}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="dense"
            name="telp"
            label="No. Telepon"
            value={stanForm.telp}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Batal</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
