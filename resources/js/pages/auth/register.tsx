import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, BookOpen, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Program {
    id: number;
    name: string;
    description: string;
    monthly_price: string;
    psychologist: {
        id: number;
        name: string;
    };
}

interface Props {
    programs: Program[];
}

export default function Register({ programs }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        team: '',
        sport: '',
        country: '',
        city: '',
        parent: '',
        parent_name: '',
        program_id: '',
    });

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(data.name && data.email);
            case 2:
                return !!(data.password && data.password_confirmation);
            case 3:
                return !!(data.date_of_birth && data.country && data.city);
            case 4:
                return !!data.parent_name;
            case 5:
                return !!data.program_id;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors) => {
                console.error('Errores de validación:', errors);
                // Redirigir al paso donde está el error
                if (errors.name || errors.email) {
                    setCurrentStep(1);
                } else if (errors.password || errors.password_confirmation) {
                    setCurrentStep(2);
                } else if (errors.date_of_birth || errors.country || errors.city || errors.team || errors.sport) {
                    setCurrentStep(3);
                } else if (errors.parent_name || errors.parent) {
                    setCurrentStep(4);
                } else if (errors.program_id) {
                    setCurrentStep(5);
                }
            },
        });
    };

    const progress = (currentStep / totalSteps) * 100;

    return (
        <>
            <Head title="Registro de Estudiante" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Registro de Deportistas
                            </h2>
                            <p className="text-sm text-gray-500">
                                Paso {currentStep} de {totalSteps}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-8 pb-6">
                            <Progress value={progress} className="h-1.5" />
                        </div>

                        {/* Form Content */}
                        <div className="px-8 pb-8">
                            {/* Step 1: Datos Básicos */}
                            {currentStep === 1 && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Nombre Completo
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            autoComplete="name"
                                            autoFocus
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`h-11 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            placeholder="Ingresa tu nombre completo"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            placeholder="tu@email.com"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contraseña */}
                            {currentStep === 2 && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`h-11 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            placeholder="••••••••"
                                        />
                                        {errors.password && (
                                            <p className="text-xs text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                            Confirmar Contraseña
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="h-11"
                                            placeholder="••••••••"
                                        />
                                        {errors.password_confirmation && (
                                            <p className="text-xs text-red-600">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Datos del Estudiante */}
                            {currentStep === 3 && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth" className="text-sm font-medium">
                                            Fecha de Nacimiento
                                        </Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            name="date_of_birth"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="h-11"
                                        />
                                        {errors.date_of_birth && (
                                            <p className="text-xs text-red-600">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-sm font-medium">
                                            País
                                        </Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder="México"
                                            className="h-11"
                                        />
                                        {errors.country && (
                                            <p className="text-xs text-red-600">{errors.country}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-sm font-medium">
                                            Ciudad
                                        </Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Oaxaca"
                                            className="h-11"
                                        />
                                        {errors.city && (
                                            <p className="text-xs text-red-600">{errors.city}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="team" className="text-sm font-medium text-gray-600">
                                            Equipo (opcional)
                                        </Label>
                                        <Input
                                            id="team"
                                            name="team"
                                            value={data.team}
                                            onChange={(e) => setData('team', e.target.value)}
                                            placeholder="Águilas FC"
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sport" className="text-sm font-medium text-gray-600">
                                            Deporte (opcional)
                                        </Label>
                                        <Input
                                            id="sport"
                                            name="sport"
                                            value={data.sport}
                                            onChange={(e) => setData('sport', e.target.value)}
                                            placeholder="Fútbol, Básquetbol..."
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Datos del Padre/Tutor */}
                            {currentStep === 4 && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="parent_name" className="text-sm font-medium">
                                            Nombre del Padre/Tutor
                                        </Label>
                                        <Input
                                            id="parent_name"
                                            name="parent_name"
                                            value={data.parent_name}
                                            onChange={(e) => setData('parent_name', e.target.value)}
                                            placeholder="María González"
                                            className="h-11"
                                        />
                                        {errors.parent_name && (
                                            <p className="text-xs text-red-600">{errors.parent_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="parent" className="text-sm font-medium text-gray-600">
                                            Contacto del Padre/Tutor (opcional)
                                        </Label>
                                        <Input
                                            id="parent"
                                            name="parent"
                                            value={data.parent}
                                            onChange={(e) => setData('parent', e.target.value)}
                                            placeholder="Teléfono o email"
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Selección de Programa */}
                            {currentStep === 5 && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">
                                            Selecciona tu Programa de Entrenamiento
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                            Elige el programa en el que deseas inscribirte
                                        </p>

                                        {programs && programs.length > 0 ? (
                                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                                {programs.map((program) => (
                                                    <Card
                                                        key={program.id}
                                                        className={`cursor-pointer transition-all hover:shadow-md ${
                                                            data.program_id === program.id.toString()
                                                                ? 'ring-2 ring-primary border-primary'
                                                                : 'border-gray-200'
                                                        }`}
                                                        onClick={() => setData('program_id', program.id.toString())}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className={`p-2 rounded-lg ${
                                                                    data.program_id === program.id.toString()
                                                                        ? 'bg-primary/10'
                                                                        : 'bg-gray-100'
                                                                }`}>
                                                                    <BookOpen className={`w-5 h-5 ${
                                                                        data.program_id === program.id.toString()
                                                                            ? 'text-primary'
                                                                            : 'text-gray-600'
                                                                    }`} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-semibold text-sm mb-1">
                                                                        {program.name}
                                                                    </h3>
                                                                    {program.description && (
                                                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                                            {program.description}
                                                                        </p>
                                                                    )}
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                            <Users className="w-3 h-3" />
                                                                            <span>Psicólogo: {program.psychologist.name}</span>
                                                                        </div>
                                                                        {program.monthly_price && parseFloat(program.monthly_price) > 0 && (
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-sm font-semibold text-primary">
                                                                                    ${parseFloat(program.monthly_price).toFixed(2)}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">/mes</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm">No hay programas disponibles en este momento</p>
                                            </div>
                                        )}

                                        {errors.program_id && (
                                            <p className="text-xs text-red-600">{errors.program_id}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="h-11"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Atrás
                                </Button>

                                {currentStep < totalSteps ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!validateStep(currentStep)}
                                        className="h-11"
                                    >
                                        Siguiente
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={submit}
                                        disabled={processing || !validateStep(currentStep)}
                                        className="h-11"
                                    >
                                        {processing ? 'Registrando...' : 'Completar Registro'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-2">
                        <Link
                            href="/login"
                            className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            ¿Ya estás registrado? <span className="font-medium">Inicia sesión</span>
                        </Link>

                    </div>
                </div>
            </div>
        </>
    );
}
