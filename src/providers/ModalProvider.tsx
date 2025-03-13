import React, { useState, ReactNode, useMemo } from 'react';
import ModalContext from '../contexts/ModalContext'; // Import the context definition

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [triggerFavMessage, setTriggerFavMessage] = useState(false);
  const [triggerCommentMessage, setTriggerCommentMessage] = useState(false);

  const value = useMemo(() => ({
    showLoginModal,
    setShowLoginModal,
    showSignup,
    setShowSignup,
    showForgotPassword,
    setShowForgotPassword,
    triggerFavMessage,
    setTriggerFavMessage,
    triggerCommentMessage,
    setTriggerCommentMessage,
  }), [
    showLoginModal,
    showSignup,
    showForgotPassword,
    triggerFavMessage,
    triggerCommentMessage,
  ]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

// Custom hook for using the modal context
export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
