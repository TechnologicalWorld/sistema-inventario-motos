import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import movimientosService, { ProductoMovimiento } from '../services/empleado.movimientos.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRegistrarMovimiento: (movimientoData: any) => Promise<boolean>;
}

const AgregarMovimientoModal: React.FC<Props> = ({ open, onClose, onRegistrarMovimiento }) => {
  const [formData, setFormData] = useState({
    tipo: 'entrada' as 'entrada' | 'salida',
    idProducto: 0,
    cantidad: 1,
    observacion: ''
  });
  
  const [productos, setProductos] = useState<ProductoMovimiento[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoMovimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos al abrir el modal
  useEffect(() => {
    if (open) {
      cargarProductos();
    }
  }, [open]);

  const cargarProductos = async () => {
    try {
      setCargandoProductos(true);
      setError(null);
      const productosData = await movimientosService.getProductos();
      setProductos(productosData);
    } catch (err: any) {
      console.error('Error cargando productos:', err);
      setError('No se pudieron cargar los productos');
    } finally {
      setCargandoProductos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.idProducto === 0) {
      setError('Debe seleccionar un producto');
      return;
    }

    if (formData.cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    // Validar stock si es salida
    if (formData.tipo === 'salida' && productoSeleccionado) {
      if (formData.cantidad > productoSeleccionado.stock) {
        setError(`Stock insuficiente. Disponible: ${productoSeleccionado.stock} unidades`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    const movimientoData = {
      tipo: formData.tipo,
      idProducto: formData.idProducto,
      cantidad: formData.cantidad,
      observacion: formData.observacion.trim() || 'Sin observación'
    };

    const success = await onRegistrarMovimiento(movimientoData);
    if (success) {
      onClose();
      // Reset form
      setFormData({
        tipo: 'entrada',
        idProducto: 0,
        cantidad: 1,
        observacion: ''
      });
      setProductoSeleccionado(null);
    }
    
    setLoading(false);
  };

  const handleProductoChange = (idProducto: number) => {
    setFormData(prev => ({ ...prev, idProducto }));
    const producto = productos.find(p => p.idProducto === idProducto);
    setProductoSeleccionado(producto || null);
  };

  const handleTipoChange = (tipo: 'entrada' | 'salida') => {
    setFormData(prev => ({ ...prev, tipo }));
    // Si cambia a salida, validar cantidad
    if (tipo === 'salida' && productoSeleccionado && formData.cantidad > productoSeleccionado.stock) {
      setFormData(prev => ({ ...prev, cantidad: productoSeleccionado.stock }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          formData.tipo === 'entrada' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center gap-2">
            {formData.tipo === 'entrada' ? (
              <FiTrendingUp className="text-green-600" />
            ) : (
              <FiTrendingDown className="text-red-600" />
            )}
            <h2 className="text-lg font-semibold">
              {formData.tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de movimiento */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Movimiento</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTipoChange('entrada')}
                className={`flex-1 py-2 rounded-md border flex items-center justify-center gap-2 ${
                  formData.tipo === 'entrada'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                }`}
              >
                <FiTrendingUp />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => handleTipoChange('salida')}
                className={`flex-1 py-2 rounded-md border flex items-center justify-center gap-2 ${
                  formData.tipo === 'salida'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                }`}
              >
                <FiTrendingDown />
                Salida
              </button>
            </div>
          </div>

          {/* Producto */}
          <div>
            <label className="block text-sm font-medium mb-1">Producto *</label>
            {cargandoProductos ? (
              <div className="text-center py-2 text-gray-600">
                Cargando productos...
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-2 text-red-600">
                No hay productos disponibles
              </div>
            ) : (
              <select
                value={formData.idProducto}
                onChange={(e) => handleProductoChange(parseInt(e.target.value))}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value={0}>Seleccionar producto</option>
                {productos.map(producto => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombre} - Código: {producto.codigoProducto} - Stock: {producto.stock}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Información del producto seleccionado */}
          {productoSeleccionado && (
            <div className={`p-3 rounded border ${
              formData.tipo === 'entrada' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="text-sm">
                <div className="font-medium mb-1">{productoSeleccionado.nombre}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Stock actual:</span>
                    <span className="ml-1 font-medium">{productoSeleccionado.stock}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Stock mínimo:</span>
                    <span className="ml-1 font-medium">{productoSeleccionado.stockMinimo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Precio venta:</span>
                    <span className="ml-1 font-medium">Bs. {productoSeleccionado.precioVenta.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <span className={`ml-1 font-medium ${
                      productoSeleccionado.estado === 'activo' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {productoSeleccionado.estado}
                    </span>
                  </div>
                </div>
                {formData.tipo === 'salida' && productoSeleccionado.stock <= productoSeleccionado.stockMinimo && (
                  <div className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded">
                    ⚠️ El stock está por debajo del mínimo
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Cantidad * {formData.tipo === 'salida' && productoSeleccionado && `(Máximo: ${productoSeleccionado.stock})`}
            </label>
            <input
              type="number"
              min="1"
              max={formData.tipo === 'salida' && productoSeleccionado ? productoSeleccionado.stock : undefined}
              value={formData.cantidad}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                cantidad: Math.max(1, parseInt(e.target.value) || 1)
              }))}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Observación */}
          <div>
            <label className="block text-sm font-medium mb-1">Observación</label>
            <textarea
              value={formData.observacion}
              onChange={(e) => setFormData(prev => ({ ...prev, observacion: e.target.value }))}
              placeholder="Motivo del movimiento..."
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || formData.idProducto === 0}
              className={`flex-1 py-2 text-white rounded flex items-center justify-center gap-2 ${
                formData.tipo === 'entrada'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <FiPlus />
                  {formData.tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarMovimientoModal;