import styled from 'styled-components';
import { motion } from 'framer-motion';

const MobileNavContainer = styled(motion.nav)`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: ${({ theme }) => theme.colors.surface.default};
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
    padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
    z-index: ${({ theme }) => theme.zIndex.fixed};
    backdrop-filter: blur(8px);
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NavItem = styled.li`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.text.secondary
  };
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme, $active }) => 
    $active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  min-width: 60px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    color: ${({ theme, $active }) => 
      $active ? theme.colors.primary : theme.colors.text.primary
    };
  }
  
  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`;

const Label = styled.span`
  display: block;
  line-height: 1;
`;

const MobileNav = ({ 
  items = [],
  activeItem,
  onNavigate,
}) => {
  return (
    <MobileNavContainer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      <NavList>
        {items.map((item) => (
          <NavItem key={item.id}>
            <NavButton
              $active={activeItem === item.id}
              onClick={() => onNavigate?.(item.id)}
            >
              {item.icon}
              <Label>{item.label}</Label>
            </NavButton>
          </NavItem>
        ))}
      </NavList>
    </MobileNavContainer>
  );
};

export default MobileNav;
