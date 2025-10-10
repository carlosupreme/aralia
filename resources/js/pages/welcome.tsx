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
              <span className="text-xl font-semibold text-[#f53003] dark:text-[#FF4433]">
                    psiclogias
              </span>
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
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FDFDFC] px-6 py-20 dark:from-[#0a0a0a] dark:to-[#161615] lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-6">
                                <h1 className="text-4xl font-semibold leading-tight lg:text-6xl">
                                    Psicología para la vida y para el{' '}
                                    <span className="text-[#055c9d] dark:text-[#055c9d]">deporte</span>
                                </h1>
                                <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                    Potencía el rendimiento de los deportistas a través
                                    del desarrollo de habilidades mentales y
                                    emocionales, ofreciendo servicios de entrenamiento
                                    mental personalizados y en grupo que promuevan la
                                    salud mental como base fundamental del éxito
                                    deportivo.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/register"
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-6 py-3 text-sm font-medium leading-normal text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                    >
                                        Formar parte
                                    </Link>
                                    <Link
                                        href="#about"
                                        className="inline-block rounded-sm border border-[#19140035] px-6 py-3 text-sm font-medium leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Conocer más
                                    </Link>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative">
                                <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-[#f53003]/10 to-[#ff9966]/10 p-8 shadow-2xl dark:from-[#FF4433]/10 dark:to-[#ff9966]/10">
                                    <svg
                                        className="h-full w-full text-[#f53003] dark:text-[#FF4433]"
                                        viewBox="0 0 200 200"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                                        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                                        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                                        <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.8" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section with Images */}
                <section className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">
                                ¿Por qué entrenar tu mente con nosotros?
                            </h2>
                            <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                Buscamos que la salud mental sea una pieza clave
                                en el camino hacia el rendimiento exitoso.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    title: 'Experiencia',
                                    description: 'Write clean, expressive code that is easy to read and maintain.',
                                    color: 'from-blue-500/10 to-cyan-500/10'
                                },
                                {
                                    title: 'Powerful Tools',
                                    description: 'Built-in authentication, routing, sessions, and caching out of the box.',
                                    color: 'from-purple-500/10 to-pink-500/10'
                                },
                                {
                                    title: 'Vibrant Ecosystem',
                                    description: 'Access to thousands of packages and a supportive community.',
                                    color: 'from-orange-500/10 to-red-500/10'
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group overflow-hidden rounded-lg border border-[#e3e3e0] bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    <div className={`mb-4 aspect-video rounded-lg bg-gradient-to-br ${feature.color}`}></div>
                                    <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="bg-white px-6 py-20 dark:bg-[#161615] lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="order-2 lg:order-1">
                                <h2 className="mb-6 text-3xl font-semibold lg:text-5xl">
                                    About Our Platform
                                </h2>
                                <div className="space-y-4 text-[#706f6c] dark:text-[#A1A09A]">
                                    <p>
                                        We've been helping developers build exceptional applications since our inception. Our platform combines the power of Laravel with modern development practices to deliver outstanding results.
                                    </p>
                                    <p>
                                        With thousands of successful projects and a growing community of developers, we're committed to providing the best tools and resources for your development journey.
                                    </p>
                                    <p>
                                        Whether you're building a simple blog or a complex enterprise application, our platform scales with your needs and provides the support you deserve.
                                    </p>
                                </div>
                                <div className="mt-8 grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-3xl font-semibold text-[#f53003] dark:text-[#FF4433]">10K+</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Active Users</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-semibold text-[#f53003] dark:text-[#FF4433]">50K+</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Projects</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-semibold text-[#f53003] dark:text-[#FF4433]">99.9%</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Uptime</div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-[#f53003]/20 to-[#ff9966]/20 shadow-2xl dark:from-[#FF4433]/20 dark:to-[#ff9966]/20"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                Choose the plan that fits your needs
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {[
                                {
                                    name: 'Starter',
                                    price: '$9',
                                    description: 'Perfect for small projects and learning',
                                    features: [
                                        '5 Projects',
                                        '10GB Storage',
                                        'Basic Support',
                                        'SSL Certificate',
                                        'Daily Backups'
                                    ],
                                    featured: false
                                },
                                {
                                    name: 'Professional',
                                    price: '$29',
                                    description: 'Best for growing businesses',
                                    features: [
                                        '25 Projects',
                                        '100GB Storage',
                                        'Priority Support',
                                        'SSL Certificate',
                                        'Hourly Backups',
                                        'CDN Integration',
                                        'Advanced Analytics'
                                    ],
                                    featured: true
                                },
                                {
                                    name: 'Enterprise',
                                    price: '$99',
                                    description: 'For large-scale applications',
                                    features: [
                                        'Unlimited Projects',
                                        '1TB Storage',
                                        '24/7 Dedicated Support',
                                        'SSL Certificate',
                                        'Real-time Backups',
                                        'CDN Integration',
                                        'Advanced Analytics',
                                        'Custom Integrations',
                                        'SLA Guarantee'
                                    ],
                                    featured: false
                                }
                            ].map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden rounded-lg border p-8 transition-all ${
                                        plan.featured
                                            ? 'border-[#f53003] bg-gradient-to-b from-white to-[#f53003]/5 shadow-xl dark:border-[#FF4433] dark:from-[#161615] dark:to-[#FF4433]/5'
                                            : 'border-[#e3e3e0] bg-white shadow-sm hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]'
                                    }`}
                                >
                                    {plan.featured && (
                                        <div className="absolute right-4 top-4 rounded-full bg-[#f53003] px-3 py-1 text-xs font-medium text-white dark:bg-[#FF4433]">
                                            Popular
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="mb-2 text-2xl font-semibold">{plan.name}</h3>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <span className="text-5xl font-semibold">{plan.price}</span>
                                        <span className="text-[#706f6c] dark:text-[#A1A09A]">/month</span>
                                    </div>

                                    <ul className="mb-8 space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-3">
                                                <svg
                                                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f53003] dark:text-[#FF4433]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/register"
                                        className={`block w-full rounded-sm border px-6 py-3 text-center text-sm font-medium leading-normal transition-all ${
                                            plan.featured
                                                ? 'border-black bg-[#1b1b18] text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white'
                                                : 'border-[#19140035] text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]'
                                        }`}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-[#f53003] to-[#ff9966] px-6 py-20 dark:from-[#FF4433] dark:to-[#ff9966] lg:px-8">
                    <div className="mx-auto max-w-4xl text-center text-white">
                        <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">
                            Ready to Get Started?
                        </h2>
                        <p className="mb-8 text-lg opacity-90">
                            Join thousands of developers building amazing applications with Laravel
                        </p>
                        <Link
                            href="/register"
                            className="inline-block rounded-sm border-2 border-white bg-white px-8 py-3 text-sm font-medium leading-normal text-[#1b1b18] hover:bg-transparent hover:text-white"
                        >
                            Start Building Today
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-[#e3e3e0] bg-white px-6 py-12 dark:border-[#3E3E3A] dark:bg-[#161615] lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 font-semibold text-[#f53003] dark:text-[#FF4433]">
                                    Laravel
                                </h3>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    Building the future of web development
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-medium">Product</h4>
                                <ul className="space-y-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Features</a></li>
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Pricing</a></li>
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Documentation</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-medium">Company</h4>
                                <ul className="space-y-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">About</a></li>
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Blog</a></li>
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Careers</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-medium">Support</h4>
                                <ul className="space-y-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Help Center</a></li>
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Contact</a></li>
                                    <li><a href="#" className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]">Status</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-[#e3e3e0] pt-8 text-center text-sm text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                            © 2024 Laravel. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
