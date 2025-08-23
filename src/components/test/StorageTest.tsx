import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Folder,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileAudio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}

interface Bucket {
  id: string;
  name: string;
  owner: string;
  public: boolean;
  created_at: string;
  updated_at: string;
}

const StorageTest: React.FC = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>('audio-files');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadBuckets();
  }, []);

  useEffect(() => {
    if (selectedBucket) {
      loadFiles(selectedBucket);
    }
  }, [selectedBucket]);

  const loadBuckets = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      setBuckets(data || []);
    } catch (err) {
      console.error('Erro ao carregar buckets:', err);
      setError('Erro ao carregar buckets de storage');
    }
  };

  const loadFiles = async (bucketName: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage.from(bucketName).list('', {
        limit: 100,
        offset: 0,
      });

      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      console.error('Erro ao carregar arquivos:', err);
      setError(`Erro ao carregar arquivos do bucket ${bucketName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createBucket = async (
    bucketName: string,
    isPublic: boolean = false
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        allowedMimeTypes: ['audio/*', 'application/pdf', 'text/*'],
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
      });

      if (error) throw error;

      setSuccess(`Bucket '${bucketName}' criado com sucesso!`);
      await loadBuckets();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao criar bucket:', err);
      setError(`Erro ao criar bucket: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createRequiredBuckets = async () => {
    const requiredBuckets = [
      { name: 'audio-files', public: false },
      { name: 'reports', public: false },
      { name: 'transcriptions', public: false },
    ];

    try {
      setIsLoading(true);
      setError(null);

      for (const bucket of requiredBuckets) {
        const bucketExists = buckets.some(b => b.name === bucket.name);
        if (!bucketExists) {
          await createBucket(bucket.name, bucket.public);
        }
      }

      setSuccess('Todos os buckets necessários foram criados!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao criar buckets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile || !selectedBucket) {
      setError('Selecione um arquivo e um bucket');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setUploadProgress(0);

      const fileName = `${Date.now()}_${selectedFile.name}`;

      const { error } = await supabase.storage
        .from(selectedBucket)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      setSuccess(`Arquivo '${selectedFile.name}' enviado com sucesso!`);
      setSelectedFile(null);

      // Resetar input de arquivo
      const fileInput = document.getElementById(
        'file-input'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      await loadFiles(selectedBucket);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      setError(`Erro ao fazer upload: ${err.message}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const downloadFile = async (fileName: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .download(fileName);

      if (error) throw error;

      // Criar URL temporária e fazer download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(`Arquivo '${fileName}' baixado com sucesso!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao baixar arquivo:', err);
      setError(`Erro ao baixar arquivo: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o arquivo '${fileName}'?`)) {
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.storage
        .from(selectedBucket)
        .remove([fileName]);

      if (error) throw error;

      setSuccess(`Arquivo '${fileName}' excluído com sucesso!`);
      await loadFiles(selectedBucket);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao excluir arquivo:', err);
      setError(`Erro ao excluir arquivo: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension || '')) {
      return <FileAudio className="h-4 w-4 text-blue-500" />;
    }
    return <FileAudio className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Teste de Integração com Supabase Storage
        </h1>
        <p className="text-gray-600">
          Teste o upload, download e gerenciamento de arquivos de áudio
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gerenciamento de Buckets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Buckets de Storage
            </CardTitle>
            <CardDescription>
              Gerenciar buckets do Supabase Storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Buckets Existentes ({buckets.length})</Label>
              <div className="space-y-2">
                {buckets.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nenhum bucket encontrado
                  </p>
                ) : (
                  buckets.map(bucket => (
                    <div
                      key={bucket.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedBucket === bucket.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBucket(bucket.name)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{bucket.name}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            bucket.public
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {bucket.public ? 'Público' : 'Privado'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button
              onClick={createRequiredBuckets}
              disabled={isLoading}
              className="w-full flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Folder className="h-4 w-4" />
              )}
              Criar Buckets Necessários
            </Button>
          </CardContent>
        </Card>

        {/* Upload de Arquivos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Arquivos
            </CardTitle>
            <CardDescription>
              Fazer upload de arquivos de áudio para teste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bucket-select">Bucket de Destino</Label>
              <select
                id="bucket-select"
                value={selectedBucket}
                onChange={e => setSelectedBucket(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={buckets.length === 0}
              >
                <option value="">Selecione um bucket</option>
                {buckets.map(bucket => (
                  <option key={bucket.id} value={bucket.name}>
                    {bucket.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="file-input">Selecionar Arquivo</Label>
              <Input
                id="file-input"
                type="file"
                accept="audio/*,.pdf,.txt,.doc,.docx"
                onChange={handleFileSelect}
                disabled={!selectedBucket}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Arquivo selecionado: {selectedFile.name} (
                  {formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <Button
              onClick={uploadFile}
              disabled={!selectedFile || !selectedBucket || isLoading}
              className="w-full flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isLoading ? 'Enviando...' : 'Fazer Upload'}
            </Button>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Arquivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Arquivos no Bucket: {selectedBucket || 'Nenhum selecionado'}
          </CardTitle>
          <CardDescription>
            Arquivos armazenados no bucket selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedBucket ? (
            <p className="text-gray-500 text-center py-8">
              Selecione um bucket para visualizar os arquivos
            </p>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando arquivos...</span>
            </div>
          ) : files.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum arquivo encontrado neste bucket
            </p>
          ) : (
            <div className="space-y-2">
              {files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.metadata?.size || 0)} •
                        {new Date(file.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(file.name)}
                      disabled={isLoading}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteFile(file.name)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageTest;
