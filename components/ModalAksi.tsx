import { TiTick, TiTimes } from "react-icons/ti";

type ModalAksiProps = {
  modalRef: React.RefObject<HTMLInputElement>;
  icon: any;
  message: string;
  loading: boolean;
  submit: () => void;
};

const ModalAksi = (props: ModalAksiProps) => {
  return (
    <>
      <input
        type="checkbox"
        id="my-modal-aksi"
        className="modal-toggle"
        ref={props.modalRef}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Informasi</h3>
          <div className="flex py-4 gap-2">
            <div>{props.icon}</div>
            <div className="self-center">{props.message}</div>
          </div>

          <div className="modal-action">
            <label
              htmlFor="my-modal-aksi"
              className="btn btn-primary btn-sm btn-outline"
            >
              <TiTimes size={20} />
              Batal
            </label>
            {props.loading ? (
              <button className="btn btn-outline btn-sm btn-primary loading">
                loading
              </button>
            ) : (
              <button
                className="btn btn-warning btn-sm btn-outline"
                onClick={props.submit}
              >
                <TiTick size={20} />
                Oke
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalAksi;
