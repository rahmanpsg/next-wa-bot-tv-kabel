import Table, { Icolumn, Irow, ItableStyle } from "react-tailwind-table";
import "react-tailwind-table/dist/index.css";

import Moment from "react-moment";
import "moment/locale/id";

import { TiEdit, TiMinusOutline, TiDocumentText } from "react-icons/ti";
import { HeadersType } from "pages/admin/pelanggan";
import { Users } from "types";

type TableCustomProps = {
  headers: HeadersType[];
  data: Array<Users>;
  editClick: (row: Irow) => void;
  hapusClick: (row: Irow) => void;
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
                props.editClick(row);
              }}
              htmlFor="my-modal-form"
              className="btn btn-sm btn-outline btn-warning text-white"
            >
              <TiEdit size={18} />
            </label>
          </div>
          <div className="tooltip" data-tip="Hapus Data Pelanggan">
            <label
              onClick={() => {
                props.hapusClick(row);
              }}
              htmlFor="my-modal-aksi"
              className="btn btn-sm btn-outline btn-error text-white"
            >
              <TiMinusOutline size={18} />
            </label>
          </div>
        </div>
      );
    }

    if (column.field === "name") {
      return <b>{display_value}</b>;
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
    />
  );
};

export default TableCustom;
