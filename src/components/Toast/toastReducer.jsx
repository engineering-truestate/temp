export const toastReducer = (state, action) => {
    switch (action.type) {
      case "ADD_TOAST":
        return {
          ...state,
          toasts: [...state.toasts, action.payload],
        };
      case "REMOVE_TOAST":
        return {
          ...state,
          toasts: state.toasts.filter((toast) => toast.id !== action.payload),
        };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };
  