/**
 * Performance Test Page
 * Test and benchmark performance optimizations
 */

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  useDebounce,
  useDebouncedValue,
  useThrottle,
  useMemoizedValue,
  usePrevious,
} from '../hooks/usePerformance';
import { VirtualList, VirtualGrid, InfiniteScrollList } from '../components/molecules/VirtualList';
import { LazyImage } from '../components/atoms/LazyImage';
import { lazy, LoadingSpinner, SkeletonCard } from '../components/atoms/LazyLoad';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { Container, ResponsiveGrid, Stack } from '../components/atoms/ResponsiveComponents';
import { Zap, Image as ImageIcon, List, Grid as GridIcon, Search } from 'lucide-react';

const TestContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background.default};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const TestCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
`;

const MetricCard = styled(motion.div)`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.elevated};
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ListItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.paper};
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const PerformanceTest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  
  // Debounced search
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  
  // Throttled counter
  const throttledIncrement = useThrottle(() => {
    setRenderCount(prev => prev + 1);
  }, 1000);
  
  // Previous value
  const previousSearch = usePrevious(debouncedSearch);
  
  // Memoized expensive computation
  const expensiveResult = useMemoizedValue(() => {
    console.log('Computing expensive result...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    return result.toFixed(2);
  }, []);
  
  // Generate large dataset
  const largeDataset = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
      value: Math.random() * 1000,
    }));
  }, []);
  
  // Filtered data
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return largeDataset;
    return largeDataset.filter(item => 
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [largeDataset, debouncedSearch]);

  return (
    <TestContainer>
      <Container>
        <Title>⚡ Performance Testing</Title>

        {/* Metrics Section */}
        <Section>
          <SectionTitle>
            <Zap size={24} />
            Performance Metrics
          </SectionTitle>
          <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
            <MetricCard whileHover={{ scale: 1.02 }}>
              <MetricValue>{largeDataset.length.toLocaleString()}</MetricValue>
              <MetricLabel>Total Items</MetricLabel>
            </MetricCard>
            <MetricCard whileHover={{ scale: 1.02 }}>
              <MetricValue>{filteredData.length.toLocaleString()}</MetricValue>
              <MetricLabel>Filtered Items</MetricLabel>
            </MetricCard>
            <MetricCard whileHover={{ scale: 1.02 }}>
              <MetricValue>{expensiveResult}</MetricValue>
              <MetricLabel>Memoized Value</MetricLabel>
            </MetricCard>
            <MetricCard whileHover={{ scale: 1.02 }}>
              <MetricValue>{renderCount}</MetricValue>
              <MetricLabel>Throttled Counter</MetricLabel>
            </MetricCard>
          </ResponsiveGrid>
        </Section>

        {/* Debounce/Throttle Test */}
        <Section>
          <SectionTitle>
            <Search size={24} />
            Debounce & Throttle
          </SectionTitle>
          <TestCard>
            <Stack direction="column" gap="16px">
              <Input
                label="Search (Debounced 500ms)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
              />
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <p>Current: <strong>{searchQuery}</strong></p>
                <p>Debounced: <strong>{debouncedSearch}</strong></p>
                <p>Previous: <strong>{previousSearch || 'none'}</strong></p>
              </div>
              <Button onClick={throttledIncrement} variant="primary">
                Throttled Increment (1s)
              </Button>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Click rapidly - will only increment once per second
              </p>
            </Stack>
          </TestCard>
        </Section>

        {/* Virtual List Test */}
        <Section>
          <SectionTitle>
            <List size={24} />
            Virtual List (10,000 items)
          </SectionTitle>
          <TestCard>
            <p style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
              Only renders visible items for optimal performance. Scroll to test!
            </p>
            <VirtualList
              items={filteredData}
              itemHeight={80}
              height={400}
              renderItem={(item) => (
                <ListItem>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                    {item.id + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      {item.description}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--color-primary-main)' }}>
                    ${item.value.toFixed(2)}
                  </div>
                </ListItem>
              )}
            />
          </TestCard>
        </Section>

        {/* Virtual Grid Test */}
        <Section>
          <SectionTitle>
            <GridIcon size={24} />
            Virtual Grid
          </SectionTitle>
          <TestCard>
            <p style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
              Grid virtualization for image galleries and card layouts.
            </p>
            <VirtualGrid
              items={filteredData.slice(0, 100)}
              columnCount={3}
              itemHeight={180}
              itemWidth={180}
              height={400}
              gap={16}
              renderItem={(item) => (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, 
                    hsl(${item.id * 3.6}, 70%, 60%), 
                    hsl(${item.id * 3.6 + 60}, 70%, 50%)
                  )`,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    #{item.id + 1}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    {item.title}
                  </div>
                </div>
              )}
            />
          </TestCard>
        </Section>

        {/* Lazy Image Test */}
        <Section>
          <SectionTitle>
            <ImageIcon size={24} />
            Lazy Image Loading
          </SectionTitle>
          <TestCard>
            <p style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
              Images load only when scrolling into view. Scroll down to see lazy loading in action!
            </p>
            <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} style={{ height: '200px' }}>
                  <LazyImage
                    src={`https://picsum.photos/400/300?random=${num}`}
                    alt={`Lazy loaded image ${num}`}
                    objectFit="cover"
                  />
                </div>
              ))}
            </ResponsiveGrid>
          </TestCard>
        </Section>

        {/* Summary */}
        <Section>
          <SectionTitle>✅ Performance Features</SectionTitle>
          <TestCard>
            <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
              <li>✓ <strong>Debouncing:</strong> Delay function execution until input stops</li>
              <li>✓ <strong>Throttling:</strong> Limit function execution rate</li>
              <li>✓ <strong>Memoization:</strong> Cache expensive computations</li>
              <li>✓ <strong>Virtual Lists:</strong> Render only visible items (10,000+ items)</li>
              <li>✓ <strong>Virtual Grids:</strong> Efficient grid rendering</li>
              <li>✓ <strong>Lazy Images:</strong> Load images on scroll</li>
              <li>✓ <strong>Code Splitting:</strong> Dynamic imports with lazy()</li>
              <li>✓ <strong>RAF Throttling:</strong> RequestAnimationFrame optimization</li>
              <li>✓ <strong>Bundle Optimization:</strong> Compression & minification</li>
              <li>✓ <strong>Tree Shaking:</strong> Remove unused code</li>
            </ul>
          </TestCard>
        </Section>
      </Container>
    </TestContainer>
  );
};

export default PerformanceTest;