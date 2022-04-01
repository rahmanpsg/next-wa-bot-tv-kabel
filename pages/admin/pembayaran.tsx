import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  HTMLInputTypeAttribute,
  FormEvent,
} from "react";
import { connect } from "react-redux";
import Layout from "@/components/Layout";

import {
  getAllPembayaran,
  resetPembayaran,
  terimaPembayaran,
  tolakPembayaran,
} from "@/store/pembayaran/action";

import {
  deleteRekening,
  addRekening,
  editRekening,
  getAllRekening,
  resetRekening,
} from "@/store/rekening/action";

import TableCustom from "@/components/TableCustom";

import { State, PembayaranState, RekeningState } from "@/types";
import { Irow } from "react-tailwind-table";
import ModalAksi from "@/components/ModalAksi";
import { TiPlus, TiWarning } from "react-icons/ti";
import Alert from "@/components/Alert";
import ModalForm from "@/components/ModalForm";

type PembayaranProps = {
  pembayaranState: PembayaranState;
  getAllPembayaran: () => void;
  terimaPembayaran: (id: string) => void;
  tolakPembayaran: (id: string) => void;
  resetPembayaran: () => void;
  rekeningState: RekeningState;
  getAllRekening: () => void;
  addRekening: (formData: FormData) => void;
  editRekening: (formData: FormData, id: string) => void;
  deleteRekening: (id: string) => void;
  resetRekening: () => void;
};

export type HeadersType = {
  name: string;
  text: string;
  type?: HTMLInputTypeAttribute;
};

const Pembayaran = (props: PembayaranProps) => {
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState(0);
  const [idPembayaranSelected, setIdPembayaranSelected] = useState(null);
  const [idRekeningSelected, setIdRekeningSelected] = useState(undefined);
  const [aksi, setAksi] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const modalAksiRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const modalFormRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!props.pembayaranState.pembayarans.length) setLoading(true);
    props.getAllPembayaran();
    props.getAllRekening();
  }, []);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [props.pembayaranState.message]);

  useEffect(() => {
    if (props.pembayaranState.message == undefined) return;

    if (modalAksiRef.current?.checked) modalAksiRef.current?.click();

    if (showMessage) return;
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      props.resetPembayaran();
    }, 4000);
  }, [props.pembayaranState.error, props.pembayaranState.message]);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }

    if (props.rekeningState.errors !== null) return;

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
      props.resetRekening();
    }, 4000);
  }, [props.rekeningState]);

  const terimaClick = (row: Irow) => {
    setIdPembayaranSelected(row._id);
    setAksi("terima");
  };

  const tolakClick = (row: Irow) => {
    setIdPembayaranSelected(row._id);
    setAksi("tolak");
  };

  const tambahClick = () => {
    formRef.current!.reset();
    setAksi("tambah");
  };

  const editClick = (row: Irow) => {
    if (props.rekeningState.error) props.resetRekening();
    formRef.current!.reset();
    setAksi("edit");

    setIdRekeningSelected(row._id);

    for (let index = 0; index < formRef.current?.children.length!; index++) {
      const input = formRef.current?.children.item(index)?.children.item(1);
      input?.setAttribute("value", row[input.getAttribute("name")!]);
    }
  };

  const hapusClick = (row: Irow) => {
    setIdRekeningSelected(row._id);
    setAksi("hapus");
  };

  const submitForm = (e?: FormEvent) => {
    e!.preventDefault();

    const data = new FormData(formRef.current!);

    console.log(aksi);

    try {
      setLoading(true);
      switch (aksi) {
        case "terima":
          props.terimaPembayaran(idPembayaranSelected!);
          break;
        case "tolak":
          props.tolakPembayaran(idPembayaranSelected!);
          break;
        case "tambah":
          props.addRekening(data);
          break;
        case "edit":
          props.editRekening(data, idRekeningSelected!);
          break;
        case "hapus":
          props.deleteRekening(idRekeningSelected!);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tabList: Array<String> = [
    "Belum di Konfirmasi",
    "Telah di Konfirmasi",
    "Pengaturan",
  ];

  const headers: HeadersType[] = [
    {
      name: "no",
      text: "#",
    },
    {
      name: "user.nik",
      text: "NIK",
    },
    {
      name: "user.nama",
      text: "Nama",
    },
    {
      name: "createdAt",
      text: "Tanggal Pembayaran",
    },
    {
      name: "foto",
      text: "Bukti Pembayaran",
    },
    {
      name: "konfirmasi",
      text: "Aksi",
    },
  ];

  const headers2: HeadersType[] = [
    ...[...headers].splice(0, 5),
    {
      name: "status",
      text: "Status",
    },
  ];

  const headers3: HeadersType[] = [
    {
      name: "no",
      text: "#",
    },
    {
      name: "nama",
      text: "Nama Rekening",
      type: "text",
    },
    {
      name: "nomor",
      text: "Nomor",
      type: "number",
    },
    {
      name: "aksi2",
      text: "Aksi",
    },
  ];

  return (
    <div className="container">
      <div className="tabs">
        {tabList.map((tab, i) => (
          <a
            key={`tab-${i}`}
            className={`tab tab-lifted sm:tab-md tab-xs ${
              tabActive == i ? "tab-active" : ""
            }`}
            onClick={() => setTabActive(i)}
          >
            {tab}
          </a>
        ))}
      </div>
      <div className="outline outline-1 outline-gray-300 rounded-b rounded-tr p-2">
        <div className="flex flex-col items-end gap-2">
          {loading && (
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <div className="w-8 h-8 bg-primary rounded-full"></div>
            </div>
          )}

          {showMessage && !loading && (
            <Alert
              error={props.pembayaranState.error || props.rekeningState.error}
              message={
                props.pembayaranState.message! || props.rekeningState.message!
              }
              className="max-w-xs animate-backInOutRight alert-sm"
            />
          )}
        </div>

        {tabActive == 0 ? (
          <TableCustom
            headers={headers}
            data={props.pembayaranState.pembayarans.filter(
              (pembayaran) => pembayaran.status == undefined
            )}
            terimaClick={terimaClick}
            tolakClick={tolakClick}
          />
        ) : tabActive == 1 ? (
          <TableCustom
            headers={headers2}
            data={props.pembayaranState.pembayarans.filter(
              (pembayaran) => pembayaran.status != undefined
            )}
          />
        ) : (
          <>
            <label
              htmlFor="my-modal-form"
              className="btn btn-success btn-outline btn-sm gap-1"
              onClick={tambahClick}
            >
              <TiPlus size={20} />
              Tambah Metode Pembayaran
            </label>
            <TableCustom
              headers={headers3}
              data={props.rekeningState.rekenings}
              editClick={editClick}
              hapusClick={hapusClick}
            />
          </>
        )}
      </div>

      <ModalForm
        modalRef={modalFormRef}
        formRef={formRef}
        state={props.rekeningState}
        headers={headers3}
        aksi={aksi}
        loading={loading}
        submitForm={submitForm}
      />

      <ModalAksi
        modalRef={modalAksiRef}
        icon={<TiWarning size={50} className="text-warning" />}
        message={`Data pembayaran akan di${aksi}?`}
        loading={loading}
        submit={submitForm}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  pembayaranState: state.pembayaranState,
  rekeningState: state.rekeningState,
});

const mapActionsToProps = {
  getAllPembayaran,
  terimaPembayaran,
  tolakPembayaran,
  resetPembayaran,
  getAllRekening,
  addRekening,
  editRekening,
  deleteRekening,
  resetRekening,
};

Pembayaran.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Pembayaran);
