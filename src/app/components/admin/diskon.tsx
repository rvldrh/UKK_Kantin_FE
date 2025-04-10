"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-hot-toast";

export const DiskonList = () => {
  const [openAdd, setOpenAdd] = useState(false);

  const [newDiskon, setNewDiskon] = useState({
    nama: "",
    persentase: "",
    tanggal_awal: "",
    tanggal_akhir: "",
  });

  const queryClient = useQueryClient();

  const { data: diskonList = [], isLoading } = useQuery({
    queryKey: ["diskonList"],
    queryFn: () => diskonService.getByStanId(),
  });

  const createDiskonMutation = useMutation({
    mutationFn: async (diskonData) => {
      return await diskonService.create(diskonData);
    },
    onSuccess: () => {
      toast.success("Diskon berhasil ditambahkan");
      queryClient.invalidateQueries(["diskonList"]);
      setOpenAdd(false);
      setNewDiskon({
        nama: "",
        persentase: "",
        tanggal_awal: "",
        tanggal_akhir: "",
      });
    },
    onError: () => {
      toast.error("Gagal menambahkan diskon");
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" gutterBottom align="center">
        Daftar Diskon
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama Diskon</TableCell>
                <TableCell>Persentase</TableCell>
                <TableCell>Tanggal Awal</TableCell>
                <TableCell>Tanggal Akhir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diskonList?.data?.map((diskon) => (
                <TableRow key={diskon._id}>
                  <TableCell>{diskon.nama_diskon}</TableCell>
                  <TableCell>{diskon.persentase_diskon}%</TableCell>
                  <TableCell>{formatDate(diskon.tanggal_awal)}</TableCell>
                  <TableCell>{formatDate(diskon.tanggal_akhir)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAdd(true)}
      >
        Tambah Diskon
      </Button>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Tambah Diskon</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Diskon"
            fullWidth
            margin="dense"
            value={newDiskon.nama}
            onChange={(e) =>
              setNewDiskon({ ...newDiskon, nama: e.target.value })
            }
          />
          <TextField
            label="Persentase"
            fullWidth
            margin="dense"
            type="number"
            value={newDiskon.persentase}
            onChange={(e) =>
              setNewDiskon({ ...newDiskon, persentase: e.target.value })
            }
          />
          <TextField
            label="Tanggal Awal"
            fullWidth
            margin="dense"
            type="datetime-local"
            value={newDiskon.tanggal_awal}
            onChange={(e) =>
              setNewDiskon({
                ...newDiskon,
                tanggal_awal: new Date(e.target.value).toISOString(),
              })
            }
            InputLabelProps={{ shrink: true }} 
          />

          <TextField
            label="Tanggal Akhir"
            fullWidth
            margin="dense"
            type="datetime-local"
            value={newDiskon.tanggal_akhir}
            onChange={(e) =>
              setNewDiskon({
                ...newDiskon,
                tanggal_akhir: new Date(e.target.value).toISOString(),
              })
            }
            InputLabelProps={{ shrink: true }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Batal</Button>
          <Button
            onClick={() => createDiskonMutation.mutate(newDiskon)}
            color="primary"
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
