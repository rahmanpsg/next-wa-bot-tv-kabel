import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

type AlertProps = {
    error: boolean;
    message: string;
};

export const Alert = ({ error, message }: AlertProps) => (
    <div
        className={`flex p-4 mb-4 text-sm rounded-lg text-white ${error
            ? " bg-danger-100"
            : "bg-secondary-500  "
            }`}
    >
        <div className="inline flex-shrink-0 mr-3 w-5 h-5">
            {error ? <FaExclamationCircle size={20} /> : <FaCheckCircle size={20} />}
        </div>
        <div>
            <span className="font-medium">{message}</span>
        </div>
    </div>
);
