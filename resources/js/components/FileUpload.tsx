import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
    Upload,
    File,
    X,
    CheckCircle,
    AlertCircle,
    Video,
    FileText,
    Image,
    Music,
    BookOpen,
    Loader2
} from 'lucide-react';
import axios from 'axios';

interface UploadedFile {
    url: string;
    path: string;
    filename: string;
    original_name: string;
    size: string;
    size_bytes: number;
    mime_type: string;
    type: string;
    duration?: string;
}

interface FileUploadProps {
    acceptedTypes: string[];
    maxSize?: number; // in MB
    onUploadComplete: (file: UploadedFile) => void;
    onError?: (error: string) => void;
    className?: string;
    multimediaType: string;
}

interface UploadingFile {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
    result?: UploadedFile;
}

const getFileIcon = (type: string) => {
    switch (type) {
        case 'video':
            return Video;
        case 'pdf':
        case 'document':
            return FileText;
        case 'image':
            return Image;
        case 'audio':
            return Music;
        case 'text':
            return BookOpen;
        default:
            return File;
    }
};

const getAcceptedExtensions = (multimediaType: string) => {
    const extensions = {
        video: ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
        audio: ['.mp3', '.wav', '.ogg', '.m4a', '.webm'],
        image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
        pdf: ['.pdf'],
        document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
        text: ['.txt', '.md', '.html']
    };
    return extensions[multimediaType as keyof typeof extensions] || [];
};

export function FileUpload({
    acceptedTypes,
    maxSize = 100,
    onUploadComplete,
    onError,
    className,
    multimediaType
}: FileUploadProps) {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);

    const uploadFile = useCallback(async (file: File) => {
        const uploadId = Date.now() + Math.random();

        // Add file to uploading list
        const uploadingFile: UploadingFile = {
            file,
            progress: 0,
            status: 'uploading'
        };

        setUploadingFiles(prev => [...prev, uploadingFile]);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', multimediaType);

        try {
            const response = await axios.post('/upload/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );

                    setUploadingFiles(prev =>
                        prev.map(uf =>
                            uf.file === file
                                ? { ...uf, progress: percentCompleted }
                                : uf
                        )
                    );
                },
            });

            if (response.data.success) {
                // Update file status to completed
                setUploadingFiles(prev =>
                    prev.map(uf =>
                        uf.file === file
                            ? { ...uf, status: 'completed', result: response.data.data }
                            : uf
                    )
                );

                // Call success callback
                onUploadComplete(response.data.data);

                // Remove from list after a short delay
                setTimeout(() => {
                    setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
                }, 2000);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al subir el archivo';

            setUploadingFiles(prev =>
                prev.map(uf =>
                    uf.file === file
                        ? { ...uf, status: 'error', error: errorMessage }
                        : uf
                )
            );

            onError?.(errorMessage);
        }
    }, [multimediaType, onUploadComplete, onError]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(uploadFile);
    }, [uploadFile]);

    const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
        onDrop,
        accept: {
            ...acceptedTypes.reduce((acc, type) => ({
                ...acc,
                [type]: []
            }), {} as Record<string, string[]>)
        },
        maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
        multiple: false, // Only single file upload
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
    });

    const removeUploadingFile = (file: File) => {
        setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
    };

    const Icon = getFileIcon(multimediaType);
    const acceptedExtensions = getAcceptedExtensions(multimediaType);

    return (
        <div className={cn('space-y-4', className)}>
            {/* Upload Area */}
            <Card
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed cursor-pointer transition-colors',
                    isDragActive || dropzoneActive
                        ? 'border-primary bg-primary/10'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                )}
            >
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <input {...getInputProps()} />

                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted">
                        {isDragActive || dropzoneActive ? (
                            <Upload className="w-8 h-8 text-primary" />
                        ) : (
                            <Icon className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                        {isDragActive || dropzoneActive
                            ? `Suelta tu archivo ${multimediaType} aquí`
                            : `Sube tu archivo ${multimediaType}`
                        }
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4">
                        Arrastra y suelta o haz clic para seleccionar
                    </p>

                    <div className="flex flex-wrap gap-1 justify-center mb-2">
                        {acceptedExtensions.map((ext) => (
                            <Badge key={ext} variant="secondary" className="text-xs">
                                {ext}
                            </Badge>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Máximo {maxSize}MB por archivo
                    </p>

                    <Button type="button" variant="outline" className="mt-4">
                        <Upload className="w-4 h-4 mr-2" />
                        Seleccionar Archivo
                    </Button>
                </CardContent>
            </Card>

            {/* Uploading Files */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-3">
                    {uploadingFiles.map((uploadingFile, index) => {
                        const { file, progress, status, error } = uploadingFile;

                        return (
                            <Card key={`${file.name}-${index}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {status === 'uploading' && (
                                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            )}
                                            {status === 'completed' && (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            )}
                                            {status === 'error' && (
                                                <AlertCircle className="w-5 h-5 text-destructive" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium truncate">
                                                    {file.name}
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeUploadingFile(file)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                {status === 'uploading' && (
                                                    <span>{progress}%</span>
                                                )}
                                                {status === 'completed' && (
                                                    <span className="text-green-600">Completado</span>
                                                )}
                                                {status === 'error' && (
                                                    <span className="text-destructive">Error</span>
                                                )}
                                            </div>

                                            {status === 'uploading' && (
                                                <Progress value={progress} className="h-2" />
                                            )}

                                            {status === 'error' && error && (
                                                <Alert className="mt-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription className="text-xs">
                                                        {error}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}