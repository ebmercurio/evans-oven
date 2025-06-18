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
      <div style={{ marginTop: '90px' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}

export default Layout;
