// resources/js/Pages/auth/register-psychologist.tsx

import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPsychologist() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register/psychologist', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registro de Psicólogo" />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Registro de Psicólogo
                    </h2>

                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nombre Completo</Label>
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

                            <div>
                                <Label htmlFor="email">Email</Label>
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
                                <Label htmlFor="password">Contraseña</Label>
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
                                <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
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

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    className="underline text-sm text-gray-600 hover:text-gray-900"
                                >
                                    ¿Ya estás registrado?
                                </Link>
                                <Link
                                    href="/register"
                                    className="underline text-sm text-blue-600 hover:text-blue-900"
                                >
                                    ¿Eres estudiante? Regístrate aquí
                                </Link>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Registrando...' : 'Registrar Psicólogo'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
