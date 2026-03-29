import { z } from 'zod';

export function validateCPF(cpf: string): boolean {
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
}

const passwordSchema = z
  .string()
  .min(10, 'Senha deve ter pelo menos 10 caracteres')
  .regex(/[a-z]/, 'Deve conter pelo menos uma letra minuscula')
  .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiuscula')
  .regex(/[0-9]/, 'Deve conter pelo menos um numero')
  .regex(/[^a-zA-Z0-9]/, 'Deve conter pelo menos um caractere especial');

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string().email('E-mail invalido'),
  phone: z.string().max(20, 'Telefone muito longo').optional().or(z.literal('')),
  cpf: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || validateCPF(val.replace(/\D/g, '')), { message: 'CPF invalido' }),
  birth_date: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || new Date(val) <= new Date(), {
      message: 'Data de nascimento nao pode ser maior que hoje',
    }),
});

export const profilePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual e obrigatoria'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmacao e obrigatoria'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProfilePasswordFormData = z.infer<typeof profilePasswordSchema>;
