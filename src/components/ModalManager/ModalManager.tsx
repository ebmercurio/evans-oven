import LoginModal from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import { useModal } from '../../providers/ModalProvider';

export default function ModalManager() {
  const {
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
  } = useModal();

  return (
    <>
      <LoginModal
        showLogin={showLoginModal}
        setShowLogin={setShowLoginModal}
        setShowSignup={setShowSignup}
        setShowForgotPassword={setShowForgotPassword}
        triggerFavMessage={triggerFavMessage}
        setTriggerFavMessage={setTriggerFavMessage}
        triggerCommentMessage={triggerCommentMessage}
        setTriggerCommentMessage={setTriggerCommentMessage}
      />
      <Signup
        showSignup={showSignup}
        setShowSignup={setShowSignup}
        setShowLogin={setShowLoginModal}
      />
      <ForgotPassword
        showForgotPassword={showForgotPassword}
        setShowForgotPassword={setShowForgotPassword}
        setShowLogin={setShowLoginModal}
        setShowSignup={setShowSignup}
      />
    </>
  );
}
