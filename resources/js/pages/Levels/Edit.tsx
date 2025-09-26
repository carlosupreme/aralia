import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MultimediaForm } from '@/components/MultimediaForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Target,
    BookOpen,
    Edit3
} from 'lucide-react';

interface MultimediaTypes {
    [key: string]: string;
}

interface Program {
    id: number;
    name: string;
    description?: string;
}

interface MultimediaItem {
    id?: number;
    name: string;
    description: string;
    url: string;
    type: string;
    size: string;
    duration: string;
}

interface Level {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    order_index: number;
    multimedia: MultimediaItem[];
}

interface Props {
    level: Level;
    program: Program;
    multimediaTypes: MultimediaTypes;
}

export default function EditLevel({ level, program, multimediaTypes }: Props) {
    const [multimedia, setMultimedia] = useState<MultimediaItem[]>(level.multimedia || []);

    const { data, setData, put, processing, errors } = useForm({
        name: level.name,
        description: level.description || '',
        is_active: level.is_active,
        multimedia: multimedia,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programas y Planes', href: '/programs' },
        { title: program.name, href: `/programs/${program.id}` },
        { title: `Editar Nivel: ${level.name}`, href: `/levels/${level.id}/edit` },
    ];

    const handleMultimediaChange = (updatedMultimedia: MultimediaItem[]) => {
        setMultimedia(updatedMultimedia);
        setData('multimedia', updatedMultimedia);
    };

    // Update form data when multimedia changes
    useEffect(() => {
        setData('multimedia', multimedia);
    }, [multimedia]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Ensure multimedia is up to date before submitting
        const formData = {
            ...data,
            multimedia: multimedia
        };

        console.log('Submitting level edit with data:', formData);
        console.log('Multimedia array:', multimedia);

        put(`/levels/${level.id}`, formData, {
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
            onSuccess: () => {
                console.log('Level updated successfully');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Nivel: ${level.name} - ${program.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/programs/${program.id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Edit3 className="w-8 h-8 text-primary" />
                            Editar Nivel: {level.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Modifica la información y contenido multimedia del nivel
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Level Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Información del Nivel
                                </CardTitle>
                                <CardDescription>
                                    Actualiza las características básicas del nivel de aprendizaje
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Level Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre del Nivel *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={`Ej: Fundamentos de la Concentración`}
                                            className={errors.name ? 'border-destructive' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Level Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe los objetivos y contenido de este nivel..."
                                            rows={3}
                                            className={errors.description ? 'border-destructive' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-destructive">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Active Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active">Estado del Nivel</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Los niveles activos son visibles en el programa
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button type="submit" disabled={processing} className="flex-1">
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Actualizando...' : 'Actualizar Nivel'}
                                        </Button>
                                        <Link href={`/programs/${program.id}`}>
                                            <Button type="button" variant="outline">
                                                Cancelar
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Level Context */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contexto del Nivel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Programa</p>
                                    <p className="font-medium">{program.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Posición</p>
                                    <Badge variant="outline">Nivel {level.order_index + 1}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Elementos multimedia</p>
                                    <p className="font-medium">{multimedia.length} elementos</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Estado</p>
                                    <Badge variant={level.is_active ? "default" : "secondary"}>
                                        {level.is_active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Tips */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm">💡 Consejos de Edición</h3>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>• Puedes reordenar el contenido multimedia arrastrando</p>
                                        <p>• Los cambios se guardarán automáticamente</p>
                                        <p>• Los elementos multimedia eliminados se borrarán permanentemente</p>
                                        <p>• Mantén el contenido progresivo y coherente</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Multimedia Section */}
                <MultimediaForm
                    multimedia={multimedia}
                    onChange={handleMultimediaChange}
                    multimediaTypes={multimediaTypes}
                    editMode={true}
                />
            </div>
        </AppLayout>
    );
}