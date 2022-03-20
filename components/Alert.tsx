import { TiWarning, TiTick } from "react-icons/ti";

type AlertProps = {
  error: boolean;
  message: string;
  className?: string;
};

const Alert = (props: AlertProps) => (
  <div
    className={`alert text-white ${
      props.error ? "alert-warning" : "alert-success"
    } ${props.className}`}
  >
    <div>
      {props.error ? <TiWarning size={20} /> : <TiTick size={24} />}
      <span>{props.message}</span>
    </div>
  </div>
);

export default Alert;
