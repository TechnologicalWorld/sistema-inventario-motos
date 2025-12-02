import React from 'react';
import { FiX, FiPackage, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { Producto } from '../service/empleado.inventario.service';

interface Props {
  producto: Producto | null;
  open: boolean;
  onClose: () => void;
}

const ProductoDetalleModal: React.FC<Props> = ({ producto, open, onClose }) => {
  if (!open || !producto) return null;

  const tieneStockBajo = producto.stock <= producto.stockMinimo;
  const margenGanancia = ((Number(producto.precioVenta) - Number(producto.precioCompra)) / Number(producto.precioCompra)) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiPackage className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{producto.nombre}</h2>
              <p className="text-sm text-gray-600">Código: {producto.codigoProducto}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Información del Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    producto.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Categoría:</span>
                  <span>{producto.categoria?.nombre || 'Sin categoría'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Fecha registro:</span>
                  <span>{new Date(producto.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Stock mínimo:</span>
                  <span>{producto.stockMinimo} unidades</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Última actualización:</span>
                  <span>{new Date(producto.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Inventario</h3>
            <div className={`p-4 rounded-lg border-2 ${
              tieneStockBajo 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tieneStockBajo ? (
                    <FiAlertTriangle className="text-red-600 text-xl" />
                  ) : (
                    <FiPackage className="text-green-600 text-xl" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">Stock Disponible</p>
                    <p className={`text-2xl font-bold ${
                      tieneStockBajo ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {producto.stock} unidades
                    </p>
                    {tieneStockBajo && (
                      <p className="text-sm text-red-600 mt-1">
                        ⚠️ Stock por debajo del mínimo ({producto.stockMinimo} unidades)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Precios */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Precios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <FiDollarSign className="text-gray-600" />
                  <span className="font-medium text-gray-700">Precio Compra</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  Bs. {Number(producto.precioCompra).toFixed(2)}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <FiDollarSign className="text-green-600" />
                  <span className="font-medium text-gray-700">Precio Venta</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  Bs. {Number(producto.precioVenta).toFixed(2)}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="text-blue-600" />
                  <span className="font-medium text-gray-700">Margen Ganancia</span>
                </div>
                <p className={`text-2xl font-bold ${
                  margenGanancia >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {margenGanancia.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Descripción</h3>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 leading-relaxed">{producto.descripcion}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalleModal;