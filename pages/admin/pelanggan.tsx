import { connect } from "react-redux";
import Layout from "../../components/Layout";

import { getUsers } from "../../store/user/action";
import { useEffect, ReactElement } from "react";
import { State } from "types";

import Table, { Icolumn, Irow, ItableStyle } from "react-tailwind-table";
import "react-tailwind-table/dist/index.css";

import { TiEdit, TiDelete } from "react-icons/ti";

const Pelanggan = (props: any) => {
  useEffect(() => {
    props.getUsers();
  }, []);

  const columns: Icolumn[] = [
    {
      field: "id",
      use: "#",
    },
    {
      field: "nik",
      use: "NIK",
    },
    {
      field: "nama",
      use: "Nama",
    },
    {
      field: "telpon",
      use: "Telpon",
    },
  ];

  const rows: Irow[] = [
    {
      id: 1,
      nama: "Sadio Mane",
    },
    {
      id: 2,
      nama: "Rahman",
    },
  ];

  const rowcheck = (row: Irow, column: Icolumn, display_value: any) => {
    if (column.field === "aksi") {
      return (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-warning text-white">
            <TiEdit size={18} />
          </button>
          <button className="btn btn-sm btn-error text-white">
            <TiDelete size={20} />
          </button>
        </div>
      );
    }

    if (column.field === "name") {
      return <b>{display_value}</b>;
    }

    return display_value;
  };

  function tableBulkClick(option: string, value: Irow[]) {
    console.log(option, value);
  }

  const style: ItableStyle = {
    base_bg_color: "bg-green-700",
    base_text_color: "text-green-600",
    table_head: {
      table_data: "bg-primary",
    },
  };

  return (
    <div className="container">
      <Table
        columns={columns}
        rows={rows}
        row_render={rowcheck}
        bulk_select_options={["Ubah", "Hapus"]}
        on_bulk_action={tableBulkClick}
        no_content_text="Belum ada data"
        styling={style}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapActionsToProps = {
  getUsers,
};

Pelanggan.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Pelanggan);
