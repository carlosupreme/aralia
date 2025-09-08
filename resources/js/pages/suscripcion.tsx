import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    CreditCard, 
    Crown,
    Check,
    X,
    Calendar,
    Target,
    Video,
    Trophy,
    Zap,
    AlertCircle,
    Receipt,
    Download
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Suscripción y Facturación',
        href: '/suscripcion',
    },
];

// Mock data para planes de precios
const pricingPlans = [
    {
        id: 'free',
        name: 'Gratuito',
        price: 0,
        currency: 'USD',
        period: 'mes',
        popular: false,
        description: 'Perfecto para comenzar tu entrenamiento mental',
        features: [
            { name: 'Acceso a 1 nivel (Fundamentos)', included: true },
            { name: 'Contenido básico de psicología deportiva', included: true },
            { name: 'Seguimiento básico de progreso', included: true },
            { name: 'Logros limitados', included: true },
            { name: 'Videollamadas mensuales', included: false },
            { name: 'Acceso a todos los niveles', included: false },
            { name: 'Contenido premium', included: false },
            { name: 'Soporte prioritario', included: false },
        ],
        buttonText: 'Plan Actual',
        buttonVariant: 'secondary' as const,
        limitations: 'Solo acceso al primer nivel de entrenamiento'
    },
    {
        id: 'deportista',
        name: 'Deportista',
        price: 39.99,
        currency: 'USD',
        period: 'mes',
        popular: true,
        description: 'Entrenamiento mental completo con seguimiento personalizado',
        features: [
            { name: 'Acceso completo a todos los 6 niveles', included: true },
            { name: 'Todo el contenido multimedia premium', included: true },
            { name: 'Videollamada mensual de 45 min con psicólogo', included: true },
            { name: 'Seguimiento avanzado de progreso', included: true },
            { name: 'Todos los logros y sistema de gamificación', included: true },
            { name: 'Planes de entrenamiento personalizados', included: true },
            { name: 'Soporte prioritario 24/7', included: true },
            { name: 'Certificado de completion', included: true },
        ],
        buttonText: 'Mejorar a Deportista',
        buttonVariant: 'default' as const,
        benefits: 'Incluye todo lo necesario para el desarrollo mental completo'
    }
];

// Mock data para información de facturación actual
const currentSubscription = {
    plan: 'free',
    status: 'active',
    nextBilling: null,
    videocallsUsed: 0,
    videocallsAvailable: 0,
    levelsAccess: 1,
    totalLevels: 6
};

// Mock data para historial de facturación
const billingHistory = [
    {
        id: '1',
        date: '2024-12-01',
        description: 'Intento de upgrade a Plan Deportista',
        amount: 39.99,
        status: 'failed',
        downloadUrl: null
    },
    {
        id: '2',
        date: '2024-11-15',
        description: 'Registro en Plan Gratuito',
        amount: 0,
        status: 'completed',
        downloadUrl: null
    }
];

export default function Suscripcion() {
    const currentPlan = pricingPlans.find(plan => plan.id === currentSubscription.plan);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suscripción - Psicología para el deporte" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                        Suscripción y Facturación
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona tu plan de suscripción y accede a todo el contenido premium
                    </p>
                </div>

                {/* Current Plan Status */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                {currentPlan?.id === 'free' ? (
                                    <Target className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <Crown className="w-5 h-5 text-yellow-600" />
                                )}
                                Plan Actual: {currentPlan?.name}
                            </CardTitle>
                            <Badge 
                                variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}
                                className="capitalize"
                            >
                                {currentSubscription.status === 'active' ? 'Activo' : currentSubscription.status}
                            </Badge>
                        </div>
                        <CardDescription>
                            {currentPlan?.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {currentSubscription.levelsAccess}/{currentSubscription.totalLevels}
                                </div>
                                <div className="text-sm text-muted-foreground">Niveles Disponibles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {currentSubscription.videocallsUsed}/{currentSubscription.videocallsAvailable}
                                </div>
                                <div className="text-sm text-muted-foreground">Videollamadas este Mes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    ${currentPlan?.price || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    por {currentPlan?.period}
                                </div>
                            </div>
                        </div>
                        
                        {currentPlan?.id === 'free' && (
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                            Acceso Limitado
                                        </p>
                                        <p className="text-yellow-700 dark:text-yellow-300">
                                            Actualmente solo tienes acceso al primer nivel. Mejora a "Deportista" para desbloquear todo el contenido.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pricing Plans */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Planes Disponibles</h2>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {pricingPlans.map((plan) => (
                            <Card 
                                key={plan.id} 
                                className={`relative ${
                                    plan.popular 
                                        ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                                        : ''
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-blue-500 hover:bg-blue-600">
                                            Más Popular
                                        </Badge>
                                    </div>
                                )}
                                
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                                        {plan.id === 'free' ? (
                                            <Target className="w-6 h-6 text-gray-600" />
                                        ) : (
                                            <Crown className="w-6 h-6 text-yellow-600" />
                                        )}
                                        {plan.name}
                                    </CardTitle>
                                    <div className="text-4xl font-bold">
                                        ${plan.price}
                                        <span className="text-lg font-normal text-muted-foreground">
                                            /{plan.period}
                                        </span>
                                    </div>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                {feature.included ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <X className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <Button 
                                        className="w-full" 
                                        variant={plan.buttonVariant}
                                        disabled={currentPlan?.id === plan.id}
                                    >
                                        {currentPlan?.id === plan.id ? 'Plan Actual' : plan.buttonText}
                                    </Button>
                                    
                                    {plan.limitations && (
                                        <p className="text-xs text-muted-foreground text-center">
                                            {plan.limitations}
                                        </p>
                                    )}
                                    
                                    {plan.benefits && (
                                        <p className="text-xs text-green-600 dark:text-green-400 text-center font-medium">
                                            {plan.benefits}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Billing History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="w-5 h-5" />
                            Historial de Facturación
                        </CardTitle>
                        <CardDescription>
                            Revisa tus transacciones y descarga recibos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {billingHistory.map((transaction) => (
                                <div 
                                    key={transaction.id} 
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{transaction.description}</span>
                                            <Badge 
                                                variant={
                                                    transaction.status === 'completed' ? 'default' :
                                                    transaction.status === 'failed' ? 'destructive' : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {transaction.status === 'completed' ? 'Completado' :
                                                 transaction.status === 'failed' ? 'Fallido' : transaction.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(transaction.date).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">
                                            ${transaction.amount.toFixed(2)}
                                        </div>
                                        {transaction.downloadUrl && (
                                            <Button variant="ghost" size="sm" className="mt-1">
                                                <Download className="w-3 h-3 mr-1" />
                                                Recibo
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method & Benefits */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Método de Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {currentPlan?.id === 'free' ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No se requiere método de pago para el plan gratuito</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                            VISA
                                        </div>
                                        <div>
                                            <div className="font-medium">•••• •••• •••• 4242</div>
                                            <div className="text-sm text-muted-foreground">Expira 12/2025</div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full">
                                        Actualizar Método de Pago
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upgrade Benefits */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Beneficios del Plan Deportista
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Video className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm">Videollamada mensual con psicólogo deportivo</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Target className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Acceso completo a todos los 6 niveles</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm">Sistema completo de logros y gamificación</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm">Planes de entrenamiento personalizados</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}