import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CustomToastProps {
    title: string;
    type:string;
    message?: string;
}

export enum TOAST_TYPE {
    success = 'success',
    error = 'error',
    info = 'info'
}

const CustomToast = ({ title, message,type }: CustomToastProps) => (
    <div className={'custom-taster ' +type}>
        <p><b>{title}</b> <br></br>{message}</p>

    </div>
);


export const showNotifications = (type: TOAST_TYPE, title: string, message?: string) => {

    const messageType = Array.isArray(message);
    let showMessage = message;

    if (messageType) {
        showMessage = "";
        for (const msg of message) {
            showMessage += `${msg}. `
        }
    }

    const ToastContent = <CustomToast type={type} title={title} message={showMessage} />;

    switch (type) {
        case 'success':
            toast.success(ToastContent);
            break;
        case 'error':
            toast.error(ToastContent);
            break;
        default:
            toast.info(ToastContent);
    }
}   