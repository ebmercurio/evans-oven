import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------
interface FormProviderProps {
  children: any,
  onSubmit: () => void,
  methods: any,
}

export default function FormProvider(props: FormProviderProps) {
  const { children, onSubmit, methods } = props;
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
