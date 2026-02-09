import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';

export default function OTPPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const { phone, verifyOTP, caseCode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!caseCode) {
      navigate('/acesso', { replace: true });
    }
  }, [caseCode, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const maskedPhone = phone
    ? phone.replace(/(\(\d{2}\))\s(\d{1})\d{4}/, '$1 $2****')
    : '';

  const handleVerify = async () => {
    setError('');
    if (otp.length !== 6) {
      setError('Digite o código completo de 6 dígitos.');
      return;
    }

    try {
      const success = await verifyOTP(otp);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Código incorreto. Verifique e tente novamente.');
        setOtp('');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível validar o código.'));
      setOtp('');
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendTimer(60);
      setOtp('');
      setError('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 pt-6 pb-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/acesso')}
        className="self-start mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <Card className="max-w-md mx-auto w-full border-0 shadow-lg">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Verificação</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enviamos um código de 6 dígitos para
            </p>
            <p className="text-sm font-medium mt-0.5">{maskedPhone}</p>
          </div>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium text-center">{error}</p>
          )}

          <Button
            onClick={handleVerify}
            className="w-full h-12 text-base font-semibold"
            disabled={otp.length !== 6}
          >
            Verificar código
          </Button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Reenviar código em <span className="font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={isResending}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Reenviando...' : 'Reenviar código'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
