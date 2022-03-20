import { connect } from "react-redux";
import Layout from "@/components/Layout";

import { getStatus, runWaBot, stopWaBot } from "@/store/wa/action";
import { useEffect, ReactElement } from "react";
import { TiGroup, TiUserAdd, TiDocumentText } from "react-icons/ti";
import {
  RiWhatsappFill,
  RiPlayCircleFill,
  RiStopCircleFill,
} from "react-icons/ri";

import { wrapper } from "@/store/store";
import { waActionTypes } from "@/store/wa/action";

import io from "socket.io-client";
import QRCode from "react-qr-code";
import { State, WaState } from "types";

type HomeProps = {
  waState: WaState;
  runWaBot: () => void;
  stopWaBot: () => void;
  getStatus: () => void;
  runningWaBot: () => void;
};

const Home = (props: HomeProps) => {
  const socket = io(process.env.baseURL!);

  useEffect(() => {
    console.log(socket.connected);

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("waBotStatus", (status) => {
      console.log(status);
      switch (status) {
        case "runningWaBot":
          props.runningWaBot();
          break;
        case "stopWaBot":
          props.stopWaBot();
          break;
      }
    });
  }, []);

  const btnRun = (
    <button
      className="btn btn-sm btn-outline btn-info"
      onClick={props.runWaBot}
    >
      <RiPlayCircleFill size={20} className="mr-2" />
      Jalankan
    </button>
  );

  const btnStop = (
    <button
      className="btn btn-sm btn-outline btn-error"
      onClick={props.stopWaBot}
    >
      <RiStopCircleFill size={20} className="mr-2" />
      Matikan
    </button>
  );

  const btnLoading = (
    <button className="btn btn-sm btn-outline btn-secondary loading" disabled>
      Menunggu
    </button>
  );

  return (
    <div className="container grid grid-flow-row auto-rows-max gap-8 sm:justify-items-center">
      <div className="sm:overflow-visible overflow-auto">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <TiGroup size={50} />
            </div>
            <div className="stat-title">Pelanggan</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Total</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <TiUserAdd size={50} />
            </div>
            <div className="stat-title">Pelanggan Baru</div>
            <div className="stat-value">4</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <TiDocumentText size={50} />
            </div>
            <div className="stat-title">Pengaduan</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </div>

      <div className="alert shadow-sm">
        <div>
          <RiWhatsappFill className="text-success" size={40} />
          <div>
            <h3 className="font-bold">Informasi</h3>
            <div className="text-xs">{props.waState.message}</div>
          </div>
        </div>
        <div className="flex-none">
          {props.waState.loading
            ? btnLoading
            : props.waState.run
            ? btnStop
            : btnRun}
        </div>
      </div>

      {props.waState.qr === undefined && props.waState.loading && (
        <div className="flex items-center justify-center space-x-2 animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      )}

      {props.waState.qr && <QRCode value={props.waState.qr} />}
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  // @ts-ignore
  (store) => async () => {
    const END_POINT = process.env.baseURL + "api/wa/";
    const res = await fetch(END_POINT);

    const json = await res.json();

    store.dispatch({ type: waActionTypes.UPDATE, payload: json });
  }
);

const mapStateToProps = (state: State) => ({
  waState: state.waState,
});

const mapActionsToProps = {
  runWaBot,
  stopWaBot,
  getStatus,
  runningWaBot: () => (dispatch: any) =>
    dispatch({ type: waActionTypes.RUNNING }),
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Home);
