import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SidebarWrapper = styled.div`
  /* Always visible on desktop */
  display: block;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* On mobile, controlled by isOpen */
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  }
`;

const SidebarContainer = styled.aside`
  position: sticky;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.surface.default};
  border-right: 1px solid ${({ theme }) => theme.colors.border.default};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    z-index: ${({ theme }) => theme.zIndex.modal};
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const LogoIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  object-fit: cover;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
`;

const LogoSubtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.2;
`;

const CloseButton = styled.button`
  display: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const SidebarBody = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[4]};
  overflow-y: auto;
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NavSectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 ${({ theme }) => theme.spacing[3]} 0;
  padding: 0 ${({ theme }) => theme.spacing[3]};
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const NavItem = styled.li`
  margin: 0;
  padding: 0;
`;

const NavLink = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  color: ${({ theme, $active }) =>
    $active ? '#ffffff' : theme.colors.text.secondary
  };
  background: ${({ theme, $active }) =>
    $active
      ? 'linear-gradient(135deg, #5BA3E8 0%, #4896de 100%)'
      : 'transparent'
  };
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.normal
  };
  text-decoration: none;
  transition: all ${({ theme }) => theme.transition.fast};
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
  box-shadow: ${({ theme, $active }) =>
    $active ? theme.shadows.md : 'none'
  };
  
  &:hover {
    background: ${({ theme, $active }) =>
    $active
      ? 'linear-gradient(135deg, #6BB0F0 0%, #5BA3E8 100%)'
      : theme.colors.surface.hover
  };
    color: ${({ theme, $active }) =>
    $active ? '#ffffff' : theme.colors.text.primary
  };
    transform: ${({ $active }) => $active ? 'translateY(-1px)' : 'none'};
  }
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const Backdrop = styled(motion.div)`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    position: fixed;
    inset: 0;
    background: ${({ theme }) => theme.colors.bg.overlay};
    z-index: ${({ theme }) => theme.zIndex.backdrop};
  }
`;

const Sidebar = ({
  isOpen = true,
  onClose,
  logoIcon = 'HD',
  logoTitle = 'HD SAISON',
  logoSubtitle = 'VietQR System',
  sections = [],
  activeItem,
  onNavigate,
}) => {

  const handleNavClick = (itemId) => {
    console.log('Nav clicked:', itemId);
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <SidebarWrapper $isOpen={isOpen}>
        <SidebarContainer>
          <SidebarHeader>
            <Logo>
              <LogoIcon src="/hd-saison-logo.png" alt="HD SAISON" />
              <LogoText>
                <LogoTitle>{logoTitle}</LogoTitle>
                <LogoSubtitle>{logoSubtitle}</LogoSubtitle>
              </LogoText>
            </Logo>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </SidebarHeader>

          <SidebarBody>
            {sections.map((section, idx) => (
              <NavSection key={idx}>
                {section.title && (
                  <NavSectionTitle>{section.title}</NavSectionTitle>
                )}
                <NavList>
                  {section.items.map((item) => (
                    <NavItem key={item.id}>
                      <NavLink
                        $active={activeItem === item.id}
                        onClick={() => handleNavClick(item.id)}
                        type="button"
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    </NavItem>
                  ))}
                </NavList>
              </NavSection>
            ))}
          </SidebarBody>
        </SidebarContainer>
      </SidebarWrapper>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
