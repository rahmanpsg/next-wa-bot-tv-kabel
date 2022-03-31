import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  HTMLInputTypeAttribute,
} from "react";
import { connect } from "react-redux";
import Layout from "@/components/Layout";

import {
  getAllPembayaran,
  resetPembayaran,
  terimaPembayaran,
  tolakPembayaran,
} from "@/store/pembayaran/action";

import TableCustom from "@/components/TableCustom";

import { State, PembayaranState } from "@/types";
import { Irow } from "react-tailwind-table";
import ModalAksi from "@/components/ModalAksi";
import { TiPlus, TiWarning } from "react-icons/ti";
import Alert from "@/components/Alert";

type PembayaranProps = {
  pembayaranState: PembayaranState;
  getAllPembayaran: () => void;
  terimaPembayaran: (id: string) => void;
  tolakPembayaran: (id: string) => void;
  resetPembayaran: () => void;
};

export type HeadersType = {
  name: string;
  text: string;
  type?: HTMLInputTypeAttribute;
};

const Pembayaran = (props: PembayaranProps) => {
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState(0);
  const modalAksiRef = useRef<HTMLInputElement>(null);
  const [idPembayaranSelected, setIdPembayaranSelected] = useState(null);
  const [aksi, setAksi] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!props.pembayaranState.pembayarans.length) setLoading(true);
    props.getAllPembayaran();
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

  const submitAksi = async () => {
    try {
      setLoading(true);
      switch (aksi) {
        case "terima":
          props.terimaPembayaran(idPembayaranSelected!);
          break;
        case "tolak":
          props.tolakPembayaran(idPembayaranSelected!);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const terimaClick = (row: Irow) => {
    setIdPembayaranSelected(row._id);
    setAksi("terima");
  };

  const tolakClick = (row: Irow) => {
    setIdPembayaranSelected(row._id);
    setAksi("tolak");
  };

  const tambahClick = () => {};

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
      text: "Nama",
    },
    {
      name: "nomor",
      text: "Nomor",
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
              error={props.pembayaranState.error}
              message={props.pembayaranState.message!}
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
              data={props.pembayaranState.pembayarans.filter(
                (pembayaran) => pembayaran.status != undefined
              )}
            />
          </>
        )}
      </div>

      <ModalAksi
        modalRef={modalAksiRef}
        icon={<TiWarning size={50} className="text-warning" />}
        message={`Data pembayaran akan di${aksi}?`}
        loading={loading}
        submit={submitAksi}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  pembayaranState: state.pembayaranState,
});

const mapActionsToProps = {
  getAllPembayaran,
  terimaPembayaran,
  tolakPembayaran,
  resetPembayaran,
};

Pembayaran.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Pembayaran);
