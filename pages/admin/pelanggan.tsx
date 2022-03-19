import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  FormEvent,
  HTMLInputTypeAttribute,
} from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout";

import {
  getUsers,
  addUser,
  editUser,
  resetUser,
} from "../../store/user/action";
import { State } from "types";

import { Alert } from "../../components/Alert";
import Table, { Icolumn, Irow, ItableStyle } from "react-tailwind-table";
import "react-tailwind-table/dist/index.css";
import Moment from "react-moment";
import "moment/locale/id";

import {
  TiWarning,
  TiTick,
  TiTimes,
  TiUserAdd,
  TiEdit,
  TiMinusOutline,
  TiArrowRight,
  TiDocumentText,
} from "react-icons/ti";

import { UserState } from "../../types";

type PelangganProps = {
  userState: UserState;
  getUsers: () => void;
  addUser: (formData: FormData) => void;
  editUser: (formData: FormData, id: string) => void;
  resetUser: () => void;
};

type ItemType = {
  name: string;
  text: string;
  type?: HTMLInputTypeAttribute;
};

const Pelanggan = (props: PelangganProps) => {
  const [loading, setLoading] = useState(true);
  const [idUserSelected, setIdUserSelected] = useState(null);
  const [aksi, setAksi] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    props.getUsers();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [props.userState]);

  useEffect(() => {
    if (props.userState.errors !== null) return;

    if (modalRef.current?.checked) {
      modalRef.current?.click();

      if (showMessage) return;

      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 4000);
    }
  }, [props.userState]);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData(formRef.current!);

    try {
      setLoading(true);
      if (aksi == "tambah") props.addUser(data);
      else if (aksi == "edit") props.editUser(data, idUserSelected!);
    } catch (error) {
      console.log(error);
    }
  };

  const tambahClick = () => {
    if (props.userState.error) props.resetUser();
    formRef.current!.reset();
    setAksi("tambah");

    for (let index = 0; index < formRef.current?.children.length!; index++) {
      const input = formRef.current?.children.item(index)?.children.item(1);
      input?.removeAttribute("value");
    }
  };

  const editClick = (row: Irow) => {
    if (props.userState.error) props.resetUser();
    formRef.current!.reset();
    setAksi("edit");

    setIdUserSelected(row._id);

    for (let index = 0; index < formRef.current?.children.length!; index++) {
      const input = formRef.current?.children.item(index)?.children.item(1);
      input?.setAttribute("value", row[input.getAttribute("name")!]);
    }
  };

  const items: ItemType[] = [
    {
      name: "no",
      text: "#",
    },
    {
      name: "nik",
      text: "NIK",
      type: "number",
    },
    {
      name: "nama",
      text: "Nama",
      type: "text",
    },
    {
      name: "telpon",
      text: "Telpon",
      type: "tel",
    },
    {
      name: "alamat",
      text: "Alamat",
      type: "text",
    },
    {
      name: "createdAt",
      text: "Tanggal Daftar",
    },
    {
      name: "aksi",
      text: "Aksi",
    },
  ];

  const getTextItem = (name: string) =>
    items[items.findIndex((item) => item.name == name)].text;

  const columns: Icolumn[] = items.map((item) => {
    return {
      field: item.name,
      use: item.text,
    };
  });

  const rows: Irow[] = props.userState.users.map((user, idx) => {
    return { no: idx + 1, ...user };
  });

  const rowcheck = (row: Irow, column: Icolumn, display_value: any) => {
    if (column.field === "createdAt") {
      return (
        <Moment format="llll" locale="id">
          {display_value}
        </Moment>
      );
    } else if (column.field === "aksi") {
      return (
        <div className="flex gap-2">
          <div className="tooltip" data-tip="Lihat Data Pelanggan">
            <button className="btn btn-sm btn-outline btn-primary text-white">
              <TiDocumentText size={18} />
            </button>
          </div>
          <div className="tooltip" data-tip="Ubah Data Pelanggan">
            <label
              onClick={() => {
                editClick(row);
              }}
              htmlFor="my-modal-form"
              className="btn btn-sm btn-outline btn-warning text-white"
            >
              <TiEdit size={18} />
            </label>
          </div>
          <div className="tooltip" data-tip="Hapus Data Pelanggan">
            <button className="btn btn-sm btn-outline btn-error text-white">
              <TiMinusOutline size={18} />
            </button>
          </div>
        </div>
      );
    }

    if (column.field === "name") {
      return <b>{display_value}</b>;
    }

    return display_value;
  };

  const style: ItableStyle = {
    base_bg_color: "bg-green-700",
    base_text_color: "text-green-600",
    table_head: {
      table_data: "bg-primary",
    },
  };

  return (
    <div className="container">
      <div className="flex md:flex-row flex-col gap-2 justify-between">
        <label
          htmlFor="my-modal-form"
          className="btn btn-success btn-outline gap-1"
          onClick={tambahClick}
        >
          <TiUserAdd size={20} />
          Tambah Pelanggan
        </label>

        {loading && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
          </div>
        )}

        {showMessage && !loading && (
          <Alert
            error={props.userState.error}
            message={props.userState.message!}
            className="max-w-xs animate-backInOutRight"
          />
        )}
      </div>

      <Table
        columns={columns}
        rows={rows}
        row_render={rowcheck}
        per_page={7}
        no_content_text="Tidak ada data"
        styling={style}
      />

      <input
        type="checkbox"
        id="my-modal-form"
        className="modal-toggle"
        ref={modalRef}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">
            {aksi == "tambah" ? "Tambah " : "Ubah "}
            Data Pelanggan
          </h3>
          {loading != true && props.userState.error && (
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
          <form ref={formRef} onSubmit={submitForm} className="py-4">
            {items.map((item) => {
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
                      !loading &&
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
            {loading ? (
              <button className="btn btn-outline btn-sm btn-primary loading">
                loading
              </button>
            ) : (
              <button
                className="btn btn-success btn-sm btn-outline"
                onClick={() => formRef.current!.requestSubmit()}
              >
                <TiTick size={20} />
                {aksi == "tambah" ? "Simpan" : "Ubah"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  userState: state.userState,
});

const mapActionsToProps = {
  getUsers,
  addUser,
  editUser,
  resetUser,
};

Pelanggan.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Pelanggan);
