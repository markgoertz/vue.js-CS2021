import Swal from "sweetalert2";

export default {
    name: "GeneralMethods",

    ThrowUnauthenticatedException() {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            name: 'InfoSWAL',
            text: 'You are not authorized to do this!',
            showConfirmButton: true,
        })
    },
    FailedExceptionWithSwal() {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            name: 'ErrorMessage',
            text: 'Failed!',
            showConfirmButton: true,
        })
    },
    SuccessNotificationWithSwal() {
        return Swal.fire({
            position: 'center',
            icon: 'success',
            name: 'successMessage',
            title: 'Operation completed successfully!',
            showConfirmButton: true,
        })
    }
}
