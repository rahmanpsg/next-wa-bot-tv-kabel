import Table, { Icolumn, Irow, ItableStyle } from "react-tailwind-table";
import "react-tailwind-table/dist/index.css";

import Moment from "react-moment";
import "moment/locale/id";

import {
  TiEdit,
  TiTrash,
  TiTickOutline,
  TiTick,
  TiTimes,
  TiThList,
} from "react-icons/ti";
import { HeadersType } from "pages/admin/pelanggan";
import { Pembayarans, Pengaduans, Rekenings, Users } from "types";

type TableCustomProps = {
  headers: HeadersType[];
  data: Array<Users | Pengaduans | Pembayarans | Rekenings>;
  statusClick?: (row: Irow, aktif: boolean) => void;
  editClick?: (row: Irow) => void;
  hapusClick?: (row: Irow) => void;
  terimaClick?: (row: Irow) => void;
  tolakClick?: (row: Irow) => void;
};

const TableCustom = (props: TableCustomProps) => {
  const columns: Icolumn[] = props.headers.map((header) => {
    return {
      field: header.name,
      use: header.text,
    };
  });

  const rows: Irow[] = props.data.map((val, idx) => {
    return { no: idx + 1, ...val };
  });

  const style: ItableStyle = {
    base_bg_color: "bg-green-700",
    base_text_color: "text-green-600",
    table_head: {
      table_data: "bg-primary",
    },
  };

  const rowcheck = (row: Irow, column: Icolumn, display_value: any) => {
    if (column.field === "createdAt") {
      return (
        <Moment format="llll" locale="id">
          {display_value.toString()}
        </Moment>
      );
    } else if (column.field === "foto") {
      return (
        <a href={display_value.toString()} target="_blank">
          <img src={display_value.toString()} width="50" />
        </a>
      );
    } else if (column.field === "status") {
      return display_value === true ? (
        <div className="tooltip" data-tip="Pembayaran di Terima">
          <TiTick color="green" size={25} />
        </div>
      ) : (
        <div className="tooltip" data-tip="Pembayaran di Tolak">
          <TiTimes color="red" size={25} />
        </div>
      );
    } else if (column.field === "aktif") {
      return display_value === undefined ? (
        <div className="badge badge-sm badge-warning w-32 text-white">
          Belum di Aktifkan
        </div>
      ) : display_value === true ? (
        <div className="badge badge-sm badge-success w-32">Aktif</div>
      ) : (
        <div className="badge badge-sm badge-error w-32">Tidak Aktif</div>
      );
    } else if (column.field === "konfirmasi") {
      return (
        <div className="flex gap-2">
          <div className="tooltip" data-tip="Terima Pembayaran">
            <label
              onClick={() => {
                props.terimaClick!(row);
              }}
              htmlFor="my-modal-aksi"
              className="btn btn-sm btn-outline btn-success text-white"
            >
              <TiTick size={18} />
            </label>
          </div>
          <div className="tooltip" data-tip="Tolak Pembayaran">
            <label
              onClick={() => {
                props.tolakClick!(row);
              }}
              htmlFor="my-modal-aksi"
              className="btn btn-sm btn-outline btn-error text-white"
            >
              <TiTimes size={18} />
            </label>
          </div>
        </div>
      );
    } else if (column.field === "aksi") {
      return (
        <div
          className={`dropdown dropdown-left ${row.no != 1 && "dropdown-end"}`}
        >
          <label tabIndex={0} className="btn btn-sm btn-ghost m-1">
            <TiThList color="green" size={18} />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-60"
          >
            <li>
              {row.aktif === true ? (
                <label
                  onClick={() => props.statusClick!(row, false)}
                  htmlFor="my-modal-aksi"
                >
                  <TiTimes color="red" size={18} /> Non Aktifkan
                </label>
              ) : (
                <label
                  onClick={() => props.statusClick!(row, true)}
                  htmlFor="my-modal-aksi"
                >
                  <TiTickOutline color="green" size={18} /> Aktifkan
                </label>
              )}
            </li>
            <li>
              <label
                onClick={() => props.editClick!(row)}
                htmlFor="my-modal-form"
              >
                <TiEdit color="orange" size={18} /> Ubah Data Pelanggan
              </label>
            </li>
            <li>
              <label
                onClick={() => props.hapusClick!(row)}
                htmlFor="my-modal-aksi"
              >
                <TiTrash color="red" size={18} /> Hapus Data Pelanggan
              </label>
            </li>
          </ul>
        </div>
      );
    } else if (column.field == "aksi2") {
      return (
        <div className="flex gap-2">
          <div className="tooltip" data-tip="Ubah Rekening">
            <label
              onClick={() => {
                props.editClick!(row);
              }}
              htmlFor="my-modal-form"
              className="btn btn-sm btn-outline btn-warning text-white"
            >
              <TiEdit size={18} />
            </label>
          </div>
          <div className="tooltip" data-tip="Hapus Rekening">
            <label
              onClick={() => {
                props.hapusClick!(row);
              }}
              htmlFor="my-modal-aksi"
              className="btn btn-sm btn-outline btn-error text-white"
            >
              <TiTrash size={18} />
            </label>
          </div>
        </div>
      );
    }

    return display_value;
  };

  return (
    <Table
      columns={columns}
      rows={rows}
      row_render={rowcheck}
      per_page={7}
      no_content_text="Tidak ada data"
      styling={style}
      should_export={false}
    />
  );
};

export default TableCustom;
