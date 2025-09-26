import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/FileUpload';
import { cn } from '@/lib/utils';
import {
    Video,
    FileText,
    Image,
    Music,
    File,
    BookOpen,
    ExternalLink,
    Upload,
    Link as LinkIcon,
    Trash2,
    Edit,
    Check,
    X,
    GripVertical,
    Plus
} from 'lucide-react';

interface MultimediaTypes {
    [key: string]: string;
}

interface MultimediaItem {
    id?: number;
    name: string;
    description: string;
    url: string;
    type: string;
    size: string;
    duration: string;
    isUploaded?: boolean;
    isEditing?: boolean;
}

interface MultimediaFormProps {
    multimedia: MultimediaItem[];
    onChange: (multimedia: MultimediaItem[]) => void;
    multimediaTypes: MultimediaTypes;
    className?: string;
    editMode?: boolean;
}

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

const getTypeIcon = (type: string) => {
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

const getAcceptedTypes = (type: string) => {
    const typeMap = {
        video: ['video/*'],
        audio: ['audio/*'],
        image: ['image/*'],
        pdf: ['application/pdf'],
        document: [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain'
        ],
        text: ['text/plain', 'text/markdown', 'text/html']
    };
    return typeMap[type as keyof typeof typeMap] || ['*/*'];
};

export function MultimediaForm({ multimedia, onChange, multimediaTypes, className, editMode = false }: MultimediaFormProps) {
    const [currentType, setCurrentType] = useState<string>('video');
    const [showUpload, setShowUpload] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);

    const addMultimediaFromUpload = (uploadedFile: UploadedFile) => {
        const newItem: MultimediaItem = {
            name: uploadedFile.original_name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: '',
            url: uploadedFile.url,
            type: uploadedFile.type,
            size: uploadedFile.size,
            duration: uploadedFile.duration || '',
            isUploaded: true,
        };

        console.log('Adding multimedia from upload:', newItem);
        const newMultimedia = [...multimedia, newItem];
        console.log('New multimedia array:', newMultimedia);
        onChange(newMultimedia);
        setShowUpload(false);
    };

    const addManualMultimedia = () => {
        const newItem: MultimediaItem = {
            name: '',
            description: '',
            url: '',
            type: currentType,
            size: '',
            duration: '',
            isUploaded: false,
            isEditing: true,
        };

        console.log('Adding manual multimedia:', newItem);
        const newMultimedia = [...multimedia, newItem];
        console.log('New multimedia array:', newMultimedia);
        onChange(newMultimedia);
        setShowManualEntry(false);
    };

    const updateMultimedia = (index: number, field: keyof MultimediaItem, value: string) => {
        const updatedMultimedia = multimedia.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        onChange(updatedMultimedia);
    };

    const removeMultimedia = (index: number) => {
        const updatedMultimedia = multimedia.filter((_, i) => i !== index);
        onChange(updatedMultimedia);
    };

    const moveMultimedia = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === multimedia.length - 1)) {
            return;
        }

        const updatedMultimedia = [...multimedia];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [updatedMultimedia[index], updatedMultimedia[targetIndex]] = [updatedMultimedia[targetIndex], updatedMultimedia[index]];

        onChange(updatedMultimedia);
    };

    const toggleEdit = (index: number) => {
        const updatedMultimedia = multimedia.map((item, i) =>
            i === index ? { ...item, isEditing: !item.isEditing } : item
        );
        onChange(updatedMultimedia);
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* Add Content Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Contenido Multimedia
                            </CardTitle>
                            <CardDescription>
                                {editMode
                                    ? "Gestiona los recursos educativos del nivel. Puedes editar, reordenar o agregar nuevo contenido"
                                    : "Agrega recursos educativos subiendo archivos o ingresando URLs manualmente"
                                }
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {!showUpload && !showManualEntry && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="button"
                                onClick={() => setShowUpload(true)}
                                className="flex-1"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Subir Archivo
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowManualEntry(true)}
                                className="flex-1"
                            >
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Agregar URL
                            </Button>
                        </div>
                    )}

                    {/* File Upload Section */}
                    {showUpload && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Subir Archivo</h3>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowUpload(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Tipo de Contenido</Label>
                                    <Select value={currentType} onValueChange={setCurrentType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(multimediaTypes).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <FileUpload
                                acceptedTypes={getAcceptedTypes(currentType)}
                                maxSize={100}
                                onUploadComplete={addMultimediaFromUpload}
                                onError={(error) => console.error('Upload error:', error)}
                                multimediaType={currentType}
                            />
                        </div>
                    )}

                    {/* Manual Entry Section */}
                    {showManualEntry && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Agregar URL Manualmente</h3>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowManualEntry(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Contenido</Label>
                                    <Select value={currentType} onValueChange={setCurrentType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(multimediaTypes).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    type="button"
                                    onClick={addManualMultimedia}
                                    className="w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Entrada Manual
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Multimedia List */}
            {multimedia.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Contenido Agregado ({multimedia.length})
                    </h3>

                    {multimedia.map((item, index) => {
                        const Icon = getTypeIcon(item.type);
                        return (
                            <Card key={`${item.url}-${index}`} className="relative">
                                <CardContent className="p-4">
                                    {item.isEditing ? (
                                        /* Edit Mode */
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                    <Badge variant="outline" className="text-xs">
                                                        {multimediaTypes[item.type] || item.type}
                                                    </Badge>
                                                    {item.isUploaded && (
                                                        <Badge variant="default" className="text-xs">
                                                            Archivo Subido
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleEdit(index)}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeMultimedia(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Nombre *</Label>
                                                    <Input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => updateMultimedia(index, 'name', e.target.value)}
                                                        placeholder="Nombre del contenido"
                                                    />
                                                </div>

                                                {!item.isUploaded && (
                                                    <div className="space-y-2">
                                                        <Label>Tipo</Label>
                                                        <Select
                                                            value={item.type}
                                                            onValueChange={(value) => updateMultimedia(index, 'type', value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(multimediaTypes).map(([key, label]) => (
                                                                    <SelectItem key={key} value={key}>
                                                                        {label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                            </div>

                                            {!item.isUploaded && (
                                                <div className="space-y-2">
                                                    <Label>URL *</Label>
                                                    <Input
                                                        type="url"
                                                        value={item.url}
                                                        onChange={(e) => updateMultimedia(index, 'url', e.target.value)}
                                                        placeholder="https://ejemplo.com/archivo"
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label>Descripción</Label>
                                                <Textarea
                                                    value={item.description}
                                                    onChange={(e) => updateMultimedia(index, 'description', e.target.value)}
                                                    placeholder="Describe este contenido..."
                                                    rows={2}
                                                />
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Duración</Label>
                                                    <Input
                                                        type="text"
                                                        value={item.duration}
                                                        onChange={(e) => updateMultimedia(index, 'duration', e.target.value)}
                                                        placeholder="15 min"
                                                        disabled={item.isUploaded}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Tamaño</Label>
                                                    <Input
                                                        type="text"
                                                        value={item.size}
                                                        onChange={(e) => updateMultimedia(index, 'size', e.target.value)}
                                                        placeholder="25 MB"
                                                        disabled={item.isUploaded}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* View Mode */
                                        <div className="flex items-center gap-3">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move flex-shrink-0" />

                                            <Icon className="w-5 h-5 text-primary flex-shrink-0" />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium truncate">{item.name || 'Sin nombre'}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {multimediaTypes[item.type] || item.type}
                                                    </Badge>
                                                    {item.isUploaded && (
                                                        <Badge variant="default" className="text-xs">
                                                            Subido
                                                        </Badge>
                                                    )}
                                                </div>

                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    {item.size && <span>{item.size}</span>}
                                                    {item.duration && <span>{item.duration}</span>}
                                                    <span>#{index + 1}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-1 flex-shrink-0">
                                                {item.url && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                )}

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => moveMultimedia(index, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    ↑
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => moveMultimedia(index, 'down')}
                                                    disabled={index === multimedia.length - 1}
                                                >
                                                    ↓
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleEdit(index)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeMultimedia(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {multimedia.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Sin contenido multimedia</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Agrega videos, PDFs, imágenes u otros recursos educativos para este nivel
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}