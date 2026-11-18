
const CONFIG_WHATSAPP = {
    telefono: "573227662086"
};

const PRODUCTOS_COTIZACION = {
    'tamal-tradicional': {
        nombreSelector: 'Tamal Típico Tolimense ($7.000)',
        precio: 7000,
        imagen: 'img/tamal-tradicional.jfif',
        descripcion: 'Masa de maíz tradicional con cerdo, pollo, huevo, zanahoria y arveja, envuelto en hoja de plátano.',
        formatearTitulo: (cant) => cant === 1 ? '1 Tamal Típico Tolimense' : `${cant} Tamales Típicos Tolimenses`
    },
    'tamal-volteado': {
        nombreSelector: 'Tamal Volteado ($15.000)',
        precio: 15000,
        imagen: 'img/tamal-volteado.jfif',
        descripcion: 'Tamal tradicional coronado con una generosa cama de lechona tolimense y cuero crujiente.',
        formatearTitulo: (cant) => cant === 1 ? '1 Tamal Volteado' : `${cant} Tamales Volteados`
    },
    'plato-estandar': {
        nombreSelector: 'Plato de Lechona Estándar ($12.000)',
        precio: 12000,
        imagen: 'img/plato-estandar.jfif',
        descripcion: 'Porción individual de 250g con cuero crujiente, carne de cerdo tierna, arveja y arepa blanca.',
        formatearTitulo: (cant) => cant === 1 ? '1 Plato de Lechona Estándar' : `${cant} Platos de Lechona Estándar`
    },
    'plato-especial': {
        nombreSelector: 'Plato de Lechona Especial ($15.000)',
        precio: 15000,
        imagen: 'img/plato-especial.jfif',
        descripcion: 'Porción generosa de 350g, extra cuero crujiente, carne seleccionada y doble arepa.',
        formatearTitulo: (cant) => cant === 1 ? '1 Plato de Lechona Especial' : `${cant} Platos de Lechona Especial`
    },
    'cojin-lechona': {
        nombreSelector: 'Cojín de Lechona - Eventos ($14.000/plato)',
        precio: 14000,
        imagen: 'img/cojin-lechona.jfif',
        descripcion: 'Presentación tradicional en cojín completo, empacado para conservar el calor y lo crocante del cuero.',
        formatearTitulo: (cant) => `Cojín de lechona de ${cant} ${cant === 1 ? 'plato' : 'platos'}`
    }
};

const VistaCotizacion = {
    selectProducto: document.getElementById('producto'),
    inputCantidad: document.getElementById('cantidad'),
    inputDireccion: document.getElementById('direccion'),
    resumenImg: document.getElementById('resumen-img'),
    resumenTitulo: document.getElementById('resumen-titulo'),
    resumenDescripcion: document.getElementById('resumen-descripcion'),
    resumenDir: document.getElementById('resumen-dir'),
    resumenPrecio: document.getElementById('resumen-precio'),
    btnWhatsapp: document.getElementById('btn-whatsapp'),

    cargarOpcionesProductos(productos) {
        this.selectProducto.innerHTML = '';
        for (const [clave, info] of Object.entries(productos)) {
            const option = document.createElement('option');
            option.value = clave;
            option.textContent = info.nombreSelector;
            this.selectProducto.appendChild(option);
        }
    },

    renderizarResumen({ titulo, descripcion, imagen, direccion, total }) {
        this.resumenImg.src = imagen;
        this.resumenImg.alt = titulo;
        this.resumenTitulo.textContent = titulo;
        this.resumenDescripcion.textContent = descripcion;
        this.resumenDir.textContent = direccion;
        this.resumenPrecio.textContent = `$${total.toLocaleString('es-CO')}`;
    }
};

const ControladorCotizacion = {
    estadoActual: {
        titulo: '',
        cantidad: 1,
        direccion: 'Por definir',
        total: 0
    },

    inicializar() {
        VistaCotizacion.cargarOpcionesProductos(PRODUCTOS_COTIZACION);
        this.registrarEventos();
        this.actualizarCalculo();
    },

    actualizarCalculo() {
        const claveProducto = VistaCotizacion.selectProducto.value;
        let cantidad = parseInt(VistaCotizacion.inputCantidad.value);
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        }

        const direccion = VistaCotizacion.inputDireccion.value.trim() || 'Por definir';
        const producto = PRODUCTOS_COTIZACION[claveProducto];

        const total = producto.precio * cantidad;
        const titulo = producto.formatearTitulo(cantidad);

        this.estadoActual = { titulo, cantidad, direccion, total };

        VistaCotizacion.renderizarResumen({
            titulo,
            descripcion: producto.descripcion,
            imagen: producto.imagen,
            direccion,
            total
        });
    },

    enviarPorWhatsApp() {
        const { titulo, direccion, total } = this.estadoActual;
        const totalFormateado = `$${total.toLocaleString('es-CO')}`;

        const mensaje = `Hola *Lechonería y Tamalería El Punto*, me gustaría realizar la siguiente cotización/pedido:\n\n` +
                        `• *Pedido:* ${titulo}\n` +
                        `• *Dirección de entrega:* ${direccion}\n` +
                        `• *Total estimado:* ${totalFormateado}\n\n` +
                        `Quedo atento a su confirmación.`;

        const url = `https://wa.me/${CONFIG_WHATSAPP.telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    },

    registrarEventos() {
        VistaCotizacion.selectProducto.addEventListener('change', () => this.actualizarCalculo());
        VistaCotizacion.inputCantidad.addEventListener('input', () => this.actualizarCalculo());
        VistaCotizacion.inputDireccion.addEventListener('input', () => this.actualizarCalculo());
        VistaCotizacion.btnWhatsapp.addEventListener('click', () => this.enviarPorWhatsApp());
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ControladorCotizacion.inicializar();
});