import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { CreditCard, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface Program {
    id: number;
    name: string;
    monthly_price: number;
}

interface Payment {
    id: number;
    amount: number;
    status: string;
    payment_date: string;
    paid_at: string | null;
    due_date: string | null;
    receipt_url: string;
    rejection_reason: string | null;
    program: Program;
}

interface Props {
    programs: Program[];
    payments: Payment[];
}

export default function StudentPaymentsIndex({ programs, payments }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Confirmado</Badge>;
            case 'rejected':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rechazado</Badge>;
            default:
                return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" /> Pendiente</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Mis Pagos</h1>
                    <p className="text-muted-foreground mt-2">
                        Administra tus pagos y suscripciones de todos tus programas
                    </p>
                </div>

                {/* Programs Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {programs.map((program) => (
                        <Card key={program.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{program.name}</CardTitle>
                                <CardDescription>
                                    {formatCurrency(program.monthly_price)} / mes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/programs/${program.id}/payments`}>
                                    <Button variant="outline" className="w-full">
                                        Ver Detalles
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Payment History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Historial de Pagos
                        </CardTitle>
                        <CardDescription>
                            Todos tus pagos realizados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {payments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No tienes pagos registrados aún</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{payment.program.name}</p>
                                                {getStatusBadge(payment.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Enviado: {formatDate(payment.payment_date)}
                                                </span>
                                                {payment.paid_at && (
                                                    <span>Confirmado: {formatDate(payment.paid_at)}</span>
                                                )}
                                                {payment.due_date && (
                                                    <span>Vence: {formatDate(payment.due_date)}</span>
                                                )}
                                            </div>
                                            {payment.rejection_reason && (
                                                <p className="text-sm text-red-600">
                                                    Motivo: {payment.rejection_reason}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                                            {payment.receipt_url && (
                                                <a
                                                    href={payment.receipt_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Ver comprobante
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
