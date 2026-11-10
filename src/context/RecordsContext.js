import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { createId, loadRecords, saveRecords } from '@/lib/records';

const RecordsContext = createContext(null);

export function RecordsProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [canPersist, setCanPersist] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    loadRecords()
      .then((saved) => {
        if (!active) {
          return;
        }
        setRecords(saved);
        setCanPersist(true);
      })
      .catch(() => {
        if (active) {
          setLoadError('Saved records could not be read on this device.');
        }
      })
      .finally(() => {
        if (active) {
          setHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!canPersist) {
      return;
    }

    saveRecords(records).catch(() => {
      setLoadError('A change could not be saved on this device.');
    });
  }, [records, canPersist]);

  const value = useMemo(
    () => ({
      records,
      hydrated,
      loadError,
      addRecord(input) {
        const record = {
          id: createId(),
          itemName: input.itemName,
          amount: input.amount,
          person: input.person,
          type: input.type,
          date: input.date,
          returnDate: input.returnDate,
          returned: false,
          returnedAt: null,
          createdAt: new Date().toISOString(),
        };
        setRecords((current) => [record, ...current]);
        return record;
      },
      markReturned(id) {
        const returnedAt = new Date().toISOString();
        setRecords((current) =>
          current.map((record) =>
            record.id === id ? { ...record, returned: true, returnedAt } : record,
          ),
        );
      },
    }),
    [records, hydrated, loadError],
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords() {
  const value = useContext(RecordsContext);
  if (!value) {
    throw new Error('useRecords must be used inside RecordsProvider');
  }
  return value;
}
