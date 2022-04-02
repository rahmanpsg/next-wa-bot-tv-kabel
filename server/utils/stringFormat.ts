// fungsi untuk format string ke format rupiah
export const formatRupiah = (angka: number) => {
  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);

  return rupiah;
};
