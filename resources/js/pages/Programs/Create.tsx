import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ArrowLeft, Save, BookMarked } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programas y Planes',
        href: '/programs',
    },
    {
        title: 'Crear Programa',
        href: '/programs/create',
    },
];

export default function CreateProgram() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/programs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Programa - Programas y Planes" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/programs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Crear Nuevo Programa
                        </h1>
                        <p className="text-muted-foreground">
                            Crea un programa de entrenamiento mental para tus estudiantes
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookMarked className="w-5 h-5" />
                                Información del Programa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Program Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Programa *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Confianza y Rendimiento Deportivo"
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                {/* Program Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe los objetivos y contenido del programa..."
                                        rows={4}
                                        className={errors.description ? 'border-destructive' : ''}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Opcional. Ayuda a los estudiantes a entender el propósito del programa.
                                    </p>
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_active">Estado del Programa</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Los programas activos son visibles para los estudiantes inscritos
                                        </p>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Creando...' : 'Crear Programa'}
                                    </Button>
                                    <Link href="/programs">
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold">Próximos pasos</h3>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>• Después de crear el programa, podrás agregar niveles de aprendizaje</p>
                                    <p>• Cada nivel puede contener múltiples recursos multimedia</p>
                                    <p>• Los estudiantes deberán completar cada nivel antes de avanzar</p>
                                    <p>• Tú tendrás control manual sobre el desbloqueo de niveles</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}