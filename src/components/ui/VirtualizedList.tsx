import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

/**
 * Props para o componente VirtualizedList
 */
interface VirtualizedListProps<T> {
  /** Array de itens para renderizar */
  items: T[];
  /** Altura de cada item em pixels */
  itemHeight: number;
  /** Altura total da lista em pixels */
  height: number;
  /** Função para renderizar cada item */
  renderItem: (props: {
    index: number;
    style: React.CSSProperties;
    data: T[];
  }) => React.ReactElement;
  /** Classe CSS adicional para o container */
  className?: string;
  /** Número de itens extras para renderizar fora da viewport (overscan) */
  overscanCount?: number;
}

/**
 * Componente de lista virtualizada usando react-window
 * Otimiza a performance renderizando apenas os itens visíveis
 * 
 * @template T - Tipo dos itens da lista
 */
export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  className = '',
  overscanCount = 5,
}: VirtualizedListProps<T>) {
  /**
   * Memoiza o componente de item para evitar re-renderizações desnecessárias
   */
  const ItemComponent = useMemo(
    () =>
      ({ index, style, data }: { index: number; style: React.CSSProperties; data: T[] }) =>
        renderItem({ index, style, data }),
    [renderItem]
  );

  // Se não há itens, renderiza estado vazio
  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-muted-foreground">
          <p>Nenhum item encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={items}
        overscanCount={overscanCount}
      >
        {ItemComponent}
      </List>
    </div>
  );
}

/**
 * Hook para calcular a altura ideal da lista baseada no container
 */
export function useVirtualizedListHeight({
  containerRef,
  maxHeight = 600,
  minHeight = 200,
}: {
  containerRef: React.RefObject<HTMLElement>;
  maxHeight?: number;
  minHeight?: number;
}) {
  const [height, setHeight] = React.useState(minHeight);

  React.useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const calculatedHeight = Math.min(Math.max(containerHeight - 100, minHeight), maxHeight);
        setHeight(calculatedHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, [containerRef, maxHeight, minHeight]);

  return height;
}

/**
 * Componente de lista virtualizada com altura automática
 */
export function AutoHeightVirtualizedList<T>({
  containerRef,
  maxHeight = 600,
  minHeight = 200,
  ...props
}: VirtualizedListProps<T> & {
  containerRef: React.RefObject<HTMLElement>;
  maxHeight?: number;
  minHeight?: number;
}) {
  const height = useVirtualizedListHeight({ containerRef, maxHeight, minHeight });

  return (
    <VirtualizedList
      {...props}
      height={height}
    />
  );
}