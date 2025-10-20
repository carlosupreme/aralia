// resources/js/Pages/auth/register.tsx

import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
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
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registro de Estudiante" />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-2xl mt-6 px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Registro de Estudiante
                    </h2>

                    <form onSubmit={submit}>
                        {/* Datos de Usuario */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="name">Nombre Completo *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1"
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-2">{errors.name}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-2">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password">Contraseña *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600 mt-2">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirmar Contraseña *</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-600 mt-2">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        {/* Datos del Estudiante */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Label htmlFor="date_of_birth">Fecha de Nacimiento *</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    className="mt-1"
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {errors.date_of_birth && (
                                    <p className="text-sm text-red-600 mt-2">{errors.date_of_birth}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="country">País *</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={data.country}
                                    className="mt-1"
                                    onChange={(e) => setData('country', e.target.value)}
                                    placeholder="Ej: México"
                                    required
                                />
                                {errors.country && (
                                    <p className="text-sm text-red-600 mt-2">{errors.country}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="city">Ciudad *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={data.city}
                                    className="mt-1"
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Ej: Oaxaca"
                                    required
                                />
                                {errors.city && (
                                    <p className="text-sm text-red-600 mt-2">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="team">Equipo</Label>
                                <Input
                                    id="team"
                                    name="team"
                                    value={data.team}
                                    className="mt-1"
                                    onChange={(e) => setData('team', e.target.value)}
                                    placeholder="Ej: Águilas FC"
                                />
                                {errors.team && (
                                    <p className="text-sm text-red-600 mt-2">{errors.team}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="sport">Deporte</Label>
                                <Input
                                    id="sport"
                                    name="sport"
                                    value={data.sport}
                                    className="mt-1"
                                    onChange={(e) => setData('sport', e.target.value)}
                                    placeholder="Ej: Fútbol, Básquetbol, Natación"
                                />
                                {errors.sport && (
                                    <p className="text-sm text-red-600 mt-2">{errors.sport}</p>
                                )}
                            </div>
                        </div>

                        {/* Datos del Padre/Tutor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Label htmlFor="parent_name">Nombre del Padre/Tutor *</Label>
                                <Input
                                    id="parent_name"
                                    name="parent_name"
                                    value={data.parent_name}
                                    className="mt-1"
                                    onChange={(e) => setData('parent_name', e.target.value)}
                                    placeholder="Ej: María González"
                                    required
                                />
                                {errors.parent_name && (
                                    <p className="text-sm text-red-600 mt-2">{errors.parent_name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="parent">Contacto del Padre/Tutor</Label>
                                <Input
                                    id="parent"
                                    name="parent"
                                    value={data.parent}
                                    className="mt-1"
                                    onChange={(e) => setData('parent', e.target.value)}
                                    placeholder="Teléfono o email"
                                />
                                {errors.parent && (
                                    <p className="text-sm text-red-600 mt-2">{errors.parent}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    className="underline text-sm text-gray-600 hover:text-gray-900"
                                >
                                    ¿Ya estás registrado?
                                </Link>
                                <Link
                                    href="/register/psychologist"
                                    className="underline text-sm text-blue-600 hover:text-blue-900"
                                >
                                    ¿Eres psicólogo? Regístrate aquí
                                </Link>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Registrando...' : 'Registrar Estudiante'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
