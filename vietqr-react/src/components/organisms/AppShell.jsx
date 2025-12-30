import styled from 'styled-components';

const AppShellContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg.primary};
  overflow-x: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const MainWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex overflow */
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[8]};
  overflow-y: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]};
    padding-bottom: ${({ theme }) => theme.spacing[20]}; /* Space for mobile nav */
  }
`;

const AppShell = ({ sidebar, header, children, mobileNav }) => {
  return (
    <AppShellContainer>
      {sidebar}
      <MainWrapper>
        {header}
        <ContentArea>
          {children}
        </ContentArea>
      </MainWrapper>
      {mobileNav}
    </AppShellContainer>
  );
};

export default AppShell;
