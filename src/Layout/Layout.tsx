import React from 'react';
import TopNavigation from '../sections/TopNav/TopNav';
import Footer from '../sections/footer';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <>
      <TopNavigation />
      <div
        id="spacer"
        style={{
          height: '100px',
        }}
      />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
