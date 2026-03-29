import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth';
import { PROFILE_QUERY_KEY } from './useProfile';
import {
  useChangeName,
  useInitiateEmailChange,
  useConfirmEmailChange,
  useChangePhone,
  useChangeCpf,
  useChangeBirthDate,
  getChangeNameErrorMessage,
  getChangeEmailErrorMessage,
  getChangePhoneErrorMessage,
  getChangeCpfErrorMessage,
  getChangeBirthDateErrorMessage,
} from '@/modules/auth/hooks/usePasswordSecurity';
import { profileSchema, validateCPF, type ProfileFormData } from '../schemas/profile.schemas';
import { formatPhone, formatCpf } from '../lib/formatters';

type ReauthAction = 'email' | 'phone' | 'cpf' | null;

export function useProfileBasicInfo(initialData: ProfileFormData) {
  const { toast } = useToast();
  const [reauthDialogOpen, setReauthDialogOpen] = useState(false);
  const [reauthAction, setReauthAction] = useState<ReauthAction>(null);

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingCpf, setEditingCpf] = useState(false);
  const [editingBirthDate, setEditingBirthDate] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');

  const [emailVerificationPending, setEmailVerificationPending] = useState(false);
  const [emailPendingToken, setEmailPendingToken] = useState<string | null>(null);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [emailMaskedEmail, setEmailMaskedEmail] = useState('');

  const { refreshUserData } = useAuth();
  const queryClient = useQueryClient();
  const changeNameMutation = useChangeName();
  const initiateEmailChangeMutation = useInitiateEmailChange();
  const confirmEmailChangeMutation = useConfirmEmailChange();
  const changePhoneMutation = useChangePhone();
  const changeCpfMutation = useChangeCpf();
  const changeBirthDateMutation = useChangeBirthDate();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const prevInitialDataRef = useRef(initialData);

  useEffect(() => {
    const changed =
      prevInitialDataRef.current.full_name !== initialData.full_name ||
      prevInitialDataRef.current.email !== initialData.email ||
      prevInitialDataRef.current.phone !== initialData.phone ||
      prevInitialDataRef.current.cpf !== initialData.cpf ||
      prevInitialDataRef.current.birth_date !== initialData.birth_date;

    prevInitialDataRef.current = initialData;

    if (changed && !editingName && !editingEmail && !editingPhone && !editingCpf && !editingBirthDate) {
      profileForm.reset(initialData);
    }
  }, [
    initialData,
    editingName,
    editingEmail,
    editingPhone,
    editingCpf,
    editingBirthDate,
    profileForm,
  ]);

  const invalidateProfile = async () => {
    await refreshUserData();
    await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
  };

  const handleRequestReauth = (action: ReauthAction) => {
    setReauthAction(action);
    setReauthDialogOpen(true);
  };

  const handleReauthSuccess = (token: string) => {
    if (reauthAction === 'email') {
      executeEmailChange(token);
    } else if (reauthAction === 'phone') {
      executePhoneChange(token);
    } else if (reauthAction === 'cpf') {
      executeCpfChange(token);
    }
  };

  const executeEmailChange = async (token: string) => {
    try {
      const response = await initiateEmailChangeMutation.mutateAsync({
        newEmail,
        reauthToken: token,
      });

      setEmailPendingToken(response.pendingToken);
      setEmailMaskedEmail(response.maskedEmail);
      setEmailVerificationCode('');
      setEmailVerificationPending(true);
      toast({
        title: 'C\u00f3digo enviado',
        description: `C\u00f3digo de verifica\u00e7\u00e3o enviado para ${response.maskedEmail}`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar e-mail',
        description: getChangeEmailErrorMessage(error as Error),
      });
    } finally {
      setReauthAction(null);
    }
  };

  const handleConfirmEmailChange = async (code?: string) => {
    const verificationCode = code || emailVerificationCode;
    if (!emailPendingToken || verificationCode.length !== 6) return;

    try {
      const response = await confirmEmailChangeMutation.mutateAsync({
        pendingToken: emailPendingToken,
        code: verificationCode,
      });

      toast({
        title: 'E-mail alterado',
        description: 'Seu e-mail foi alterado com sucesso.',
      });
      profileForm.setValue('email', response.email);
      setEditingEmail(false);
      setNewEmail('');
      setEmailVerificationPending(false);
      setEmailPendingToken(null);
      setEmailVerificationCode('');
      setEmailMaskedEmail('');
      await invalidateProfile();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao confirmar e-mail',
        description: getChangeEmailErrorMessage(error as Error),
      });
    }
  };

  const handleCancelEmailVerification = () => {
    setEmailVerificationPending(false);
    setEmailPendingToken(null);
    setEmailVerificationCode('');
    setEmailMaskedEmail('');
    setEditingEmail(false);
    setNewEmail('');
  };

  const executePhoneChange = async (token: string) => {
    try {
      const response = await changePhoneMutation.mutateAsync({
        newPhone: newPhone.replace(/\D/g, ''),
        reauthToken: token,
      });

      toast({
        title: 'Telefone alterado',
        description: 'Seu telefone foi alterado com sucesso.',
      });
      profileForm.setValue('phone', response.phone);
      setEditingPhone(false);
      setNewPhone('');
      await invalidateProfile();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar telefone',
        description: getChangePhoneErrorMessage(error as Error),
      });
    } finally {
      setReauthAction(null);
    }
  };

  const handleStartEditName = () => {
    setNewName(profileForm.getValues('full_name'));
    setEditingName(true);
  };

  const handleCancelEditName = () => {
    setEditingName(false);
    setNewName('');
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName.trim().length < 2) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'Nome deve ter pelo menos 2 caracteres.',
      });
      return;
    }

    if (newName.trim() === profileForm.getValues('full_name')) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'O novo nome deve ser diferente do atual.',
      });
      return;
    }

    try {
      const response = await changeNameMutation.mutateAsync({
        newName: newName.trim(),
      });

      toast({
        title: 'Nome alterado',
        description: 'Seu nome foi alterado com sucesso.',
      });
      profileForm.setValue('full_name', response.name);
      setEditingName(false);
      setNewName('');
      await invalidateProfile();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar nome',
        description: getChangeNameErrorMessage(error as Error),
      });
    }
  };

  const handleStartEditEmail = () => {
    setNewEmail(profileForm.getValues('email'));
    setEditingEmail(true);
  };

  const handleCancelEditEmail = () => {
    setEditingEmail(false);
    setNewEmail('');
    setEmailVerificationPending(false);
    setEmailPendingToken(null);
    setEmailVerificationCode('');
    setEmailMaskedEmail('');
  };

  const handleSaveEmail = () => {
    const isValidEmail = (email: string): boolean => {
      if (!email || email.length > 254) return false;
      const atIndex = email.indexOf('@');
      if (atIndex < 1) return false;
      if (email.lastIndexOf('@') !== atIndex) return false;
      const local = email.slice(0, atIndex);
      const domain = email.slice(atIndex + 1);
      if (!local || !domain || !domain.includes('.')) return false;
      if (email.includes(' ') || email.includes('\t') || email.includes('\n')) return false;
      return true;
    };

    if (!isValidEmail(newEmail)) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'Informe um e-mail v\u00e1lido.',
      });
      return;
    }

    if (newEmail === profileForm.getValues('email')) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'O novo e-mail deve ser diferente do atual.',
      });
      return;
    }

    handleRequestReauth('email');
  };

  const handleStartEditPhone = () => {
    setNewPhone(formatPhone(profileForm.getValues('phone') || ''));
    setEditingPhone(true);
  };

  const handleCancelEditPhone = () => {
    setEditingPhone(false);
    setNewPhone('');
  };

  const handleSavePhone = () => {
    const phoneDigits = newPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'Telefone deve ter 10 ou 11 d\u00edgitos.',
      });
      return;
    }

    const currentPhone = (profileForm.getValues('phone') || '').replace(/\D/g, '');
    if (phoneDigits === currentPhone) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'O novo telefone deve ser diferente do atual.',
      });
      return;
    }

    handleRequestReauth('phone');
  };

  const handleStartEditCpf = () => {
    setNewCpf(formatCpf(profileForm.getValues('cpf') || ''));
    setEditingCpf(true);
  };

  const handleCancelEditCpf = () => {
    setEditingCpf(false);
    setNewCpf('');
  };

  const handleSaveCpf = () => {
    const cpfDigits = newCpf.replace(/\D/g, '');

    if (!validateCPF(cpfDigits)) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'CPF inv\u00e1lido.',
      });
      return;
    }

    const currentCpf = (profileForm.getValues('cpf') || '').replace(/\D/g, '');
    if (cpfDigits === currentCpf) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'O novo CPF deve ser diferente do atual.',
      });
      return;
    }

    handleRequestReauth('cpf');
  };

  const executeCpfChange = async (token: string) => {
    try {
      const cpfDigits = newCpf.replace(/\D/g, '');
      const response = await changeCpfMutation.mutateAsync({
        newCpf: cpfDigits,
        reauthToken: token,
      });

      toast({
        title: 'CPF alterado',
        description: 'Seu CPF foi alterado com sucesso.',
      });
      profileForm.setValue('cpf', response.cpf);
      setEditingCpf(false);
      setNewCpf('');
      await invalidateProfile();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar CPF',
        description: getChangeCpfErrorMessage(error as Error),
      });
    } finally {
      setReauthAction(null);
    }
  };

  const handleStartEditBirthDate = () => {
    setNewBirthDate(profileForm.getValues('birth_date') || '');
    setEditingBirthDate(true);
  };

  const handleCancelEditBirthDate = () => {
    setEditingBirthDate(false);
    setNewBirthDate('');
  };

  const handleSaveBirthDate = async () => {
    if (!newBirthDate) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'Informe uma data de nascimento v\u00e1lida.',
      });
      return;
    }

    const selectedDate = new Date(newBirthDate);
    const today = new Date();
    if (selectedDate > today) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'Data de nascimento n\u00e3o pode ser maior que hoje.',
      });
      return;
    }

    const currentBirthDate = profileForm.getValues('birth_date') || '';
    if (newBirthDate === currentBirthDate) {
      toast({
        variant: 'destructive',
        title: 'Dados inv\u00e1lidos',
        description: 'A nova data de nascimento deve ser diferente da atual.',
      });
      return;
    }

    try {
      const response = await changeBirthDateMutation.mutateAsync({
        newBirthDate,
      });

      toast({
        title: 'Data de nascimento alterada',
        description: 'Sua data de nascimento foi alterada com sucesso.',
      });
      profileForm.setValue('birth_date', response.birthDate);
      setEditingBirthDate(false);
      setNewBirthDate('');
      await invalidateProfile();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar data de nascimento',
        description: getChangeBirthDateErrorMessage(error as Error),
      });
    }
  };

  const getReauthTitle = () => {
    if (reauthAction === 'email') return 'Confirmar altera\u00e7\u00e3o de e-mail';
    if (reauthAction === 'phone') return 'Confirmar altera\u00e7\u00e3o de telefone';
    if (reauthAction === 'cpf') return 'Confirmar altera\u00e7\u00e3o de CPF';
    return 'Confirmar identidade';
  };

  return {
    profileForm,
    reauthDialogOpen,
    setReauthDialogOpen,
    reauthAction,
    setReauthAction,
    handleReauthSuccess,
    getReauthTitle,
    name: {
      editing: editingName,
      value: newName,
      setValue: setNewName,
      isPending: changeNameMutation.isPending,
      onStartEdit: handleStartEditName,
      onCancelEdit: handleCancelEditName,
      onSave: handleSaveName,
    },
    email: {
      editing: editingEmail,
      value: newEmail,
      setValue: setNewEmail,
      isPending: initiateEmailChangeMutation.isPending || confirmEmailChangeMutation.isPending,
      onStartEdit: handleStartEditEmail,
      onCancelEdit: handleCancelEditEmail,
      onSave: handleSaveEmail,
    },
    emailVerification: {
      isPending: emailVerificationPending,
      maskedEmail: emailMaskedEmail,
      code: emailVerificationCode,
      setCode: setEmailVerificationCode,
      onConfirm: handleConfirmEmailChange,
      onCancel: handleCancelEmailVerification,
      isConfirming: confirmEmailChangeMutation.isPending,
    },
    phone: {
      editing: editingPhone,
      value: newPhone,
      setValue: setNewPhone,
      isPending: changePhoneMutation.isPending,
      onStartEdit: handleStartEditPhone,
      onCancelEdit: handleCancelEditPhone,
      onSave: handleSavePhone,
    },
    cpf: {
      editing: editingCpf,
      value: newCpf,
      setValue: setNewCpf,
      isPending: changeCpfMutation.isPending,
      onStartEdit: handleStartEditCpf,
      onCancelEdit: handleCancelEditCpf,
      onSave: handleSaveCpf,
    },
    birthDate: {
      editing: editingBirthDate,
      value: newBirthDate,
      setValue: setNewBirthDate,
      isPending: changeBirthDateMutation.isPending,
      onStartEdit: handleStartEditBirthDate,
      onCancelEdit: handleCancelEditBirthDate,
      onSave: handleSaveBirthDate,
    },
  };
}
