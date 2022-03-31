import React, {
  useState,
  useEffect,
  ReactElement,
  HTMLInputTypeAttribute,
} from "react";
import { connect } from "react-redux";
import Layout from "@/components/Layout";

import { getAllPengaduan } from "@/store/pengaduan/action";
import { PengaduanState, State } from "@/types";

import TableCustom from "@/components/TableCustom";

type PengaduanProps = {
  pengaduanState: PengaduanState;
  getAllPengaduan: () => void;
};

export type HeadersType = {
  name: string;
  text: string;
  type?: HTMLInputTypeAttribute;
};

const Pengaduan = (props: PengaduanProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.pengaduanState.pengaduans.length) setLoading(true);
    props.getAllPengaduan();
  }, []);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [props.pengaduanState.pengaduans]);

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
      name: "pengaduan",
      text: "Pengaduan",
    },
    {
      name: "createdAt",
      text: "Tanggal",
    },
  ];

  return (
    <div className="container outline outline-1 outline-gray-300 rounded p-2">
      <div className="flex md:flex-row flex-col gap-2 justify-between">
        {loading && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
          </div>
        )}
      </div>

      <TableCustom headers={headers} data={props.pengaduanState.pengaduans} />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  pengaduanState: state.pengaduanState,
});

const mapActionsToProps = {
  getAllPengaduan,
};

Pengaduan.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Pengaduan);
