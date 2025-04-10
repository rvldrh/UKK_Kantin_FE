  import React, { useRef } from "react";
  import { useReactToPrint } from "react-to-print";
  import { format } from "date-fns";
  import { id } from "date-fns/locale";

  export const NotaPembayaran = ({ transaksi, detailTransaksi, onClose }) => {
    const notaRef = useRef(null);

    console.log(notaRef);

    const handlePrint = useReactToPrint({
      contentRef: notaRef,
      documentTitle: `Nota_${transaksi?._id || "Transaksi"}`,
      onBeforePrint: async () => { 
        if (!notaRef.current) {
          console.error("Elemen notaRef tidak ditemukan!");
          throw new Error("There is nothing to print");
        }
      },
      onAfterPrint: () => console.log("Printing completed"),
    });
    

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div
          ref={notaRef}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border print:p-10"
        >
          <div className="text-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold">🧾 Nota Pembayaran</h2>
            <p className="text-sm text-gray-500">
              {transaksi?.tanggal
                ? format(new Date(transaksi.tanggal), "dd MMM yyyy, HH:mm", {
                    locale: id,
                  })
                : "Tanggal tidak tersedia"}
            </p>
          </div>
          {transaksi ? (
            <>
              <div className="text-sm text-gray-700 mb-4">
                <p>
                  <strong>ID Transaksi:</strong> {transaksi._id}
                </p>
                <p>
                  <strong>Status:</strong> {transaksi.status}
                </p>
              </div>
              <hr className="my-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Detail Pesanan</h3>
              <table className="w-full text-sm text-gray-700 border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Menu</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {detailTransaksi?.length > 0 ? (
                    detailTransaksi.map((detail) => (
                      <tr key={detail._id} className="border-b">
                        <td className="py-1">
                          {detail?.id_menu?.nama_makanan || "Menu tidak tersedia"}
                        </td>
                        <td className="text-center py-1">{detail.qty}</td>
                        <td className="text-right py-1">
                          Rp {detail.harga_beli.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-gray-500 py-2">
                        Tidak ada detail transaksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <hr className="my-2" />
              <p className="text-lg font-bold text-orange-600 text-right">
                Total: Rp {transaksi.total_akhir.toLocaleString("id-ID")}
              </p>
              <div className="flex justify-between mt-4 print:hidden">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePrint();
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  🖨️ Cetak Nota
                </button>

                <button
                  onClick={onClose}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  ❌ Tutup
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-red-500">
              ⚠️ Data transaksi tidak ditemukan!
            </p>
          )}
        </div>
      </div>
    );
  };
