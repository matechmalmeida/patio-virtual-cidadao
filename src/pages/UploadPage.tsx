import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertBanner } from '@/components/AlertBanner';
import { ArrowLeft, Upload, FileScan, CheckCircle2, X } from 'lucide-react';
import { submitPendencyFile } from '@/services/case.service';
import { getApiErrorMessage } from '@/services/http/api-error';

export default function UploadPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { currentCase, updateCase } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');

  if (!currentCase) return null;

  const pendency = currentCase.pendencies.find((p) => p.id === id);

  if (!pendency) {
    return (
      <div className="px-4 py-5">
        <AlertBanner variant="error">{t('upload.notFound')}</AlertBanner>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    try {
      const updatedPendencies = await submitPendencyFile(currentCase, id ?? '', file.name);
      updateCase(currentCase.id, { pendencies: updatedPendencies });
      setIsUploading(false);
      setUploaded(true);
    } catch (err) {
      setError(getApiErrorMessage(err, t('upload.uploadError')));
      setIsUploading(false);
    }
  };

  if (uploaded) {
    return (
      <div className="px-4 py-5 space-y-5">
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-xl font-bold">{t('upload.success')}</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto" dangerouslySetInnerHTML={{ __html: t('upload.successDesc', { name: pendency.name }) }} />
          <Button
            onClick={() => navigate('/pendencias')}
            className="mt-6 h-11 font-semibold"
          >
            {t('upload.backToPendencies')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div>
        <h1 className="text-xl font-bold">{t('upload.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{pendency.name}</p>
      </div>

      <AlertBanner variant="info" title={t('upload.whatToInclude')}>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>{t('upload.includeDate')}</li>
          <li>{t('upload.includeAmount')}</li>
          <li>{t('upload.includeName')}</li>
          <li>{t('upload.includeAuth')}</li>
        </ul>
      </AlertBanner>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      <Card className="border-0 shadow-md">
        <CardContent className="pt-5 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!file ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center gap-3 hover:bg-primary/5 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{t('upload.tapToSelect')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('upload.fileTypes')}
                </p>
              </div>
            </button>
          ) : (
            <div className="space-y-3">
              {preview ? (
                <div className="relative rounded-xl overflow-hidden border">
                  <img src={preview} alt="Preview" className="w-full max-h-64 object-contain bg-muted" />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-foreground/70 text-background flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                  <FileScan className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button onClick={handleRemoveFile}>
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              )}

              <Button
                onClick={handleUpload}
                className="w-full h-11 font-semibold"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t('upload.uploading')}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {t('upload.submit')}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
