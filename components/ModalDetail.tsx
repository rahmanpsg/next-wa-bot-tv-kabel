type ModalPelangganProps = {
  modalRef: React.RefObject<HTMLInputElement>;
  id?: string;
};

const ModalPelanggan = (props: ModalPelangganProps) => {
  return (
    <>
      <input
        type="checkbox"
        id="my-modal-detail"
        className="modal-toggle"
        ref={props.modalRef}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-detail"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Detail Pelanggan</h3>
          <div className="flex p-4 self-center">
            <div className="tabs">
              <a className="tab tab-lifted tab-active">Pengaduan</a>
              <a className="tab tab-lifted">Pembayaran</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalPelanggan;
