/**
 * Virtual List Component
 * Efficient rendering of large lists using virtualization
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRAFThrottle } from '../../hooks/usePerformance';

const ListContainer = styled.div`
  position: relative;
  overflow: auto;
  width: 100%;
  height: ${props => props.$height || '400px'};
  -webkit-overflow-scrolling: touch;
`;

const ListContent = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.$totalHeight}px;
`;

const ListItem = styled.div`
  position: absolute;
  top: ${props => props.$top}px;
  left: 0;
  width: 100%;
`;

/**
 * Virtual List Component
 * @param {Array} items - Array of items to render
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} height - Container height
 * @param {Function} renderItem - Function to render each item
 * @param {number} overscan - Number of items to render outside viewport
 * @param {Function} onScroll - Scroll callback
 */
export const VirtualList = ({
  items = [],
  itemHeight = 50,
  height = 400,
  renderItem,
  overscan = 3,
  onScroll,
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  // Total height for scrolling
  const totalHeight = items.length * itemHeight;

  // Visible items
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Throttled scroll handler
  const handleScroll = useRAFThrottle(() => {
    if (containerRef.current) {
      const newScrollTop = containerRef.current.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    }
  });

  return (
    <ListContainer
      ref={containerRef}
      $height={typeof height === 'number' ? `${height}px` : height}
      onScroll={handleScroll}
      {...props}
    >
      <ListContent $totalHeight={totalHeight}>
        {visibleItems.map((item, index) => {
          const itemIndex = startIndex + index;
          return (
            <ListItem key={itemIndex} $top={itemIndex * itemHeight}>
              {renderItem(item, itemIndex)}
            </ListItem>
          );
        })}
      </ListContent>
    </ListContainer>
  );
};

// ============================================
// Virtual Grid Component
// ============================================

const GridContainer = styled.div`
  position: relative;
  overflow: auto;
  width: 100%;
  height: ${props => props.$height || '400px'};
  -webkit-overflow-scrolling: touch;
`;

const GridContent = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.$totalHeight}px;
`;

const GridItem = styled.div`
  position: absolute;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
`;

/**
 * Virtual Grid Component
 * @param {Array} items - Array of items to render
 * @param {number} columnCount - Number of columns
 * @param {number} itemHeight - Height of each item
 * @param {number} itemWidth - Width of each item
 * @param {number} height - Container height
 * @param {number} gap - Gap between items
 * @param {Function} renderItem - Function to render each item
 * @param {number} overscan - Number of rows to render outside viewport
 */
export const VirtualGrid = ({
  items = [],
  columnCount = 3,
  itemHeight = 200,
  itemWidth = 200,
  height = 400,
  gap = 16,
  renderItem,
  overscan = 1,
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const rowHeight = itemHeight + gap;
  const rowCount = Math.ceil(items.length / columnCount);
  const totalHeight = rowCount * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    rowCount - 1,
    Math.ceil((scrollTop + height) / rowHeight) + overscan
  );

  const handleScroll = useRAFThrottle(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  });

  const visibleItems = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < columnCount; col++) {
      const index = row * columnCount + col;
      if (index < items.length) {
        visibleItems.push({
          item: items[index],
          index,
          top: row * rowHeight,
          left: col * (itemWidth + gap),
        });
      }
    }
  }

  return (
    <GridContainer
      ref={containerRef}
      $height={typeof height === 'number' ? `${height}px` : height}
      onScroll={handleScroll}
      {...props}
    >
      <GridContent $totalHeight={totalHeight}>
        {visibleItems.map(({ item, index, top, left }) => (
          <GridItem
            key={index}
            $top={top}
            $left={left}
            $width={itemWidth}
            $height={itemHeight}
          >
            {renderItem(item, index)}
          </GridItem>
        ))}
      </GridContent>
    </GridContainer>
  );
};

// ============================================
// Infinite Scroll List
// ============================================

/**
 * Infinite Scroll List Component
 * @param {Array} items - Array of items to render
 * @param {number} itemHeight - Height of each item
 * @param {number} height - Container height
 * @param {Function} renderItem - Function to render each item
 * @param {Function} loadMore - Function to load more items
 * @param {boolean} hasMore - Whether there are more items
 * @param {boolean} loading - Loading state
 */
export const InfiniteScrollList = ({
  items = [],
  itemHeight = 50,
  height = 400,
  renderItem,
  loadMore,
  hasMore = false,
  loading = false,
  threshold = 200,
  ...props
}) => {
  const containerRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < threshold) {
      setIsLoadingMore(true);
      loadMore?.().finally(() => setIsLoadingMore(false));
    }
  }, [hasMore, isLoadingMore, loadMore, threshold]);

  const throttledScroll = useRAFThrottle(handleScroll);

  return (
    <div style={{ position: 'relative' }}>
      <VirtualList
        ref={containerRef}
        items={items}
        itemHeight={itemHeight}
        height={height}
        renderItem={renderItem}
        onScroll={throttledScroll}
        {...props}
      />
      {(loading || isLoadingMore) && (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}>
          Loading more...
        </div>
      )}
    </div>
  );
};

// ============================================
// Export
// ============================================

export default VirtualList;