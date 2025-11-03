import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Payment {
    id: number;
    amount: string;
    status: 'pending' | 'confirmed' | 'rejected';
    payment_date: string;
    paid_at?: string;
    due_date?: string;
    receipt_url: string;
    rejection_reason?: string;
    created_at: string;
}

interface Program {
    id: number;
    name: string;
    monthly_price: string;
}

interface Props {
    program: Program;
    payments: Payment[];
    latestConfirmedPayment: Payment | null;
    needsPayment: boolean;
}

export default function StudentPayments({ program, payments, latestConfirmedPayment, needsPayment }: Props) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setProcessing(true);
        const formData = new FormData();
        formData.append('receipt', selectedFile);

        router.post(`/programs/${program.id}/payments`, formData, {
            onFinish: () => {
                setProcessing(false);
                setShowUploadModal(false);
                setSelectedFile(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Pagos - ${program.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Pagos del Programa</h1>
                        <p className="text-muted-foreground mt-1">{program.name}</p>
                    </div>
                    <Button onClick={() => setShowUploadModal(true)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Comprobante
                    </Button>
                </div>

                {/* Payment Status */}
                {needsPayment && (
                    <Card className="border-yellow-500 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-yellow-900">Pago Requerido</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Necesitas realizar un pago para acceder al contenido de este programa.
                                        Monto mensual: <strong>${parseFloat(program.monthly_price).toFixed(2)}</strong>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {latestConfirmedPayment && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado de Suscripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Último Pago:</span>
                                    <span className="font-semibold">
                                        {new Date(latestConfirmedPayment.paid_at!).toLocaleDateString()}
                                    </span>
                                </div>
                                {latestConfirmedPayment.due_date && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Próximo Vencimiento:</span>
                                        <span className="font-semibold">
                                            {new Date(latestConfirmedPayment.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Estado:</span>
                                    <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" /> Activo</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Pagos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {payments.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No hay pagos registrados aún</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">${parseFloat(payment.amount).toFixed(2)}</span>
                                                {getStatusBadge(payment.status)}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                Enviado el {new Date(payment.payment_date).toLocaleDateString()}
                                            </div>
                                            {payment.status === 'rejected' && payment.rejection_reason && (
                                                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                                    <strong>Razón del rechazo:</strong> {payment.rejection_reason}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(payment.receipt_url, '_blank')}
                                        >
                                            Ver Comprobante
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Upload Modal */}
            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subir Comprobante de Pago</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <Label htmlFor="receipt">Comprobante (JPG, PNG o PDF - Max 5MB)</Label>
                            <Input
                                id="receipt"
                                type="file"
                                accept="image/jpeg,image/png,application/pdf"
                                onChange={handleFileChange}
                                required
                            />
                            {selectedFile && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Archivo seleccionado: {selectedFile.name}
                                </p>
                            )}
                        </div>
                        <div className="bg-muted p-4 rounded-lg text-sm">
                            <strong>Monto a pagar:</strong> ${parseFloat(program.monthly_price).toFixed(2)} USD
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)} disabled={processing}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing || !selectedFile}>
                                {processing ? 'Subiendo...' : 'Subir Comprobante'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
