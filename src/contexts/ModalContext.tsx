import { createContext, Dispatch, SetStateAction } from 'react';

// Define the context type
interface ModalContextType {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  showSignup: boolean;
  setShowSignup: Dispatch<SetStateAction<boolean>>;
  showForgotPassword: boolean;
  setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
  triggerFavMessage: boolean;
  setTriggerFavMessage: Dispatch<SetStateAction<boolean>>;
  triggerCommentMessage: boolean;
  setTriggerCommentMessage: Dispatch<SetStateAction<boolean>>;
}

// Create the context with default values
const ModalContext = createContext<ModalContextType>({
  showLoginModal: false,
  setShowLoginModal: () => {},
  showSignup: false,
  setShowSignup: () => {},
  showForgotPassword: false,
  setShowForgotPassword: () => {},
  triggerFavMessage: false,
  setTriggerFavMessage: () => {},
  triggerCommentMessage: false,
  setTriggerCommentMessage: () => {},
});

export default ModalContext;
