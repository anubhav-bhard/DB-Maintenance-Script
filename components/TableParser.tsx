
import React, { useState, useEffect } from 'react';
import { TableItem } from '../types';

interface TableParserProps {
  input: string;
  onParsed: (tables: TableItem[]) => void;
}

export const TableParser: React.FC<TableParserProps> = ({ input, onParsed }) => {
  useEffect(() => {
    const lines = input.split('\n');
    const tableSet = new Set<string>();
    const parsed: TableItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      // Basic validation: skip empty lines, headers, or lines that look like sentences
      if (!trimmed || 
          trimmed.toLowerCase() === 'table names' || 
          trimmed.toLowerCase().includes('list of tables') ||
          trimmed.toLowerCase().includes('script')) {
        return;
      }

      // Handle schema notation like flow.Table
      const parts = trimmed.split('.');
      const tableName = parts.length > 1 ? parts[1] : parts[0];
      const schema = parts.length > 1 ? parts[0] : undefined;

      // Ensure uniqueness
      if (!tableSet.has(trimmed)) {
        tableSet.add(trimmed);
        parsed.push({
          id: Math.random().toString(36).substr(2, 9),
          name: tableName,
          schema: schema,
          rawName: trimmed
        });
      }
    });

    onParsed(parsed);
  }, [input, onParsed]);

  return null;
};
