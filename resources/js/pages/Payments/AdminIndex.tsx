import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, X, Eye, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Payment {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    program: {
        id: number;
        name: string;
    };
    amount: string;
    status: 'pending' | 'confirmed' | 'rejected';
    payment_date: string;
    paid_at?: string;
    due_date?: string;
    receipt_url: string;
    rejection_reason?: string;
    created_at: string;
}

interface Props {
    payments: {
        data: Payment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        status?: string;
    };
}

export default function AdminPaymentsIndex({ payments, filters }: Props) {
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pendiente</Badge>;
            case 'confirmed':
                return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmado</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rechazado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleApprove = () => {
        if (!selectedPayment) return;

        setProcessing(true);
        router.post(`/payments/${selectedPayment.id}/approve`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowApproveModal(false);
                setSelectedPayment(null);
            },
        });
    };

    const handleReject = () => {
        if (!selectedPayment || !rejectionReason.trim()) return;

        setProcessing(true);
        router.post(`/payments/${selectedPayment.id}/reject`, {
            rejection_reason: rejectionReason,
        }, {
            onFinish: () => {
                setProcessing(false);
                setShowRejectModal(false);
                setSelectedPayment(null);
                setRejectionReason('');
            },
        });
    };

    const filterByStatus = (status: string) => {
        router.get('/admin/payments', { status }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Gestión de Pagos" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Pagos</h1>
                        <p className="text-muted-foreground mt-1">
                            Revisa y gestiona los pagos de los estudiantes
                        </p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant={!filters.status || filters.status === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => filterByStatus('all')}
                    >
                        Todos ({payments.total})
                    </Button>
                    <Button
                        variant={filters.status === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => filterByStatus('pending')}
                    >
                        <Clock className="w-4 h-4 mr-1" />
                        Pendientes
                    </Button>
                    <Button
                        variant={filters.status === 'confirmed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => filterByStatus('confirmed')}
                    >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirmados
                    </Button>
                    <Button
                        variant={filters.status === 'rejected' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => filterByStatus('rejected')}
                    >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazados
                    </Button>
                </div>

                {/* Payments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pagos Recibidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {payments.data.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No hay pagos para mostrar</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-semibold">Estudiante</th>
                                            <th className="text-left p-3 font-semibold">Programa</th>
                                            <th className="text-left p-3 font-semibold">Monto</th>
                                            <th className="text-left p-3 font-semibold">Estado</th>
                                            <th className="text-left p-3 font-semibold">Fecha</th>
                                            <th className="text-right p-3 font-semibold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.data.map((payment) => (
                                            <tr key={payment.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">
                                                    <div>
                                                        <div className="font-medium">{payment.user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{payment.user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-3">{payment.program.name}</td>
                                                <td className="p-3 font-semibold">${parseFloat(payment.amount).toFixed(2)}</td>
                                                <td className="p-3">{getStatusBadge(payment.status)}</td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {new Date(payment.payment_date).toLocaleDateString()}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedPayment(payment);
                                                                setShowReceiptModal(true);
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {payment.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => {
                                                                        setSelectedPayment(payment);
                                                                        setShowApproveModal(true);
                                                                    }}
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => {
                                                                        setSelectedPayment(payment);
                                                                        setShowRejectModal(true);
                                                                    }}
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Approve Modal */}
            <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Pago</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p>¿Estás seguro de que deseas aprobar este pago?</p>
                        {selectedPayment && (
                            <div className="bg-muted p-4 rounded-lg space-y-2">
                                <div><strong>Estudiante:</strong> {selectedPayment.user.name}</div>
                                <div><strong>Programa:</strong> {selectedPayment.program.name}</div>
                                <div><strong>Monto:</strong> ${parseFloat(selectedPayment.amount).toFixed(2)}</div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApproveModal(false)} disabled={processing}>
                            Cancelar
                        </Button>
                        <Button onClick={handleApprove} disabled={processing}>
                            {processing ? 'Procesando...' : 'Confirmar Pago'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rechazar Pago</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p>Proporciona una razón para el rechazo:</p>
                        {selectedPayment && (
                            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                                <div><strong>Estudiante:</strong> {selectedPayment.user.name}</div>
                                <div><strong>Programa:</strong> {selectedPayment.program.name}</div>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="rejection_reason">Razón del Rechazo</Label>
                            <Textarea
                                id="rejection_reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Ej: El comprobante no es legible, falta información..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectModal(false)} disabled={processing}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={processing || !rejectionReason.trim()}
                        >
                            {processing ? 'Procesando...' : 'Rechazar Pago'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Receipt Modal */}
            <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Comprobante de Pago</DialogTitle>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Estudiante:</strong> {selectedPayment.user.name}</div>
                                <div><strong>Programa:</strong> {selectedPayment.program.name}</div>
                                <div><strong>Monto:</strong> ${parseFloat(selectedPayment.amount).toFixed(2)}</div>
                                <div><strong>Estado:</strong> {getStatusBadge(selectedPayment.status)}</div>
                            </div>
                            <div className="border rounded-lg p-4 bg-muted/50">
                                <img
                                    src={selectedPayment.receipt_url}
                                    alt="Comprobante"
                                    className="w-full h-auto max-h-[500px] object-contain"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setShowReceiptModal(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
