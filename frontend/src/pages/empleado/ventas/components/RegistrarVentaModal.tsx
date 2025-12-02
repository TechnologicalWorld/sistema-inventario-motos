import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import ventasService, { ProductoVenta } from '../services/empleado.ventas.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRegistrarVenta: (ventaData: any) => Promise<boolean>;
}

interface ClienteOption {
  idCliente: number;
  label: string;
  nit?: string;
}

interface DetalleVentaForm {
  idProducto: number;
  cantidad: number;
  producto?: ProductoVenta;
}

const RegistrarVentaModal: React.FC<Props> = ({ open, onClose, onRegistrarVenta }) => {
  const [formData, setFormData] = useState({
    idCliente: '',
    metodoPago: 'efectivo' as 'efectivo' | 'tarjeta' | 'transferencia',
    descripcion: ''
  });
  
  const [detalles, setDetalles] = useState<DetalleVentaForm[]>([
    { idProducto: 0, cantidad: 1, producto: undefined } // Un detalle por defecto
  ]);
  
  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resetear estado cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      resetForm();
      cargarDatosIniciales();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      idCliente: '',
      metodoPago: 'efectivo',
      descripcion: ''
    });
    setDetalles([{ idProducto: 0, cantidad: 1 }]);
    setError(null);
  };

  const cargarDatosIniciales = async () => {
    try {
      setCargandoDatos(true);
      setError(null);
      
      const [productosData, clientesData] = await Promise.all([
        ventasService.getProductos(),
        ventasService.getClientes()
      ]);
      
      console.log("📦 Productos cargados:", productosData);
      console.log("👥 Clientes cargados:", clientesData);
      
      // Procesar productos - convertir precios a number
      const productosProcesados = productosData.map(producto => ({
        ...producto,
        precioVenta: ventasService.parseToNumber(producto.precioVenta),
        stock: Number(producto.stock) || 0
      }));
      
      setProductos(productosProcesados);
      
      // Procesar clientes
      const clientesOptions = clientesData.map(cliente => ({
        idCliente: cliente.idCliente,
        label: `${cliente.persona?.nombres || ''} ${cliente.persona?.paterno || ''} ${cliente.persona?.materno || ''}`.trim(),
        nit: cliente.nit || 'Sin NIT'
      }));
      
      setClientes(clientesOptions);
      
    } catch (error: any) {
      console.error('❌ Error cargando datos:', error);
      setError(`Error al cargar datos: ${error.message}`);
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (detalles.length === 0 || detalles.every(d => d.idProducto === 0)) {
      setError('Debe agregar al menos un producto a la venta');
      return;
    }

    if (!formData.idCliente) {
      setError('Debe seleccionar un cliente');
      return;
    }

    // Validar stock de productos
    for (const detalle of detalles) {
      if (detalle.idProducto === 0) {
        setError('Hay productos sin seleccionar');
        return;
      }
      
      const producto = productos.find(p => p.idProducto === detalle.idProducto);
      if (!producto) {
        setError(`Producto con ID ${detalle.idProducto} no encontrado`);
        return;
      }
      
      if (producto.stock < detalle.cantidad) {
        setError(`Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`);
        return;
      }
      
      if (detalle.cantidad <= 0) {
        setError('La cantidad debe ser mayor a 0');
        return;
      }
    }

    setLoading(true);
    setError(null);
    
    const ventaData = {
      idCliente: parseInt(formData.idCliente),
      metodoPago: formData.metodoPago,
      descripcion: formData.descripcion || '',
      detalles: detalles
        .filter(detalle => detalle.idProducto > 0 && detalle.cantidad > 0)
        .map(detalle => ({
          idProducto: detalle.idProducto,
          cantidad: detalle.cantidad
        }))
    };

    console.log("📤 Enviando venta:", ventaData);

    try {
      const success = await onRegistrarVenta(ventaData);
      if (success) {
        onClose();
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  const agregarDetalle = () => {
    setDetalles(prev => [...prev, { idProducto: 0, cantidad: 1 }]);
  };

  const eliminarDetalle = (index: number) => {
    if (detalles.length > 1) {
      setDetalles(prev => prev.filter((_, i) => i !== index));
    } else {
      // Si solo queda uno, solo lo reseteamos
      setDetalles([{ idProducto: 0, cantidad: 1 }]);
    }
  };

  const actualizarDetalle = (index: number, campo: string, valor: any) => {
    setDetalles(prev => prev.map((detalle, i) => {
      if (i === index) {
        const actualizado = { ...detalle, [campo]: valor };
        
        // Si cambia el producto, actualizar la referencia
        if (campo === 'idProducto') {
          const productoId = parseInt(valor);
          const productoSeleccionado = productos.find(p => p.idProducto === productoId);
          actualizado.producto = productoSeleccionado;
          
          // Resetear cantidad si cambia el producto
          if (productoSeleccionado) {
            actualizado.cantidad = 1;
          }
        }
        
        return actualizado;
      }
      return detalle;
    }));
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      if (detalle.producto) {
        return total + (detalle.producto.precioVenta * detalle.cantidad);
      }
      return total;
    }, 0);
  };

  const obtenerProductoSeleccionado = (detalle: DetalleVentaForm) => {
    if (!detalle.producto && detalle.idProducto > 0) {
      const producto = productos.find(p => p.idProducto === detalle.idProducto);
      return producto;
    }
    return detalle.producto;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-green-600" />
            <h2 className="text-lg font-semibold">Registrar Nueva Venta</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <FiX size={20} />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {cargandoDatos ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando productos y clientes...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente *</label>
                <select
                  name="idCliente"
                  value={formData.idCliente}
                  onChange={(e) => setFormData(prev => ({ ...prev, idCliente: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.label} {cliente.nit ? `- NIT: ${cliente.nit}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Método de Pago *</label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value as any }))}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción de la venta..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Detalles de la Venta */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Productos de la Venta *</h3>
                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <FiPlus size={14} />
                  Agregar Producto
                </button>
              </div>

              {detalles.length === 0 ? (
                <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded">
                  No hay productos agregados
                </div>
              ) : (
                <div className="space-y-3">
                  {detalles.map((detalle, index) => {
                    const producto = obtenerProductoSeleccionado(detalle);
                    const subtotal = producto ? producto.precioVenta * detalle.cantidad : 0;
                    
                    return (
                      <div key={index} className="flex flex-wrap items-center gap-3 p-3 border border-gray-300 rounded bg-gray-50">
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-xs text-gray-500 mb-1">Producto *</label>
                          <select
                            value={detalle.idProducto}
                            onChange={(e) => actualizarDetalle(index, 'idProducto', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value={0}>Seleccionar producto</option>
                            {productos.map(producto => (
                              <option 
                                key={producto.idProducto} 
                                value={producto.idProducto}
                                disabled={producto.stock <= 0}
                              >
                                {producto.nombre} - Bs. {ventasService.parseToNumber(producto.precioVenta).toFixed(2)} 
                                {producto.stock > 0 ? ` (Stock: ${producto.stock})` : ' (Sin stock)'}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="w-24">
                          <label className="block text-xs text-gray-500 mb-1">Cantidad *</label>
                          <input
                            type="number"
                            min="1"
                            max={producto?.stock || 99}
                            value={detalle.cantidad}
                            onChange={(e) => actualizarDetalle(index, 'cantidad', parseInt(e.target.value) || 1)}
                            className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={!detalle.idProducto}
                          />
                          {producto && (
                            <div className="text-xs text-gray-500 mt-1">
                              Stock: {producto.stock}
                            </div>
                          )}
                        </div>
                        
                        <div className="w-32">
                          <label className="block text-xs text-gray-500 mb-1">Subtotal</label>
                          <div className="text-sm font-medium text-gray-700 p-2 bg-white border rounded">
                            Bs. {subtotal.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => eliminarDetalle(index)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Eliminar producto"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resumen */}
            {detalles.some(d => d.idProducto > 0) && (
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium mb-2">Resumen de Venta</h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="text-xl font-semibold text-green-600">
                    Bs. {calcularTotal().toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {detalles.filter(d => d.idProducto > 0).length} producto(s)
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || detalles.every(d => d.idProducto === 0)}
                className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Registrando...
                  </span>
                ) : 'Registrar Venta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrarVentaModal;