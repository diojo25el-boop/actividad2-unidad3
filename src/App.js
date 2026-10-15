import React, { useState } from 'react';

// ==========================================
// CATÁLOGO DE PRODUCTOS (Con imágenes reales)
// ==========================================
const productosIniciales = [
  {
    id: 1,
    nombre: "Laptop Profesional",
    categoria: "Tecnología",
    precio: 15999.00,
    imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    descripcion: "Laptop de alto rendimiento con procesador avanzado y 16GB de RAM para trabajo y diseño."
  },
  {
    id: 2,
    nombre: "Audífonos inalámbricos",
    categoria: "Audio",
    precio: 899.00,
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    descripcion: "Audífonos Bluetooth con micrófono integrado para música y llamadas de alta fidelidad."
  },
  {
    id: 3,
    nombre: "Smartphone de última generación",
    categoria: "Tecnología",
    precio: 9499.00,
    imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    descripcion: "Teléfono inteligente con cámara de alta resolución y gran capacidad de almacenamiento."
  },
  {
    id: 4,
    nombre: "Mochila para Laptop",
    categoria: "Accesorios",
    precio: 650.00,
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    descripcion: "Mochila resistente al agua con compartimento especial acolchado para equipos portátiles."
  }
];

export default function App() {
  // Estados de navegación y datos
  const [vista, setVista] = useState('catalogo'); // 'catalogo', 'detalle', 'carrito', 'pago', 'confirmacion'
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  
  // Estados de filtros (Sprint 1)
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [precioMax, setPrecioMax] = useState(20000);

  // Estados de pago y pedido (Sprint 2)
  const [datosPago, setDatosPago] = useState({ nombre: '', metodo: 'Tarjeta', tarjeta: '' });
  const [errorPago, setErrorPago] = useState('');
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  // Filtrado de productos
  const productosFiltrados = productosIniciales.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro;
    const coincidePrecio = p.precio <= precioMax;
    return coincideNombre && coincideCategoria && coincidePrecio;
  });

  // Funciones del Carrito (HU-05)
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    alert(`¡"${producto.nombre}" agregado al carrito!`);
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito(prev => prev.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + delta;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  };

  const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Procesar Pago (HU-06)
  const handlePagoSubmit = (e) => {
    e.preventDefault();
    if (!datosPago.nombre.trim() || !datosPago.tarjeta.trim()) {
      setErrorPago('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (datosPago.tarjeta.length < 4) {
      setErrorPago('Por favor, ingresa al menos los últimos 4 dígitos válidos.');
      return;
    }
    setErrorPago('');
    
    // Generar confirmación (HU-07)
    const numeroOrden = 'TF-' + Math.floor(100000 + Math.random() * 900000);
    setPedidoConfirmado({
      numero: numeroOrden,
      nombre: datosPago.nombre,
      metodo: datosPago.metodo,
      total: calcularTotal(),
      items: [...carrito]
    });

    setCarrito([]);
    setVista('confirmacion');
  };

  return (
    <div style={styles.container}>
      {/* Encabezado Principal */}
      <header style={styles.header}>
        <h1 style={styles.tituloApp}>Tienda Fácil</h1>
        <p style={styles.subtituloApp}>Aplicación móvil de comercio electrónico</p>
        
        <nav style={styles.nav}>
          <button style={styles.navBtn} onClick={() => setVista('catalogo')}>Catálogo</button>
          <button style={styles.navBtn} onClick={() => setVista('carrito')}>
            🛒 Carrito ({totalItemsCarrito})
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {/* ================= VISTA: CATÁLOGO (Sprint 1) ================= */}
        {vista === 'catalogo' && (
          <div>
            <div style={styles.searchBarContainer}>
              <h2>Compra de forma sencilla</h2>
              <p>Busca productos, consulta sus detalles, agrega productos al carrito y prepara tu compra.</p>
              
              <div style={styles.filtrosRow}>
                <input 
                  type="text" 
                  placeholder="Ej. laptop" 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={styles.input}
                />
                <select 
                  value={categoriaFiltro} 
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  style={styles.select}
                >
                  <option value="Todas">Todas</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Audio">Audio</option>
                  <option value="Accesorios">Accesorios</option>
                </select>

                <div style={styles.rangeContainer}>
                  <label>Precio máx: ${precioMax}.00</label>
                  <input 
                    type="range" 
                    min="500" 
                    max="20000" 
                    step="500"
                    value={precioMax} 
                    onChange={(e) => setPrecioMax(Number(e.target.value))} 
                  />
                </div>
              </div>
              <p>{productosFiltrados.length} producto(s) encontrado(s)</p>
            </div>

            <div style={styles.gridProductos}>
              {productosFiltrados.map(prod => (
                <div key={prod.id} style={styles.card}>
                  <img src={prod.imagen} alt={prod.nombre} style={styles.imgCard} />
                  <span style={styles.tagCategoria}>{prod.categoria}</span>
                  <h3 style={styles.prodTitle}>{prod.nombre}</h3>
                  <p style={styles.precio}>${prod.precio.toFixed(2)}</p>
                  
                  <div style={styles.cardButtons}>
                    <button 
                      style={styles.btnSecundario} 
                      onClick={() => { setProductoSeleccionado(prod); setVista('detalle'); }}
                    >
                      Ver detalle
                    </button>
                    <button 
                      style={styles.btnPrimario} 
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VISTA: DETALLE DE PRODUCTO (HU-04) ================= */}
        {vista === 'detalle' && productoSeleccionado && (
          <div>
            <button style={styles.btnVolver} onClick={() => setVista('catalogo')}>← Volver al catálogo</button>
            <div style={styles.detalleContainer}>
              <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} style={styles.imgDetalle} />
              <div style={styles.detalleInfo}>
                <span style={styles.tagCategoria}>{productoSeleccionado.categoria}</span>
                <h2>{productoSeleccionado.nombre}</h2>
                <p style={styles.descripcionTexto}>{productoSeleccionado.descripcion}</p>
                <p style={styles.caractCheck}>✓ Bluetooth • Micrófono integrado</p>
                <p style={styles.precioGrande}>${productoSeleccionado.precio.toFixed(2)}</p>
                
                <button 
                  style={styles.btnPrimarioGrande} 
                  onClick={() => { agregarAlCarrito(productoSeleccionado); setVista('carrito'); }}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VISTA: CARRITO (HU-05) ================= */}
        {vista === 'carrito' && (
          <div>
            <p>HU-05</p>
            <h2>Mi carrito</h2>
            <button style={styles.btnVolver} onClick={() => setVista('catalogo')}>Seguir comprando</button>

            {carrito.length === 0 ? (
              <p style={{ marginTop: '20px' }}>Tu carrito está vacío.</p>
            ) : (
              <div style={styles.carritoLayout}>
                <div style={styles.listaCarrito}>
                  {carrito.map(item => (
                    <div key={item.id} style={styles.carritoItem}>
                      <img src={item.imagen} alt={item.nombre} style={styles.imgMiniatura} />
                      <div style={{ flex: 1, marginLeft: '15px' }}>
                        <h4>{item.nombre}</h4>
                        <p>${item.precio.toFixed(2)} c/u</p>
                      </div>
                      <div style={styles.controlesCantidad}>
                        <button style={styles.btnContador} onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                        <span>{item.cantidad}</span>
                        <button style={styles.btnContador} onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                      </div>
                      <p style={{ width: '90px', textAlign: 'right', fontWeight: 'bold' }}>
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                      <button style={styles.btnEliminar} onClick={() => eliminarDelCarrito(item.id)}>🗑️</button>
                    </div>
                  ))}
                </div>

                <div style={styles.resumenCard}>
                  <h3>Resumen de compra</h3>
                  <hr />
                  <p style={styles.flexBetween}><span>Subtotal:</span> <span>${calcularTotal().toFixed(2)}</span></p>
                  <p style={styles.flexBetween}><span>Envío:</span> <span>Gratis</span></p>
                  <hr />
                  <p style={styles.flexBetweenTotal}><span>Total:</span> <span>${calcularTotal().toFixed(2)}</span></p>
                  
                  <button style={styles.btnCheckout} onClick={() => setVista('pago')}>
                    Proceder al pago
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VISTA: DATOS DE PAGO (HU-06) ================= */}
        {vista === 'pago' && (
          <div>
            <p>HU-06</p>
            <h2>Finalizar compra</h2>
            <button style={styles.btnVolver} onClick={() => setVista('carrito')}>← Regresar al carrito</button>

            <form onSubmit={handlePagoSubmit} style={styles.formPago}>
              <h3>Datos del comprador</h3>
              {errorPago && <p style={styles.errorText}>{errorPago}</p>}
              
              <div style={styles.formRow}>
                <label>Nombre:</label>
                <input 
                  type="text" 
                  value={datosPago.nombre} 
                  onChange={(e) => setDatosPago({ ...datosPago, nombre: e.target.value })}
                  placeholder="Nombre completo"
                  style={styles.input}
                />

                <label>Método de pago:</label>
                <select 
                  value={datosPago.metodo} 
                  onChange={(e) => setDatosPago({ ...datosPago, metodo: e.target.value })}
                  style={styles.select}
                >
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Efectivo / OXXO">Efectivo / OXXO</option>
                  <option value="Transferencia">Transferencia</option>
                </select>

                <label>Últimos 4 dígitos de tarjeta:</label>
                <input 
                  type="text" 
                  maxLength="4" 
                  value={datosPago.tarjeta} 
                  onChange={(e) => setDatosPago({ ...datosPago, tarjeta: e.target.value.replace(/\D/g, '') })}
                  placeholder="1234"
                  style={styles.inputCorto}
                />

                <button type="submit" style={styles.btnPrimario}>Confirmar pedido</button>
              </div>
            </form>

            <div style={styles.resumenBox}>
              <h3>Resumen</h3>
              {carrito.map(i => (
                <p key={i.id}>{i.nombre} × {i.cantidad} <strong>${(i.precio * i.cantidad).toFixed(2)}</strong></p>
              ))}
              <hr />
              <p style={{ fontSize: '1.1rem' }}><strong>Total: ${calcularTotal().toFixed(2)}</strong></p>
            </div>
          </div>
        )}

        {/* ================= VISTA: CONFIRMACIÓN (HU-07) ================= */}
        {vista === 'confirmacion' && pedidoConfirmado && (
          <div style={styles.confirmacionContainer}>
            <p>✓</p>
            <p>HU-07</p>
            <h2 style={{ color: '#27ae60' }}>¡Compra confirmada!</h2>
            <p>Tu pedido fue registrado correctamente.</p>
            
            <div style={styles.detallesPedidoCard}>
              <p><strong>Número de pedido:</strong> {pedidoConfirmado.numero}</p>
              <p><strong>Comprador:</strong> {pedidoConfirmado.nombre}</p>
              <p><strong>Método de pago:</strong> {pedidoConfirmado.metodo}</p>
              <p><strong>Total pagado:</strong> ${pedidoConfirmado.total.toFixed(2)}</p>
            </div>

            <button style={styles.btnPrimarioGrande} onClick={() => setVista('catalogo')}>
              Volver al catálogo
            </button>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>Tienda Fácil • Proyecto 2 • Sprint 1 y Sprint 2 • React</p>
      </footer>
    </div>
  );
}

// ==========================================
// ESTILOS CSS EN LÍNEA
// ==========================================
const styles = {
  container: { fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '20px', color: '#333' },
  header: { borderBottom: '2px solid #ddd', paddingBottom: '15px', marginBottom: '20px' },
  tituloApp: { margin: '0 0 5px 0', fontSize: '2rem' },
  subtituloApp: { margin: '0 0 15px 0', color: '#666' },
  nav: { display: 'flex', gap: '10px' },
  navBtn: { padding: '8px 16px', background: '#f1f1f1', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
  main: { minHeight: '65vh' },
  searchBarContainer: { background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  filtrosRow: { display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' },
  inputCorto: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' },
  select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  rangeContainer: { display: 'flex', flexDirection: 'column', fontSize: '0.9rem' },
  gridProductos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { border: '1px solid #e1e1e1', borderRadius: '8px', padding: '15px', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  imgCard: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' },
  tagCategoria: { background: '#e2e8f0', fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', width: 'fit-content', marginTop: '10px' },
  prodTitle: { fontSize: '1.1rem', margin: '10px 0 5px 0' },
  precio: { fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50', margin: '5px 0 15px 0' },
  precioGrande: { fontSize: '1.6rem', fontWeight: 'bold', color: '#2c3e50', margin: '15px 0' },
  cardButtons: { display: 'flex', gap: '10px', marginTop: 'auto' },
  btnPrimario: { background: '#2c3e50', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', flex: 1 },
  btnSecundario: { background: '#fff', color: '#2c3e50', border: '1px solid #2c3e50', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' },
  btnPrimarioGrande: { background: '#2c3e50', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', width: '100%' },
  btnVolver: { background: 'none', border: '1px solid #666', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', marginBottom: '15px' },
  detalleContainer: { display: 'flex', gap: '30px', flexWrap: 'wrap', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' },
  imgDetalle: { width: '100%', maxWidth: '450px', height: '300px', objectFit: 'cover', borderRadius: '8px' },
  detalleInfo: { flex: 1 },
  descripcionTexto: { color: '#555', lineHeight: '1.5' },
  caractCheck: { color: '#27ae60', fontWeight: 'bold' },
  carritoLayout: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  listaCarrito: { flex: 2, display: 'flex', flexDirection: 'column', gap: '10px' },
  carritoItem: { display: 'flex', alignItems: 'center', background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' },
  imgMiniatura: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
  controlesCantidad: { display: 'flex', alignItems: 'center', gap: '8px', margin: '0 15px' },
  btnContador: { padding: '2px 8px', cursor: 'pointer', background: '#eee', border: '1px solid #ccc', borderRadius: '4px' },
  btnEliminar: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px' },
  resumenCard: { flex: 1, background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', height: 'fit-content' },
  flexBetween: { display: 'flex', justifyContent: 'space-between', margin: '8px 0' },
  flexBetweenTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', margin: '15px 0' },
  btnCheckout: { background: '#27ae60', color: '#fff', border: 'none', padding: '12px', width: '100%', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  formPago: { background: '#fdfdfd', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' },
  formRow: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' },
  errorText: { color: '#e74c3c', fontWeight: 'bold', margin: '0' },
  resumenBox: { background: '#f1f5f9', padding: '15px', borderRadius: '8px', maxWidth: '400px' },
  confirmacionContainer: { background: '#fff', padding: '40px', borderRadius: '8px', textAlign: 'center', border: '1px solid #ddd', maxWidth: '500px', margin: '0 auto' },
  detallesPedidoCard: { background: '#f8fafc', padding: '15px', borderRadius: '6px', textAlign: 'left', margin: '20px 0', border: '1px solid #e2e8f0' },
  footer: { textAlign: 'center', marginTop: '40px', borderTop: '1px solid #ddd', padding: '15px 0', color: '#777', fontSize: '0.9rem' }
};
