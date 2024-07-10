import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function showAlert(options, onConfirm, onCancel) {
  MySwal.fire({
    title: options.title,
    icon: options.icon,
    text: options.text,
    showCancelButton: options.showCancelButton,
    confirmButtonText: options.confirmButtonText,
    cancelButtonText: options.cancelButtonText,
    customClass: {
      popup: 'swal2-custom-popup'
    }
  }).then(result => {
    if (result.isConfirmed) {
      if (onConfirm) onConfirm();
    } else {
      if (onCancel) onCancel();
    }
  });
}

export function showToast(message, icon, focus = '') {
  if (!message) return;
  focusOnElement(focus);
  const toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    customClass: {
      popup: 'swal2-custom-popup'
    }
  });
  toast.fire({
    title: message,
    icon: icon
  });
}

function focusOnElement(focus) {
  if (focus !== '') {
    const element = document.getElementById(focus);
    if (element) {
      element.focus();
    }
  }
}

const style = document.createElement('style');
style.innerHTML = `
  .swal2-custom-popup {
    background-color: #E1E3EB !important;
    color: black !important;
  }
  .swal2-title,
  .swal2-content {
    color: black !important;
  }
  .swal2-confirm {
    background-color: #E1E3EB !important;
    color: black !important;
    border: none !important;
  }
  .swal2-cancel {
    background-color: #E1E3EB !important;
    color: black !important;
    border: none !important;
  }
  .swal2-confirm:focus,
  .swal2-cancel:focus {
    box-shadow: none !important;
  }
`;
document.head.appendChild(style);

export default showToast;
