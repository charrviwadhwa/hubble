import { Link } from 'react-router-dom';

import heroA from '../assets/hello2.jpg';
import heroB from '../assets/hello3.jpg';
import heroC from '../assets/hello4.jpg';
import workA from '../assets/events.png';
import workB from '../assets/routeing.png';
import workC from '../assets/calender.png';
import faceA from '../assets/friends.png';
import faceB from '../assets/7605885.jpg';
import faceC from '../assets/college.jpg';

const headingFont = { fontFamily: 'Playfair, serif' };

export default function Home() {
  return (
    <div id="Top" className="min-h-screen bg-[#f3efe8] text-[#131313]">
      <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-6 md:px-8">
        <header className="anim-fade sticky top-4 z-30 rounded-2xl border border-black/10 bg-[#f7f3ec]/95 px-5 py-4 backdrop-blur md:px-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-semibold tracking-tight">Hubble<span className="text-[#ff6b35]">.</span></p>
            <nav className="hidden items-center gap-8 text-sm md:flex">
              <a href="#about" className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60">About</a>
              <a href="#services" className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60">Services</a>
              <a href="#work" className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60">Work</a>
              <a href="#pricing" className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60">Pricing</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm transition hover:opacity-60">Login</Link>
              <Link to="/signup" className="rounded-full border border-black px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-black hover:text-white">Get Started</Link>
            </div>
          </div>
        </header>

        <section className="anim-rise mt-7 overflow-hidden rounded-[30px] bg-[#161616] px-5 py-10 text-white md:px-10 md:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-white/30 px-4 py-1 text-xs tracking-wide text-white/80">Creative Student Platform</p>
              <h1 className="text-5xl leading-[1.02] md:text-7xl" style={headingFont}>
                Build smart,
                <br />
                unforgettable
                <br />
                learning brands.
              </h1>
              <p className="mt-5 max-w-lg text-sm text-white/70 md:text-base">
                Inspired by premium CMS landing pages, tailored for Hubble. We blend strong visual identity with conversion-focused sections.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/signup" className="rounded-full bg-[#ff6b35] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#ff5720]">Start project</Link>
                <button className="rounded-full border border-white/40 px-6 py-3 text-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-black">View process</button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="anim-float sm:col-span-2 h-52 overflow-hidden rounded-3xl bg-white/10">
                <img src={heroA} alt="Hero" className="h-full w-full object-cover" />
              </div>
              <div className="anim-float h-44 overflow-hidden rounded-3xl bg-white/10" style={{ animationDelay: '0.3s' }}>
                <img src={heroB} alt="Student" className="h-full w-full object-cover" />
              </div>
              <div className="anim-float h-44 overflow-hidden rounded-3xl bg-white/10" style={{ animationDelay: '0.6s' }}>
                <img src={heroC} alt="Student" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/20 pt-6 md:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold">120+</p>
              <p className="text-sm text-white/70">Projects completed</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">95%</p>
              <p className="text-sm text-white/70">Client retention rate</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">4.9/5</p>
              <p className="text-sm text-white/70">Average satisfaction</p>
            </div>
          </div>
        </section>

        <section id="services" className="anim-rise mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-4xl md:text-6xl" style={headingFont}>What we can do</h2>
            <p className="max-w-sm text-sm text-black/60">Everything needed to launch and grow a modern education brand.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">01</p>
              <h3 className="mt-3 text-2xl" style={headingFont}>Brand Identity</h3>
              <p className="mt-3 text-sm text-black/65">Naming, messaging, visual language, and design systems with memorable direction.</p>
            </article>
            <article className="rounded-3xl border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">02</p>
              <h3 className="mt-3 text-2xl" style={headingFont}>Web Design</h3>
              <p className="mt-3 text-sm text-black/65">Pixel-precise landing pages with CMS-ready layout, typography, and art direction.</p>
            </article>
            <article className="rounded-3xl border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">03</p>
              <h3 className="mt-3 text-2xl" style={headingFont}>Growth Support</h3>
              <p className="mt-3 text-sm text-black/65">Ongoing optimization, funnel analysis, and creative experiments to scale results.</p>
            </article>
          </div>
        </section>

        <section id="about" className="anim-rise mt-16 grid gap-5 lg:grid-cols-[1fr,1fr]">
          <article className="rounded-3xl bg-[#ece6dc] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-black/55">About Agency</p>
            <h2 className="mt-3 text-4xl md:text-5xl" style={headingFont}>We create digital experiences that convert.</h2>
            <p className="mt-4 text-sm text-black/65">Our process combines strategy, copy, and interface craft to make each section purposeful and conversion-led.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <button className="rounded-full bg-black px-4 py-2 text-white">Design</button>
              <button className="rounded-full border border-black/20 px-4 py-2">Strategy</button>
              <button className="rounded-full border border-black/20 px-4 py-2">Development</button>
            </div>
          </article>
          <div className="overflow-hidden rounded-3xl bg-white p-3">
            <img src={workA} alt="Work preview" className="h-full w-full rounded-2xl object-cover" />
          </div>
        </section>

        <section id="work" className="anim-rise mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-4xl md:text-6xl" style={headingFont}>Featured work</h2>
            <a href="#Top" className="text-sm underline underline-offset-4">Back to top</a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="overflow-hidden rounded-3xl border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <img src={workA} alt="Project one" className="h-64 w-full object-cover" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Education</p>
                <h3 className="mt-2 text-3xl" style={headingFont}>Classroom Product Launch</h3>
              </div>
            </article>
            <article className="overflow-hidden rounded-3xl border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <img src={workB} alt="Project two" className="h-64 w-full object-cover" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">SaaS</p>
                <h3 className="mt-2 text-3xl" style={headingFont}>Smart Enrollment Experience</h3>
              </div>
            </article>
            <article className="overflow-hidden rounded-3xl border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-md md:col-span-2">
              <img src={workC} alt="Project three" className="h-72 w-full object-cover" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Platform</p>
                <h3 className="mt-2 text-3xl" style={headingFont}>Hubble Dashboard System</h3>
              </div>
            </article>
          </div>
        </section>

        <section id="pricing" className="mt-16 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-black/10 bg-white p-6">
            <h3 className="text-2xl" style={headingFont}>Starter</h3>
            <p className="mt-2 text-4xl font-semibold">$499</p>
            <p className="mt-3 text-sm text-black/60">One-page layout and essential content setup.</p>
          </article>
          <article className="rounded-3xl border border-black bg-[#111] p-6 text-white">
            <h3 className="text-2xl" style={headingFont}>Growth</h3>
            <p className="mt-2 text-4xl font-semibold">$1,499</p>
            <p className="mt-3 text-sm text-white/70">Multi-section build with CMS-like structure.</p>
          </article>
          <article className="rounded-3xl border border-black/10 bg-white p-6">
            <h3 className="text-2xl" style={headingFont}>Scale</h3>
            <p className="mt-2 text-4xl font-semibold">Custom</p>
            <p className="mt-3 text-sm text-black/60">Advanced design systems and growth support.</p>
          </article>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <article className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Testimonials</p>
            <h2 className="mt-3 text-4xl md:text-5xl" style={headingFont}>People love working with us.</h2>
            <p className="mt-4 text-base text-black/70">"Their design process is clear, fast, and genuinely strategic. We launched with clarity and confidence."</p>
            <div className="mt-6 flex items-center gap-3">
              <img src={faceA} alt="Client" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">Riya M.</p>
                <p className="text-xs text-black/50">Product Lead</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl bg-[#151515] p-6 text-white md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">FAQ</p>
            <div className="mt-4 space-y-4 text-sm">
              <div className="rounded-xl border border-white/20 p-4">
                <p className="font-medium">How long does a website take?</p>
                <p className="mt-2 text-white/70">Most projects are delivered in 2-4 weeks.</p>
              </div>
              <div className="rounded-xl border border-white/20 p-4">
                <p className="font-medium">Do you also build dashboards?</p>
                <p className="mt-2 text-white/70">Yes. We handle both marketing and product surfaces.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-16 rounded-3xl border border-black/10 bg-white p-6 md:p-8">
          <div className="grid items-center gap-5 md:grid-cols-[1.2fr,0.8fr]">
            <div>
              <h2 className="text-4xl md:text-5xl" style={headingFont}>Stay in the loop.</h2>
              <p className="mt-3 text-sm text-black/60">Get updates on our latest design drops and product stories.</p>
              <div className="mt-5 flex max-w-md gap-3">
                <input type="email" placeholder="Enter your email" className="w-full rounded-full border border-black/20 px-4 py-3 text-sm outline-none" />
                <button className="rounded-full bg-black px-5 py-3 text-sm text-white">Subscribe</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <img src={faceA} alt="thumb1" className="h-24 w-full rounded-2xl object-cover" />
              <img src={faceB} alt="thumb2" className="h-24 w-full rounded-2xl object-cover" />
              <img src={faceC} alt="thumb3" className="h-24 w-full rounded-2xl object-cover" />
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-black/10 py-8 text-sm text-black/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>Hubble. Creative Education Studio</p>
            <div className="flex gap-5">
              <a href="#Top">Top</a>
              <a href="#services">Services</a>
              <a href="#work">Work</a>
              <a href="#pricing">Pricing</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
