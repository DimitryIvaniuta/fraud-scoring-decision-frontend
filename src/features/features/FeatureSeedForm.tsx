import { useState } from 'react';
import { fraudApi } from '../../api/fraudApi';
import { Alert } from '../../components/Alert';
import { BankCard } from '../../components/BankCard';
import { InputField, SelectField } from '../../components/FormField';
import { sampleFeatureSnapshot } from '../../domain/demoData';
import type { FeatureSnapshot } from '../../domain/types';
import { featureSnapshotSchema, flattenZodErrors } from '../../domain/validators';
import { useAsyncAction } from '../../hooks/useAsyncAction';

type FeatureFormState = Omit<Record<keyof FeatureSnapshot, string>, 'highRiskCountry'> & {
  readonly highRiskCountry: string;
};

function toFormState(snapshot: FeatureSnapshot): FeatureFormState {
  return {
    ...snapshot,
    averageAmount: String(snapshot.averageAmount),
    chargebackRate: String(snapshot.chargebackRate),
    highRiskCountry: String(snapshot.highRiskCountry),
    accountAgeDays: String(snapshot.accountAgeDays),
    velocity24h: String(snapshot.velocity24h),
    priorDeclines24h: String(snapshot.priorDeclines24h)
  };
}

/** Feature seeding form used to prepare Redis/PostgreSQL feature fallback data for local tests. */
export function FeatureSeedForm() {
  const [form, setForm] = useState<FeatureFormState>(toFormState(sampleFeatureSnapshot));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const action = useAsyncAction<FeatureSnapshot>();

  const setField = (field: keyof FeatureFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const submit = async () => {
    const payload: FeatureSnapshot = {
      ...form,
      averageAmount: Number(form.averageAmount),
      chargebackRate: Number(form.chargebackRate),
      highRiskCountry: form.highRiskCountry === 'true',
      accountAgeDays: Number(form.accountAgeDays),
      velocity24h: Number(form.velocity24h),
      priorDeclines24h: Number(form.priorDeclines24h),
      source: form.source as FeatureSnapshot['source']
    };

    const parsed = featureSnapshotSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(flattenZodErrors(parsed.error));
      return;
    }

    await action.run(() => fraudApi.seedFeatures(parsed.data));
  };

  return (
    <BankCard eyebrow="Feature cache" title="Seed feature snapshot">
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <InputField label="Customer ID" name="featureCustomerId" value={form.customerId} error={fieldErrors.customerId} onChange={(event) => setField('customerId', event.target.value)} />
        <InputField label="Merchant ID" name="featureMerchantId" value={form.merchantId} error={fieldErrors.merchantId} onChange={(event) => setField('merchantId', event.target.value)} />
        <InputField label="Average amount" name="averageAmount" type="number" min="0" step="0.01" value={form.averageAmount} error={fieldErrors.averageAmount} onChange={(event) => setField('averageAmount', event.target.value)} />
        <InputField label="Chargeback rate" name="chargebackRate" type="number" min="0" max="1" step="0.001" value={form.chargebackRate} error={fieldErrors.chargebackRate} onChange={(event) => setField('chargebackRate', event.target.value)} />
        <SelectField label="High-risk country" name="highRiskCountry" value={form.highRiskCountry} error={fieldErrors.highRiskCountry} onChange={(event) => setField('highRiskCountry', event.target.value)}>
          <option value="false">false</option>
          <option value="true">true</option>
        </SelectField>
        <InputField label="Account age days" name="accountAgeDays" type="number" min="0" step="1" value={form.accountAgeDays} error={fieldErrors.accountAgeDays} onChange={(event) => setField('accountAgeDays', event.target.value)} />
        <InputField label="Velocity 24h" name="velocity24h" type="number" min="0" step="1" value={form.velocity24h} error={fieldErrors.velocity24h} onChange={(event) => setField('velocity24h', event.target.value)} />
        <InputField label="Prior declines 24h" name="priorDeclines24h" type="number" min="0" step="1" value={form.priorDeclines24h} error={fieldErrors.priorDeclines24h} onChange={(event) => setField('priorDeclines24h', event.target.value)} />
        <SelectField label="Source" name="source" value={form.source} error={fieldErrors.source} onChange={(event) => setField('source', event.target.value)}>
          <option value="REDIS">REDIS</option>
          <option value="POSTGRESQL">POSTGRESQL</option>
          <option value="ENRICHED">ENRICHED</option>
          <option value="FALLBACK">FALLBACK</option>
        </SelectField>
        <InputField label="Refreshed at" name="refreshedAt" value={form.refreshedAt} error={fieldErrors.refreshedAt} onChange={(event) => setField('refreshedAt', event.target.value)} />

        <div className="form-actions span-2">
          <button className="button primary" disabled={action.isLoading} type="submit">
            {action.isLoading ? 'Saving…' : 'Seed features'}
          </button>
          <p>Backend writes durable feature fallback and updates Redis cache.</p>
        </div>
      </form>
      {action.error ? <Alert tone="error" message={action.error} details={action.details} /> : null}
      {action.data ? <Alert tone="success" message={`Feature snapshot saved for ${action.data.customerId}/${action.data.merchantId}.`} /> : null}
    </BankCard>
  );
}
