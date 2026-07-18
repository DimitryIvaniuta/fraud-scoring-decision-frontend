import { useState } from 'react';
import { fraudApi } from '../../api/fraudApi';
import { Alert } from '../../components/Alert';
import { BankCard } from '../../components/BankCard';
import { InputField } from '../../components/FormField';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import type { DecisionResponse } from '../../domain/types';

interface DecisionLookupProps {
  readonly onDecision: (decision: DecisionResponse) => void;
}

/** Lookup form for the durable recorded decision endpoint. */
export function DecisionLookup({ onDecision }: DecisionLookupProps) {
  const [transactionId, setTransactionId] = useState('tx-ui-1001');
  const action = useAsyncAction<DecisionResponse>();

  const lookup = async () => {
    if (transactionId.trim().length < 3) {
      return;
    }
    const result = await action.run(() => fraudApi.getDecision(transactionId.trim()));
    if (result) {
      onDecision(result);
    }
  };

  return (
    <BankCard eyebrow="Durable read" title="Find recorded decision">
      <form className="inline-form" onSubmit={(event) => { event.preventDefault(); void lookup(); }}>
        <InputField label="Transaction ID" name="lookupTransactionId" value={transactionId} onChange={(event) => setTransactionId(event.target.value)} />
        <button className="button secondary" disabled={action.isLoading || transactionId.trim().length < 3} type="submit">
          {action.isLoading ? 'Searching…' : 'Lookup'}
        </button>
      </form>
      {action.error ? <Alert tone="error" message={action.error} details={action.details} /> : null}
    </BankCard>
  );
}
