import { useId, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

interface BaseFieldProps {
  readonly error?: string | undefined;
  readonly hint?: string | undefined;
  readonly label: string;
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'aria-describedby' | 'aria-invalid'> {
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
}

interface SelectFieldProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'aria-describedby' | 'aria-invalid'> {
  readonly children: ReactNode;
}

/** Input wrapper with labels, hints, and accessible inline validation messages. */
export function InputField({ error, hint, label, id, ...props }: InputFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? props.name ?? generatedId;
  const descriptionId = error || hint ? `${fieldId}-description` : undefined;

  return (
    <label className="form-field" htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} aria-describedby={descriptionId} aria-invalid={Boolean(error)} {...props} />
      {error ? <small id={descriptionId} className="field-error">{error}</small> : hint ? <small id={descriptionId}>{hint}</small> : null}
    </label>
  );
}

/** Select wrapper matching the same accessible form-field pattern as text inputs. */
export function SelectField({ children, error, hint, label, id, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? props.name ?? generatedId;
  const descriptionId = error || hint ? `${fieldId}-description` : undefined;

  return (
    <label className="form-field" htmlFor={fieldId}>
      <span>{label}</span>
      <select id={fieldId} aria-describedby={descriptionId} aria-invalid={Boolean(error)} {...props}>
        {children}
      </select>
      {error ? <small id={descriptionId} className="field-error">{error}</small> : hint ? <small id={descriptionId}>{hint}</small> : null}
    </label>
  );
}
