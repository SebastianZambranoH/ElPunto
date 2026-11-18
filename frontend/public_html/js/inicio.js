
const CONFIG_NEGOCIO = {
    telefonoWhatsApp: "573227662086", 
    mensajeDefault: "Hola Lechonería y Tamalería El Punto, quisiera más información sobre sus productos."
};

const CATALOGO_PRODUCTOS = [
    {
        categoria: "Lechona",
        items: [
            {
                nombre: "Plato Estándar",
                precio: 12000,
                imagen: 'img/plato-estandar.jfif',
                descripcion: "Porción individual de 250g con cuero crujiente, carne tierna, arveja y arepa."
            },
            {
                nombre: "Plato Especial",
                precio: 15000,
                imagen: "img/plato-especial.jfif",
                descripcion: "Porción generosa de 350g, extra cuero crujiente y doble arepa."
            }
        ]
    },
    {
        categoria: "Tamales",
        items: [
            {
                nombre: "Tamal Tolimense",
                precio: 7000,
                imagen: "img/tamal-tradicional.jfif",
                descripcion: "Masa de maíz tradicional con cerdo, pollo, huevo, zanahoria y arveja, envuelto en hoja de plátano."
            },
            {
                nombre: "Tamal Volteado",
                precio: 15000,
                imagen: "img/tamal-volteado.jfif",
                descripcion: "Tamal tradicional coronado con una generosa cama de lechona y cuero crujiente."
            }
        ]
    }
];

function crearTarjetaProductoHTML(producto) {
    const precioFormateado = `$${producto.precio.toLocaleString('es-CO')}`;
    
    const contenidoImagen = producto.imagen === "IMG" 
        ? "IMG" 
        : `<img src="${producto.imagen}" alt="${producto.nombre}">`;

    return `
        <article class="plato">
            <div class="plato-info">
                <h4>${producto.nombre}</h4>
                <span class="precio">${precioFormateado}</span>
            </div>
            <div class="plato-img">${contenidoImagen}</div>
            <div class="tooltip">${producto.descripcion}</div>
        </article>
    `;
}

function renderizarCatalogo(catalogo, contenedor) {
    
    contenedor.innerHTML = "";

    catalogo.forEach(grupo => {
        
        const columnaDiv = document.createElement('div');
        columnaDiv.classList.add('columna-categoria');

        
        const platosHTML = grupo.items.map(item => crearTarjetaProductoHTML(item)).join('');

        columnaDiv.innerHTML = `
            <h3 class="titulo-categoria">${grupo.categoria}</h3>
            ${platosHTML}
        `;

        contenedor.appendChild(columnaDiv);
    });
}

function inicializarEventosContacto() {
    const botonesContacto = document.querySelectorAll('.btn-whatsapp-directo');
    
    botonesContacto.forEach(boton => {
        boton.addEventListener('click', () => {
            const url = `https://wa.me/${CONFIG_NEGOCIO.telefonoWhatsApp}?text=${encodeURIComponent(CONFIG_NEGOCIO.mensajeDefault)}`;
            window.open(url, '_blank');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    
    if (contenedorProductos) {
        renderizarCatalogo(CATALOGO_PRODUCTOS, contenedorProductos);
    }
    
    inicializarEventosContacto();
    ControladorCarrusel.inicializar();
});

/* ==========================================================================
   1. MODELO - IMÁGENES DEL CARRUSEL
   ========================================================================== */
const IMAGENES_CARRUSEL = [
    { url: 'img/cojin-lechona.jfif', alt: 'Lechona tolimense recién salida del horno' },
    { url: 'img/plato-especial.jfif', alt: 'Punto de venta Lechonería y Tamalería El Punto' },
    { url: 'img/tamal-tradicional.jfif', alt: 'Tamales tolimenses envueltos en hoja de plátano' },
    { url: 'img/tamal-volteado.jfif', alt: 'Tamal tradicional coronado con una generosa cama de lechona y cuero crujiente.' }
];

/* ==========================================================================
   3. CONTROLADOR - CARRUSEL
   ========================================================================== */
const ControladorCarrusel = {
    indiceActual: 0,
    intervalo: null,
    tiempoAutoPlay: 5000, // Cambia cada 5 segundos

    inicializar() {
        this.contenedorSlides = document.getElementById('carrusel-slides');
        this.contenedorIndicadores = document.getElementById('carrusel-indicadores');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');

        if (!this.contenedorSlides) return;

        this.renderizarEstructura();
        this.registrarEventos();
        this.iniciarAutoPlay();
    },

    renderizarEstructura() {
        IMAGENES_CARRUSEL.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            if (index === 0) slide.classList.add('activo');
            slide.style.backgroundImage = `url('${img.url}')`;
            slide.setAttribute('role', 'img');
            slide.setAttribute('aria-label', img.alt);
            this.contenedorSlides.appendChild(slide);

            const dot = document.createElement('button');
            dot.classList.add('indicador');
            if (index === 0) dot.classList.add('activo');
            dot.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
            dot.addEventListener('click', () => {
                this.irASlide(index);
                this.reiniciarAutoPlay();
            });
            this.contenedorIndicadores.appendChild(dot);
        });
    },

    irASlide(nuevoIndice) {
        const slides = this.contenedorSlides.querySelectorAll('.slide');
        const dots = this.contenedorIndicadores.querySelectorAll('.indicador');

        slides[this.indiceActual].classList.remove('activo');
        dots[this.indiceActual].classList.remove('activo');

        this.indiceActual = (nuevoIndice + slides.length) % slides.length;

        slides[this.indiceActual].classList.add('activo');
        dots[this.indiceActual].classList.add('activo');
    },

    siguiente() {
        this.irASlide(this.indiceActual + 1);
    },

    anterior() {
        this.irASlide(this.indiceActual - 1);
    },

    iniciarAutoPlay() {
        this.intervalo = setInterval(() => this.siguiente(), this.tiempoAutoPlay);
    },

    reiniciarAutoPlay() {
        clearInterval(this.intervalo);
        this.iniciarAutoPlay();
    },

    registrarEventos() {
        this.btnNext.addEventListener('click', () => {
            this.siguiente();
            this.reiniciarAutoPlay();
        });

        this.btnPrev.addEventListener('click', () => {
            this.anterior();
            this.reiniciarAutoPlay();
        });
    }
};