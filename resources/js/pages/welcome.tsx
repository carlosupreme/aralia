import React from 'react';

// Simulando los imports de Inertia
const Head = ({ title, children }: any) => <>{children}</>;
const Link = ({ href, className, children }: any) => (
    <a href={href} className={className}>{children}</a>
);

// Datos de ejemplo
const auth = { user: null }; // Cambiar a { user: { name: 'John' } } para ver estado autenticado

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Navbar */}
                <header className="sticky top-0 z-50 w-full border-b border-[#19140035] bg-white/80 backdrop-blur-sm dark:border-[#3E3E3A] dark:bg-[#0a0a0a]/80">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                        <div className="flex items-center">
                            <img src="/images/logo-empresa.jpeg" alt="" className="mx-auto h-8 pr-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FDFDFC] px-6 py-20 lg:px-8 lg:py-32 dark:from-[#0a0a0a] dark:to-[#161615]">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-6">
                                <h1 className="text-4xl leading-tight font-semibold lg:text-6xl">
                                    Psicología para la vida y para el <span className="text-[#055c9d] dark:text-[#055c9d]">deporte</span>
                                </h1>
                                <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                    Potencía el rendimiento de los deportistas a través del desarrollo de habilidades mentales y emocionales,
                                    ofreciendo servicios de entrenamiento mental personalizados y en grupo que promuevan la salud mental como base
                                    fundamental del éxito deportivo.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/register"
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-6 py-3 text-sm leading-normal font-medium text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                    >
                                        Formar parte
                                    </Link>
                                    <Link
                                        href="#about"
                                        className="inline-block rounded-sm border border-[#19140035] px-6 py-3 text-sm leading-normal font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Conocer más
                                    </Link>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative">
                                <div className="order-1 lg:order-2">
                                    <img
                                        src="/images/doodle.png"
                                        alt="About our platform"
                                        className="aspect-square w-full overflow-hidden rounded-lg object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section with Images */}
                <section className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">¿Por qué entrenar tu mente con nosotros?</h2>
                            <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                Buscamos que la salud mental sea una pieza clave en el camino hacia el rendimiento exitoso.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    title: 'Fortaleza mental que marca la diferencia',
                                    description:
                                        'Te ayudamos a desarrollar resiliencia, enfoque y control emocional, para que puedas rendir al máximo incluso bajo presión.\n' +
                                        'Entrena tu mente igual que entrenas tu cuerpo.',
                                    image: '/images/ceni.jpeg',
                                },
                                {
                                    title: 'Experiencia en múltiples deportes',
                                    description:
                                        'Cada deporte tiene su propio ritmo, dinámica y desafíos.\n' +
                                        'Hemos acompañado a atletas de diversas disciplinas que significa contar con estrategias adaptadas a tu entorno ' +
                                        'competitivo y una visión integral que potencia tu desempeño dentro y fuera del campo.',
                                    image: '/images/filial.jpeg',
                                },
                                {
                                    title: 'Bienestar integral y equilibrio personal',
                                    description:
                                        'El éxito deportivo no debe costarte tu salud mental.\n' +
                                        'Sabemos detectar signos de estrés, agotamiento o frustración, y te guíamos hacia un equilibrio entre tu vida personal y tus metas competitivas.',
                                    image: '/images/panteras.jpeg',
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group overflow-hidden rounded-lg border border-[#e3e3e0] bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    <img src={feature.image} alt={feature.title} className="mb-4 aspect-video w-full rounded-lg object-cover" />
                                    <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="bg-white px-6 py-20 lg:px-8 dark:bg-[#161615]">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="order-2 lg:order-1">
                                <h2 className="mb-6 text-3xl font-semibold lg:text-5xl">Sobre nosotros</h2>
                                <div className="space-y-4 text-[#706f6c] dark:text-[#A1A09A]">
                                    <p>
                                        Buscamos promover un espacio propicio para la comunión consciente de mente y cuerpo. Donde los sentidos, contrario a
                                        todas las creencias, en lugar de estar dormidos están más despiertos que nunca.
                                    </p>
                                    <p>
                                        Trabajamos de forma individual o grupal utilizando herramientas de hipnosis y programación neurolingüística para el manejo
                                        del estrés, autoestima y clarificación de metas.Brindamos ejercicios de visualización creativa y relajación para
                                        generar y enaltecer emociones de seguridad y confianza.
                                    </p>
                                    <p>  A través de ejercicios de relajación se les ayudará a
                                        visualizar paso a paso su competencia y retos físicos y mentales para así desempeñarse con mayor confianza y
                                        enfoque al momento de su evento. Promovemos el desempeño físico y mental para optimizar desempeño y resultados.</p>

                                </div>
                                <div className="mt-8 grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-3xl font-semibold text-[#055c9d] dark:text-[#055c9d]">10+</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Equipos Activos</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-semibold text-[#055c9d] dark:text-[#055c9d]">20+</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Proyectos</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-semibold text-[#055c9d] dark:text-[#055c9d]">99.9%</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Satisfacción</div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <img
                                    src="/images/psics.jpeg"
                                    alt="About our platform"
                                    className="aspect-square w-full overflow-hidden rounded-lg object-cover shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">Servicios que ofrecemos</h2>
                            <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">Elige el plan que se adecue a tus necesidades</p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {[
                                {
                                    name: 'Pláticas y talleres',
                                    price: '$150 mxn / padre',
                                    description: 'Para padres de familia y entrenadores',
                                    features: [
                                        'Si eres madre, padre o entrenador obtendrás\n' +
                                            'herramientas efectivas para ayudar a tu\n' +
                                            'deportista a lograrlo mientras desbloqueas tu\n' +
                                            'propio potencial\n',
                                        'Platica con padres de familia de acuerdo\n' + 'al plan de trabajo del entrenador',
                                    ],
                                    featured: false,
                                },
                                {
                                    name: 'Entrenamiento mental individual',
                                    price: '$1700 mxn / mes',
                                    description: 'Lo mejor para deportistas de alto rendimiento',
                                    features: [
                                        'Intervención psicológica con el deportista\n' +
                                            'Con toda la información de la evaluación\n' +
                                            'marcaremos los objetivos, diseñaré el plan de\n' +
                                            'entrenamiento y programaremos las sesiones\n' +
                                            'de trabajo,\n',
                                        'La primera sesión tiene una duración de 50 a\n' +
                                            '60 min , posterior a esto las intervenciones de\n' +
                                            '20- 35 min , las veces que sean necesarias de\n' +
                                            'acuerdo a los avances que se hagan con el\n' +
                                            'deportista.',
                                        'El número de sesiones va dependiendo de las\n' + 'necesidades del deportista.',
                                        'Trabajo multidisciplinario con padres de\n' + 'familia, entrenador o profesional del deporte',
                                        'De manera bimestral, se hace entrega de un\n' +
                                            'informe para el atleta , padre de familia y\n' +
                                            'entrenador.',
                                    ],
                                    featured: true,
                                },
                                {
                                    name:
                                        'Entrenamiento mental para deportistas dentro de un convenio',
                                    price: '$100 mxn / atleta',
                                    description: 'Para escuelas o clubs deportivos',
                                    features: [
                                        'Ofrecemos un convenio de entrenamiento\n' +
                                            'mental el cual consta de sesiones grupales en la\n' +
                                            'que los atletas desarrollarán habilidades clave\n' +
                                            'como la gestión del estrés, concentración,\n' +
                                            'resiliencia y trabajo en equipo, adaptadas a sus\n' +
                                            'necesidades y etapa de desarrollo.',
                                        'Talleres para deportistas de acuerdo al plan\n' + 'de trabajo del entrenador',

                                    ],
                                    featured: false,
                                },
                            ].map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden rounded-lg border p-8 transition-all ${
                                        plan.featured
                                            ? 'border-[#055c9d] bg-gradient-to-b from-white to-[#f53003]/5 shadow-xl dark:border-[#055c9d] dark:from-[#161615] dark:to-[#FF4433]/5'
                                            : 'border-[#e3e3e0] bg-white shadow-sm hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]'
                                    }`}
                                >
                                    {plan.featured && (
                                        <div className="absolute top-4 right-4 rounded-full bg-[#055c9d] px-3 py-1 text-xs font-medium text-white dark:bg-[#055c9d]">
                                            Popular
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="mb-2 text-2xl font-semibold">{plan.name}</h3>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{plan.description}</p>
                                    </div>

                                    <div className="mb-6">
                                        <span className="text-3xl font-semibold">{plan.price}</span>
                                        <span className="text-[#706f6c] dark:text-[#A1A09A]"></span>
                                    </div>

                                    <ul className="mb-8 space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-3">
                                                <svg
                                                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#055c9d] dark:text-[#055c9d]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/register"
                                        className={`block w-full rounded-sm border px-6 py-3 text-center text-sm leading-normal font-medium transition-all ${
                                            plan.featured
                                                ? 'border-black bg-[#1b1b18] text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white'
                                                : 'border-[#19140035] text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]'
                                        }`}
                                    >
                                        Comenzar
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-[#055c9d] to-[#05c7d] px-6 py-20 lg:px-8 dark:from-[#055c9d] dark:to-[#55c7d]">
                    <div className="mx-auto max-w-4xl text-center text-white">
                        <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">¿listo para comenar?</h2>
                        <p className="mb-8 text-lg opacity-90">Únete a este gran de equipo de atletas, entrenadores y familias ganadoras</p>
                        <Link
                            href="/register"
                            className="inline-block rounded-sm border-2 border-white bg-white px-8 py-3 text-sm leading-normal font-medium text-[#1b1b18] hover:bg-transparent hover:text-white"
                        >
                            Comenzar
                        </Link>
                    </div>
                    <div className="mt-12  pt-8 text-center text-sm text-white dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                        © 2025 Psicologia para la vida y para el deporte. Todos los derechos reservados.
                    </div>
                </section>

                {/* Footer */}

            </div>
        </>
    );
}
