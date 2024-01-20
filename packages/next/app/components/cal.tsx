'use client';
// greets https://github.com/wa0x6e/cal-heatmap-react-starter/blob/main/src/components/cal-heatmap.tsx

import CalHeatmap from 'cal-heatmap';
// @ts-ignore cal-heatmap is jenk
import Legend from 'cal-heatmap/plugins/Legend';
// @ts-ignore cal-heatmap is jenk
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import { DataRecord } from 'cal-heatmap/src/options/Options';
import 'cal-heatmap/cal-heatmap.css';
import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeDate } from '@/lib/dates';

export interface ICalProps {
  data: DataRecord[];
  slug: string;
}


export function Cal({ data, slug }: ICalProps) {
  const router = useRouter();
  const [cellSize, setCellSize] = useState(13);
  const [targetElementId, setTargetElementId] = useState('');

  const generateUniqueId = () => {
    return `cal-${Math.random().toString(36).substring(2, 9)}`;
  };

  

  useEffect(() => {
    const updateCellSize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth > 1400) {
        setCellSize(15); // Adjust the cell size for width > 1400px
      } else if (windowWidth > 730) {
        setCellSize(10); // Adjust the cell size for width > 730px
      } else {
        setCellSize(3); // Adjust the cell size for width <= 730px
      }
    }
    updateCellSize();
      // Event listener to update cell size on window resize
      window.addEventListener('resize', updateCellSize);

      return () => {
        window.removeEventListener('resize', updateCellSize);
      };
    
  }, [])


  useEffect(() => {
    setTargetElementId(generateUniqueId());
  }, []);

  useEffect(() => {
    if (!targetElementId) return;
    const cal = new CalHeatmap();
    // @ts-ignore
    cal.on('click', (
      event: string, 
      timestamp: number, 
      value: number
    ) => {
      router.push(`/vt/${slug}/stream/${getSafeDate(new Date(timestamp))}`);
      // console.log(`slug=${slug} safeDate=${getSafeDate(new Date(timestamp))}`);
    });
    
    cal.paint(
      { 
        itemSelector: `#${targetElementId}`,
        scale: { 
          color: { 
            // @ts-ignore this shit is straight from the example website
            domain: ['missing', 'issue', 'good'],
            type: 'ordinal',
            range: ['red', 'yellow', 'green']
          }
        },
        theme: 'dark',
        verticalOrientation: false,
        data: {
          source: data,
          x: 'date',
          y: 'value',
          // @ts-ignore this shit is straight from the example website
          groupY: d => d[0]
        },
        range: 12,
        date: { start: data[0].date },
        domain: {
          type: 'month',
          gutter: 4,
          label: { text: 'MMM', textAlign: 'start', position: 'top' }
        },
        subDomain: { 
          type: 'ghDay', 
          radius: 2, 
          width: cellSize, 
          height: cellSize, 
          gutter: 4,
        }
      }, [
        [
          Tooltip,
          {
            text: ((ts: number, value: string, dayjsDate: dayjs.Dayjs) => {
              return `${!!value ? value+' - '+dayjsDate.toString() : dayjsDate.toString() }`;
            })
          }
        ]
      ]);
    
  }, [targetElementId, data, cellSize, router, slug]);
  

  return (
    <>
      <div id={targetElementId}></div>
    </>
  )
}