import { TiWarning, TiTick } from "react-icons/ti";

type AlertProps = {
  error: boolean;
  message: string;
};

export const Alert = ({ error, message }: AlertProps) => (
  <div
    className={`alert text-white ${error ? "alert-warning" : "alert-success"}`}
  >
    <div>
      {error ? <TiWarning size={20} /> : <TiTick size={24} />}
      <span>{message}</span>
    </div>
  </div>
);
