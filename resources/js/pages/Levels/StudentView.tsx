import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft,
    ArrowRight,
    Play,
    Download,
    ExternalLink,
    BookOpen,
    Video,
    FileText,
    Image,
    Music,
    File,
    CheckCircle,
    Clock,
    Menu,
    X
} from 'lucide-react';

interface MultimediaItem {
    id: number;
    name: string;
    description?: string;
    url: string;
    type: 'video' | 'pdf' | 'image' | 'text' | 'audio' | 'document';
    size?: string;
    duration?: string;
    order_index: number;
}

interface Program {
    id: number;
    name: string;
    description?: string;
}

interface Level {
    id: number;
    name: string;
    description?: string;
    order_index: number;
    multimedia: MultimediaItem[];
    program: Program;
}

interface LevelNavItem {
    id: number;
    name: string;
    order_index: number;
}

interface Props {
    level: Level;
    allLevels: LevelNavItem[];
    currentLevelIndex: number;
}

const getMultimediaIcon = (type: string) => {
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

const getMultimediaColor = (type: string) => {
    switch (type) {
        case 'video':
            return 'text-red-600';
        case 'pdf':
        case 'document':
            return 'text-blue-600';
        case 'image':
            return 'text-green-600';
        case 'audio':
            return 'text-purple-600';
        case 'text':
            return 'text-orange-600';
        default:
            return 'text-gray-600';
    }
};

export default function StudentView({ level, allLevels, currentLevelIndex }: Props) {
    const [selectedMedia, setSelectedMedia] = useState<MultimediaItem | null>(
        level.multimedia.length > 0 ? level.multimedia[0] : null
    );
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const progressUpdateInterval = useRef<NodeJS.Timeout | null>(null);

    // Load video progress when media changes
    useEffect(() => {
        if (selectedMedia && selectedMedia.type === 'video') {
            loadVideoProgress(selectedMedia.id);
        }

        // Cleanup interval on unmount or media change
        return () => {
            if (progressUpdateInterval.current) {
                clearInterval(progressUpdateInterval.current);
            }
        };
    }, [selectedMedia]);

    // Load saved video progress
    const loadVideoProgress = async (multimediaId: number) => {
        try {
            const response = await axios.get(`/multimedia/${multimediaId}/progress`);
            setVideoProgress(response.data.current_time);

            // Set video current time when metadata is loaded
            if (videoRef.current) {
                const setTime = () => {
                    if (videoRef.current && response.data.current_time > 0) {
                        videoRef.current.currentTime = response.data.current_time;
                    }
                };

                if (videoRef.current.readyState >= 1) {
                    setTime();
                } else {
                    videoRef.current.addEventListener('loadedmetadata', setTime, { once: true });
                }
            }
        } catch (error) {
            console.error('Failed to load video progress:', error);
        }
    };

    // Save video progress
    const saveVideoProgress = async (multimediaId: number, currentTime: number, duration: number) => {
        try {
            await axios.post(`/multimedia/${multimediaId}/progress`, {
                current_time: Math.floor(currentTime),
                duration: Math.floor(duration),
            });
        } catch (error) {
            console.error('Failed to save video progress:', error);
        }
    };

    // Handle video timeupdate
    const handleVideoTimeUpdate = () => {
        if (!videoRef.current || !selectedMedia) return;

        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;

        // Save progress every 5 seconds
        if (progressUpdateInterval.current === null) {
            progressUpdateInterval.current = setInterval(() => {
                if (videoRef.current && selectedMedia) {
                    saveVideoProgress(
                        selectedMedia.id,
                        videoRef.current.currentTime,
                        videoRef.current.duration
                    );
                }
            }, 5000);
        }
    };

    // Handle video pause - save immediately
    const handleVideoPause = () => {
        if (videoRef.current && selectedMedia) {
            saveVideoProgress(
                selectedMedia.id,
                videoRef.current.currentTime,
                videoRef.current.duration
            );
        }
    };

    // Convert duration string (MM:SS) to seconds
    const durationToSeconds = (duration?: string): number => {
        if (!duration) return 0;
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 0;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programas y Planes', href: '/programs' },
        { title: level.program.name, href: `/programs/${level.program.id}` },
        { title: `Aprender: ${level.name}`, href: `/levels/${level.id}/learn` },
    ];

    const progress = Math.round(((currentLevelIndex + 1) / allLevels.length) * 100);
    const previousLevel = currentLevelIndex > 0 ? allLevels[currentLevelIndex - 1] : null;
    const nextLevel = currentLevelIndex < allLevels.length - 1 ? allLevels[currentLevelIndex + 1] : null;

    const renderMediaContent = () => {
        if (!selectedMedia) {
            return (
                <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg">
                    <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sin contenido seleccionado</h3>
                    <p className="text-muted-foreground text-center">
                        Selecciona un elemento multimedia de la lista para comenzar
                    </p>
                </div>
            );
        }

        const mediaUrl = selectedMedia.url.startsWith('/storage/')
            ? `${window.location.origin}${selectedMedia.url}`
            : selectedMedia.url;

        switch (selectedMedia.type) {
            case 'video':
                // Check if video is longer than 5 minutes (300 seconds)
                const videoDurationSeconds = durationToSeconds(selectedMedia.duration);
                const useStreaming = videoDurationSeconds > 300;
                const videoSrc = useStreaming
                    ? `/multimedia/${selectedMedia.id}/stream`
                    : mediaUrl;

                return (
                    <div className="w-full">
                        <video
                            ref={videoRef}
                            controls
                            className="w-full h-auto rounded-lg shadow-md"
                            poster=""
                            onTimeUpdate={handleVideoTimeUpdate}
                            onPause={handleVideoPause}
                            onEnded={handleVideoPause}
                        >
                            <source src={videoSrc} type="video/mp4" />
                            Tu navegador no soporta el elemento video.
                        </video>
                        {useStreaming && (
                            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Streaming de video - {selectedMedia.duration}
                            </div>
                        )}
                    </div>
                );

            case 'pdf':
            case 'document':
                return (
                    <div className="w-full h-96 bg-muted/30 rounded-lg flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-blue-600 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{selectedMedia.name}</h3>
                        <p className="text-muted-foreground mb-4 text-center">
                            Documento PDF - {selectedMedia.size}
                        </p>
                        <div className="flex gap-2">
                            <Button asChild>
                                <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ver en nueva pestaña
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href={mediaUrl} download>
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar
                                </a>
                            </Button>
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className="w-full">
                        <img
                            src={mediaUrl}
                            alt={selectedMedia.name}
                            className="w-full h-auto rounded-lg shadow-md max-h-96 object-contain mx-auto"
                        />
                    </div>
                );

            case 'audio':
                return (
                    <div className="w-full">
                        <div className="bg-muted/30 rounded-lg p-8 text-center mb-4">
                            <Music className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{selectedMedia.name}</h3>
                        </div>
                        <audio controls className="w-full">
                            <source src={mediaUrl} />
                            Tu navegador no soporta el elemento audio.
                        </audio>
                    </div>
                );

            default:
                return (
                    <div className="w-full h-96 bg-muted/30 rounded-lg flex flex-col items-center justify-center">
                        <File className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{selectedMedia.name}</h3>
                        <p className="text-muted-foreground mb-4">
                            {selectedMedia.type} - {selectedMedia.size}
                        </p>
                        <Button asChild>
                            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Abrir archivo
                            </a>
                        </Button>
                    </div>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Aprender: ${level.name} - ${level.program.name}`} />

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r bg-background`}>
                    <div className="p-6 space-y-6">
                        {/* Program Progress */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">Progreso del Programa</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Nivel {currentLevelIndex + 1} de {allLevels.length}</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        </div>

                        <Separator />

                        {/* Level Navigation */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">Niveles del Programa</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {allLevels.map((levelItem, index) => (
                                    <Link
                                        key={levelItem.id}
                                        href={`/levels/${levelItem.id}/learn`}
                                        className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${
                                            levelItem.id === level.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                            index < currentLevelIndex
                                                ? 'bg-green-500 text-white'
                                                : index === currentLevelIndex
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {index < currentLevelIndex ? (
                                                <CheckCircle className="w-3 h-3" />
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </div>
                                        <span className="flex-1 truncate">{levelItem.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Multimedia List */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">Contenido del Nivel</h3>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {level.multimedia.map((media, index) => {
                                    const Icon = getMultimediaIcon(media.type);
                                    const colorClass = getMultimediaColor(media.type);

                                    return (
                                        <button
                                            key={media.id}
                                            onClick={() => setSelectedMedia(media)}
                                            className={`w-full flex items-start gap-3 p-3 rounded-md text-left transition-colors ${
                                                selectedMedia?.id === media.id
                                                    ? 'bg-primary/10 border border-primary/20'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium truncate">{media.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {media.type}
                                                    </Badge>
                                                    {media.duration && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {media.duration}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}

                                {level.multimedia.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BookOpen className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-sm">No hay contenido disponible</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="border-b p-6">
                        <div className="flex items-center gap-4">
                            {!sidebarOpen && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu className="w-4 h-4" />
                                </Button>
                            )}

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-bold">{level.name}</h1>
                                    <Badge>Nivel {currentLevelIndex + 1}</Badge>
                                </div>
                                {level.description && (
                                    <p className="text-muted-foreground">{level.description}</p>
                                )}
                            </div>

                            {selectedMedia && (
                                <div className="text-sm text-muted-foreground">
                                    {level.multimedia.findIndex(m => m.id === selectedMedia.id) + 1} de {level.multimedia.length}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            {selectedMedia && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h2 className="text-lg font-semibold">{selectedMedia.name}</h2>
                                        <Badge variant="outline">{selectedMedia.type}</Badge>
                                    </div>
                                    {selectedMedia.description && (
                                        <p className="text-muted-foreground mb-6">{selectedMedia.description}</p>
                                    )}
                                </div>
                            )}

                            {renderMediaContent()}
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="border-t p-6">
                        <div className="flex items-center justify-between">
                            {previousLevel ? (
                                <Link href={`/levels/${previousLevel.id}/learn`}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        Nivel Anterior: {previousLevel.name}
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={`/programs/${level.program.id}`}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        Volver al Programa
                                    </Button>
                                </Link>
                            )}

                            {nextLevel ? (
                                <Link href={`/levels/${nextLevel.id}/learn`}>
                                    <Button className="flex items-center gap-2">
                                        Siguiente Nivel: {nextLevel.name}
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={`/programs/${level.program.id}`}>
                                    <Button className="flex items-center gap-2">
                                        Completar Programa
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}