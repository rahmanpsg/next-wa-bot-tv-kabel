import { UserState } from "types";

import { TiWarning, TiTick, TiTimes, TiArrowRight } from "react-icons/ti";
import { ItemType } from "pages/admin/pelanggan";
import { FormEvent } from "react";

type ModalFormProps = {
  formRef: React.RefObject<HTMLFormElement>;
  userState: UserState;
  items: ItemType[];
  aksi: string;
  loading: boolean;
  submitForm: (e: FormEvent) => void;
};

const ModalForm = (props: ModalFormProps) => {
  const getTextItem = (name: string) =>
    props.items[props.items.findIndex((item) => item.name == name)].text;

  return (
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box ">
        <h3 className="font-bold text-lg">
          {props.aksi == "tambah" ? "Tambah " : "Ubah "}
          Data Pelanggan
        </h3>
        {props.loading != true && props.userState.error && (
          <div className="alert alert-warning shadow-lg">
            <div>
              <TiWarning size={30} />
              <div>
                <h3 className="font-bold">Informasi</h3>
                {[...props.userState.errors!].map(([name, pesan]) => (
                  <label
                    className="flex justify-item-center gap-2 text-xs"
                    key={name}
                  >
                    <TiArrowRight size={15} />
                    <p>{`${getTextItem(name)} ${pesan}`}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        <form ref={props.formRef} onSubmit={props.submitForm} className="py-4">
          {props.items.map((item) => {
            if (item.type == null) return;
            return (
              <div className="form-control" key={item.text}>
                <label className="label">
                  <span className="label-text">{item.text}</span>
                </label>
                <input
                  type={item.type}
                  name={item.name}
                  placeholder={`Masukkan ${item.text}`}
                  className={`input input-bordered ${
                    !props.loading &&
                    props.userState.errors?.has(item.name) &&
                    "input-error"
                  }`}
                  required
                />
              </div>
            );
          })}
        </form>
        <div className="modal-action">
          <label
            htmlFor="my-modal-form"
            className="btn btn-error btn-sm btn-outline"
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
              className="btn btn-success btn-sm btn-outline"
              onClick={() => props.formRef.current!.requestSubmit()}
            >
              <TiTick size={20} />
              {props.aksi == "tambah" ? "Simpan" : "Ubah"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
