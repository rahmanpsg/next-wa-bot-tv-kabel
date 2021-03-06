import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  FormEvent,
  HTMLInputTypeAttribute,
} from "react";
import { connect } from "react-redux";
import Layout from "@/components/Layout";

import {
  getUsers,
  addUser,
  editUser,
  deleteUser,
  resetUser,
  setStatusUser,
} from "@/store/user/action";

import Alert from "@/components/Alert";
import TableCustom from "@/components/TableCustom";
import ModalDetail from "@/components/ModalDetail";
import ModalForm from "@/components/ModalForm";
import ModalAksi from "@/components/ModalAksi";

import { TiUserAdd, TiWarning } from "react-icons/ti";

import { State, UserState } from "@/types";
import { Irow } from "react-tailwind-table";

type PelangganProps = {
  userState: UserState;
  getUsers: () => void;
  addUser: (formData: FormData) => void;
  setStatusUser: (status: boolean, id: string) => void;
  editUser: (formData: FormData, id: string) => void;
  deleteUser: (id: string) => void;
  resetUser: () => void;
};

export type HeadersType = {
  name: string;
  text: string;
  type?: HTMLInputTypeAttribute;
};

const Pelanggan = (props: PelangganProps) => {
  const [loading, setLoading] = useState(false);
  const [idUserSelected, setIdUserSelected] = useState(undefined);
  const [aksi, setAksi] = useState("");
  const [messageAksi, setMessageAksi] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const modalDetailRef = useRef<HTMLInputElement>(null);
  const modalFormRef = useRef<HTMLInputElement>(null);
  const modalAksiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!props.userState.users.length) setLoading(true);
    props.getUsers();
  }, []);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }

    if (props.userState.errors !== null) return;

    if (aksi == "") return;

    if (modalFormRef.current?.checked) {
      modalFormRef.current?.click();
    } else if (modalAksiRef.current?.checked) {
      modalAksiRef.current?.click();
    }

    if (showMessage) return;

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      props.resetUser();
    }, 4000);
  }, [props.userState]);

  useEffect(() => {
    switch (aksi) {
      case "hapus":
        setMessageAksi("Data pelanggan akan di hapus?");
        break;
      case "aktif":
        setMessageAksi("Data pelanggan akan di aktifkan?");
        break;
      case "nonaktif":
        setMessageAksi("Data pelanggan akan di nonaktifkan?");
        break;
    }
  }, [aksi]);

  const submitForm = async (e?: FormEvent) => {
    e?.preventDefault();

    const data = new FormData(formRef.current!);

    try {
      setLoading(true);
      switch (aksi) {
        case "tambah":
          props.addUser(data);
          break;
        case "edit":
          props.editUser(data, idUserSelected!);
          break;
        case "hapus":
          props.deleteUser(idUserSelected!);
          break;
        case "aktif":
          props.setStatusUser(true, idUserSelected!);
          break;
        case "nonaktif":
          props.setStatusUser(false, idUserSelected!);
          break;
      }
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

  const statusClick = (row: Irow, aktif: boolean) => {
    setIdUserSelected(row._id);
    setAksi(aktif ? "aktif" : "nonaktif");
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

  const hapusClick = (row: Irow) => {
    setIdUserSelected(row._id);
    setAksi("hapus");
  };

  const headers: HeadersType[] = [
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
      name: "aktif",
      text: "Status",
    },
    {
      name: "aksi",
      text: "Aksi",
    },
  ];

  return (
    <div className="container outline outline-1 outline-gray-300 rounded p-2">
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
            className="max-w-xs animate-backInOutRight alert-sm"
          />
        )}
      </div>

      <TableCustom
        headers={headers}
        data={props.userState.users}
        statusClick={statusClick}
        editClick={editClick}
        hapusClick={hapusClick}
      />

      <ModalDetail modalRef={modalDetailRef} id={idUserSelected} />

      <ModalForm
        modalRef={modalFormRef}
        formRef={formRef}
        state={props.userState}
        headers={headers}
        aksi={aksi}
        loading={loading}
        submitForm={submitForm}
      />

      <ModalAksi
        modalRef={modalAksiRef}
        icon={<TiWarning size={50} className="text-warning" />}
        message={messageAksi}
        loading={loading}
        submit={submitForm}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  userState: state.userState,
});

const mapActionsToProps = {
  getUsers,
  addUser,
  setStatusUser,
  editUser,
  deleteUser,
  resetUser,
};

Pelanggan.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Pelanggan);
