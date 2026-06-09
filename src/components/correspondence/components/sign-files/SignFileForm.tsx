import { useEffect, useState } from 'react';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { SignFile } from '../../types/sign-file.type.ts';
import { useFormValidation } from '../../../../hooks/useFormValidation.ts';
import Label from '../../../form/Label.tsx';
import InputField from '../../../form/input/InputField.tsx';
import Button from '../../../ui/button/Button.tsx';

interface Props {
  SignFiles?: SignFile[] | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SignFileForm({ SignFiles, onSuccess, onCancel }: Props) {
  const { values, errors, setValue, setMultipleErrors } = useFormValidation({
    token: 'Smartcard en terminal 0 FT ePass2003Auto 000',
    pin: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setValue('token', '');
    setValue('pin', '');
  }, [SignFiles]);

  function validate() {
    const newErrors: any = {};

    if (!values.token) newErrors.formName = 'El token es requerido';
    if (!values.pin) newErrors.formName = 'El pin es requerido';

    setMultipleErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        token: values.token.trim(),
        pin: values.pin,
      };
      console.log(payload);

      // await createSignFile(payload);

      addNotification({
        type: 'success',
        title: 'Firmado correctamente',
        message: `El permiso ${values.pin} fue firmado correctamente.`,
      });

      onSuccess();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };

      const message = axiosErr?.response?.data?.message ?? 'Error al guardar';

      addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>
          Token <span className="text-error-500">*</span>
        </Label>

        <InputField
          value={values.token}
          onChange={(e) => setValue('token', e.target.value)}
          placeholder="Smartcard en terminal 0 FT ePass2003Auto 000"
          error={!!errors.token}
          hint={errors.token}
          disabled
        />
      </div>

      <div>
        <Label>
          PIN<span className="text-error-500">*</span>
        </Label>
        <InputField
          value={values.pin}
          onChange={(e) => setValue('pin', e.target.value)}
          placeholder="Ingre su pin"
          error={!!errors.pin}
          hint={errors.pin}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Firmando' : 'Firmar'}
        </Button>
      </div>
    </form>
  );
}
