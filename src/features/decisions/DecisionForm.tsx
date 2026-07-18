import { useState } from 'react';
import { fraudApi } from '../../api/fraudApi';
import { Alert } from '../../components/Alert';
import { BankCard } from '../../components/BankCard';
import { InputField, SelectField } from '../../components/FormField';
import { sampleTransaction } from '../../domain/demoData';
import { flattenZodErrors, transactionRequestSchema } from '../../domain/validators';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import type { DecisionResponse, TransactionRequest } from '../../domain/types';

interface DecisionFormProps {
  readonly onDecision: (decision: DecisionResponse) => void;
}

type TransactionFormState = Record<keyof TransactionRequest, string>;

function toFormState(transaction: TransactionRequest): TransactionFormState {
  return {
    ...transaction,
    amount: String(transaction.amount)
  };
}

/** Main transaction scoring form backed by Zod validation before API submission. */
export function DecisionForm({ onDecision }: DecisionFormProps) {
  const [form, setForm] = useState<TransactionFormState>(toFormState(sampleTransaction));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const action = useAsyncAction<DecisionResponse>();

  const setField = (field: keyof TransactionRequest, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const submit = async () => {
    const payload = {
      ...form,
      amount: Number(form.amount)
    } satisfies TransactionRequest;

    const parsed = transactionRequestSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(flattenZodErrors(parsed.error));
      return;
    }

    const result = await action.run(() => fraudApi.scoreTransaction(parsed.data));
    if (result) {
      onDecision(result);
    }
  };

  const resetSample = () => {
    setForm(toFormState({ ...sampleTransaction, transactionId: `tx-ui-${Date.now()}`, occurredAt: new Date().toISOString() }));
    setFieldErrors({});
    action.reset();
  };

  return (
    <BankCard
      eyebrow="Synchronous API"
      title="Score transaction"
      actions={<button className="button ghost" type="button" onClick={resetSample}>New sample</button>}
    >
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <InputField label="Transaction ID" name="transactionId" value={form.transactionId} error={fieldErrors.transactionId} onChange={(event) => setField('transactionId', event.target.value)} />
        <InputField label="Customer ID" name="customerId" value={form.customerId} error={fieldErrors.customerId} onChange={(event) => setField('customerId', event.target.value)} />
        <InputField label="Merchant ID" name="merchantId" value={form.merchantId} error={fieldErrors.merchantId} onChange={(event) => setField('merchantId', event.target.value)} />
        <InputField label="Amount" name="amount" type="number" min="0" step="0.01" value={form.amount} error={fieldErrors.amount} onChange={(event) => setField('amount', event.target.value)} />
        <InputField label="Currency" name="currency" maxLength={3} value={form.currency} error={fieldErrors.currency} onChange={(event) => setField('currency', event.target.value.toUpperCase())} />
        <InputField label="Country" name="country" maxLength={2} value={form.country} error={fieldErrors.country} onChange={(event) => setField('country', event.target.value.toUpperCase())} />
        <SelectField label="Channel" name="channel" value={form.channel} error={fieldErrors.channel} onChange={(event) => setField('channel', event.target.value)}>
          <option value="ECOMMERCE">ECOMMERCE</option>
          <option value="POS">POS</option>
          <option value="ATM">ATM</option>
          <option value="MOBILE_APP">MOBILE_APP</option>
        </SelectField>
        <InputField label="Device ID" name="deviceId" value={form.deviceId} error={fieldErrors.deviceId} onChange={(event) => setField('deviceId', event.target.value)} />
        <InputField label="IPv4 address" name="ipAddress" value={form.ipAddress} error={fieldErrors.ipAddress} onChange={(event) => setField('ipAddress', event.target.value)} />
        <InputField label="Occurred at" name="occurredAt" value={form.occurredAt} error={fieldErrors.occurredAt} onChange={(event) => setField('occurredAt', event.target.value)} />

        <div className="form-actions span-2">
          <button className="button primary" disabled={action.isLoading} type="submit">
            {action.isLoading ? 'Scoring…' : 'Score transaction'}
          </button>
          <p>Decision is returned only after the backend records it in PostgreSQL.</p>
        </div>
      </form>
      {action.error ? <Alert tone="error" message={action.error} details={action.details} /> : null}
    </BankCard>
  );
}
