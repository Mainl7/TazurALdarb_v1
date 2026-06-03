"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc/react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ========================================
// Hero Section
// ========================================
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ornamentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        );

      // Float ornaments
      gsap.to(".hero-ornament", {
        y: -15,
        rotation: 5,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.4,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden islamic-pattern-bg"
    >
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e24]/60 via-transparent to-[#1a2e24]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#355046]/30 to-transparent" />

      {/* Decorative ornaments */}
      <div ref={ornamentsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Corner ornaments */}
        <div className="hero-ornament absolute top-8 right-8 w-24 h-24 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="50" cy="50" r="12" fill="currentColor" fillOpacity="0.3"/>
            <circle cx="50" cy="50" r="6" fill="currentColor" fillOpacity="0.5"/>
          </svg>
        </div>
        <div className="hero-ornament absolute bottom-8 left-8 w-24 h-24 opacity-30" style={{animationDelay:'0.5s'}}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="50" cy="50" r="12" fill="currentColor" fillOpacity="0.3"/>
          </svg>
        </div>
        <div className="hero-ornament absolute top-1/3 left-12 w-16 h-16 opacity-20" style={{animationDelay:'1s'}}>
          <svg viewBox="0 0 60 60" className="w-full h-full text-yellow-300">
            <path d="M30 0L35 25L60 30L35 35L30 60L25 35L0 30L25 25Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="hero-ornament absolute top-1/4 right-1/4 w-12 h-12 opacity-15" style={{animationDelay:'1.5s'}}>
          <svg viewBox="0 0 50 50" className="w-full h-full text-yellow-200">
            <path d="M25 0L29 21L50 25L29 29L25 50L21 29L0 25L21 21Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Large star pattern top center */}
        <div className="hero-ornament absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 opacity-5 animate-spin-slow">
          <svg viewBox="0 0 200 200" className="w-full h-full text-yellow-300">
            <path d="M100 10 L115 80 L190 90 L130 140 L145 215 L100 175 L55 215 L70 140 L10 90 L85 80 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-400/20 mb-8">
          <span className="text-yellow-400 text-sm">✨</span>
          <span className="text-yellow-300 text-sm font-medium">جمعية تآزر لرعاية الأيتام - محافظة الدرب</span>
          <span className="text-yellow-400 text-sm">✨</span>
        </div>

        {/* Title */}
        <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight opacity-0">
          بطاقات تهنئة إسلامية
          <br />
          <span className="gold-text">مخصصة باسمك</span>
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed opacity-0">
          أنشئ بطاقة تهنئة فريدة بمناسبات العيد والمناسبات الإسلامية،
          خصّصها باسمك وحمّلها بجودة عالية مجاناً
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <Link href="/cards" className="btn-gold text-lg px-8 py-4 gap-3">
            <span>🎴</span>
            <span>ابدأ الآن</span>
          </Link>
          <Link href="#occasions" className="btn-outline text-lg px-8 py-4 gap-3">
            <span>👁️</span>
            <span>استعرض البطاقات</span>
          </Link>
        </div>

        {/* Stats mini */}
        <div className="flex items-center justify-center gap-8 mt-14">
          {[
            { num: "+32", label: "بطاقة احترافية" },
            { num: "4", label: "مناسبات دينية" },
            { num: "مجاناً", label: "التحميل والمشاركة" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black gold-text">{stat.num}</div>
              <div className="text-white/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-yellow-400/40 flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-yellow-400/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// ========================================
// Occasions Section
// ========================================
const OCCASIONS_DATA = [
  {
    slug: "eid-al-fitr",
    title: "عيد الفطر المبارك",
    icon: "🌙",
    color: "from-[#355046] to-[#1a2e24]",
    cardColor: "#3F806A",
    description: "بطاقات تهنئة فاخرة بمناسبة عيد الفطر السعيد",
    cards: [
      "/cards/eid-fitr/بطاقة تهنئة عيد الفطر 1.png",
      "/cards/eid-fitr/بطاقة تهنئة عيد الفطر 2.png",
      "/cards/eid-fitr/بطاقة تهنئة عيد الفطر 3.png",
      "/cards/eid-fitr/بطاقة تهنئة عيد الفطر 4.png",
    ],
  },
  {
    slug: "eid-al-adha",
    title: "عيد الأضحى المبارك",
    icon: "🕌",
    color: "from-amber-700 to-amber-900",
    cardColor: "#8B4513",
    description: "بطاقات تهنئة فاخرة بمناسبة عيد الأضحى الكريم",
    cards: [
      "/cards/eid-adha/بطاقة تهنئة عيد الأضحى 1.png",
      "/cards/eid-adha/بطاقة تهنئة عيد الأضحى 2.png",
      "/cards/eid-adha/بطاقة تهنئة عيد الأضحى 3.png",
      "/cards/eid-adha/بطاقة تهنئة عيد الأضحى 4.png",
    ],
  },
  {
    slug: "ramadan",
    title: "شهر رمضان الكريم",
    icon: "🪔",
    color: "from-purple-700 to-indigo-900",
    cardColor: "#4B0082",
    description: "بطاقات تهنئة فاخرة بمناسبة شهر رمضان المبارك",
    cards: [
      "/cards/ramadan/بطاقة تهنئة رمضان 1.png",
      "/cards/ramadan/بطاقة تهنئة رمضان 2.png",
      "/cards/ramadan/بطاقة تهنئة رمضان 3.png",
      "/cards/ramadan/بطاقة تهنئة رمضان 4.png",
    ],
  },
];

function OccasionsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".occasion-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="occasions"
      ref={sectionRef}
      className="py-24 bg-white islamic-pattern-light"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-4">
            <span className="text-green-600 text-sm font-medium">المناسبات الدينية</span>
          </div>
          <h2 className="section-title text-[#355046]">
            اختر مناسبتك المفضلة
          </h2>
          <div className="divider-gold" />
          <p className="section-subtitle">
            تصفّح مجموعتنا الفاخرة من البطاقات المصممة بأعلى جودة لكل مناسبة دينية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OCCASIONS_DATA.map((occasion) => (
            <div
              key={occasion.slug}
              className="occasion-card group relative rounded-2xl overflow-hidden shadow-xl card-hover opacity-0"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${occasion.color} opacity-95`} />
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23D4AF37' fill-opacity='0.5'%3E%3Cpath d='M20 0L25 15L40 20L25 25L20 40L15 25L0 20L15 15Z'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />

              {/* Content */}
              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-4xl mb-2">{occasion.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{occasion.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{occasion.description}</p>
                  </div>
                  <div className="text-white/30 text-6xl font-black">8+</div>
                </div>

                {/* Card previews */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {occasion.cards.map((card, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] rounded-lg overflow-hidden border border-white/20 group-hover:scale-105 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <Image
                        src={card}
                        alt={`${occasion.title} - بطاقة ${i + 1}`}
                        width={120}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/cards?occasion=${occasion.slug}`}
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-bold text-center transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #C8A969, #d9bf8a)",
                    color: "#1a2e24",
                  }}
                >
                  <span>استعرض كل البطاقات</span>
                  <span className="text-xl">←</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================================
// How It Works Section
// ========================================
function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".step-card",
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      icon: "🎴",
      title: "اختر البطاقة",
      desc: "تصفّح مجموعتنا الفاخرة من البطاقات واختر ما يناسب مناسبتك",
      color: "#3F806A",
    },
    {
      num: "02",
      icon: "✍️",
      title: "اكتب اسمك",
      desc: "أضف اسمك أو اسم من تهنئه على البطاقة مع خيارات التخصيص الكاملة",
      color: "#C8A969",
    },
    {
      num: "03",
      icon: "📥",
      title: "حمّل البطاقة",
      desc: "احفظ بطاقتك بجودة عالية 4K وشاركها مع أحبائك مجاناً",
      color: "#3F806A",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-[#F9F7F2]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4"
               style={{borderColor: 'rgba(200,169,105,0.3)', background: 'rgba(200,169,105,0.08)'}}>
            <span className="text-sm font-medium" style={{color: '#a8893f'}}>طريقة الاستخدام</span>
          </div>
          <h2 className="section-title" style={{color: '#355046'}}>
            3 خطوات بسيطة فقط
          </h2>
          <div className="divider-gold" />
          <p className="section-subtitle">
            إنشاء بطاقتك الإسلامية المخصصة أمر سهل وسريع في ثلاث خطوات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 right-[16.5%] left-[16.5%] h-0.5"
               style={{background: 'linear-gradient(90deg, #3F806A, #C8A969, #3F806A)'}} />

          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card relative bg-white rounded-2xl p-8 shadow-lg text-center opacity-0"
              style={{borderTop: `3px solid ${step.color}`}}
            >
              {/* Step number */}
              <div className="absolute -top-4 right-1/2 translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg"
                   style={{background: step.color}}>
                {i + 1}
              </div>

              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg"
                   style={{background: `${step.color}15`, border: `1px solid ${step.color}25`}}>
                {step.icon}
              </div>

              {/* Big step num */}
              <div className="text-6xl font-black mb-4 opacity-10" style={{color: step.color}}>{step.num}</div>

              <h3 className="text-xl font-bold mb-3" style={{color: step.color}}>{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/cards" className="btn-primary text-lg px-10 py-4 gap-3">
            <span>ابدأ الآن مجاناً</span>
            <span>🚀</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ========================================
// Stats Section
// ========================================
function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const [counts, setCounts] = useState({
    orphans: 0,
    beneficiaries: 0,
    programs: 0,
    years: 0,
  });

  const targets = {
    orphans: 247,
    beneficiaries: 1200,
    programs: 18,
    years: 12,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          // Animate counts
          const duration = 2000;
          const start = Date.now();
          const animate = () => {
            const now = Date.now();
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts({
              orphans: Math.floor(targets.orphans * eased),
              beneficiaries: Math.floor(targets.beneficiaries * eased),
              programs: Math.floor(targets.programs * eased),
              years: Math.floor(targets.years * eased),
            });
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  const stats = [
    { value: counts.orphans, suffix: "+", label: "يتيم مكفول", icon: "🤲", color: "#C8A969" },
    { value: counts.beneficiaries, suffix: "+", label: "مستفيد من خدماتنا", icon: "👨‍👩‍👧‍👦", color: "#FFFFFF" },
    { value: counts.programs, suffix: "", label: "برنامج ومشروع", icon: "📋", color: "#C8A969" },
    { value: counts.years, suffix: " عاماً", label: "من العطاء المتواصل", icon: "🏆", color: "#FFFFFF" },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a2e24 0%, #355046 50%, #1a2e24 100%)" }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 islamic-pattern-bg" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C8A969]/20 mb-4"
               style={{background: 'rgba(200,169,105,0.08)'}}>
            <span className="text-[#C8A969] text-sm font-medium">عن جمعية تآزر</span>
          </div>
          <h2 className="section-title text-white">
            رسالتنا في أرقام
          </h2>
          <div className="divider-gold" />
          <p className="section-subtitle text-white/70 max-w-2xl mx-auto">
            جمعية تآزر لرعاية الأيتام بمحافظة الدرب - جمعية خيرية تعمل على رعاية
            الأيتام وتمكينهم اجتماعياً وتعليمياً
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl glass border border-white/10"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: stat.color }}>
                {stat.value.toLocaleString("ar-SA")}
                <span className="text-2xl">{stat.suffix}</span>
              </div>
              <div className="text-white/70 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* About text */}
        <div className="mt-16 max-w-3xl mx-auto text-center glass rounded-2xl p-8 border border-white/10">
          <p className="text-white/80 leading-relaxed text-lg">
            تأسست جمعية تآزر لرعاية الأيتام بمحافظة الدرب بهدف توفير الرعاية الشاملة للأيتام،
            من خلال برامج التعليم والتدريب المهني والدعم النفسي والاجتماعي. نسعى جاهدين لتمكين
            جيل المستقبل وغرس قيم الإسلام الحنيف فيهم.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 rounded-full text-sm font-medium" style={{background:'rgba(212,175,55,0.15)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.3)'}}>
              رعاية الأيتام
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-medium" style={{background:'rgba(212,175,55,0.15)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.3)'}}>
              الدعم التعليمي
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-medium" style={{background:'rgba(212,175,55,0.15)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.3)'}}>
              التمكين الاجتماعي
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-medium" style={{background:'rgba(212,175,55,0.15)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.3)'}}>
              البرامج التدريبية
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========================================
// Featured Cards Slider Section
// ========================================
function FeaturedCardsSection() {
  const { data, isLoading } = trpc.cards.getFeatured.useQuery();

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 skeleton rounded w-64 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{background:'rgba(63,128,106,0.08)', border:'1px solid rgba(63,128,106,0.2)'}}>
            <span className="text-sm font-medium" style={{color:'#3F806A'}}>أبرز البطاقات</span>
          </div>
          <h2 className="section-title" style={{color: '#355046'}}>
            أكثر البطاقات تحميلاً
          </h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data?.map((card) => (
            <Link
              key={card.id}
              href={`/editor/${card.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-lg card-hover"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src={card.imageUrl}
                  alt={card.titleAr}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 left-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-white text-sm font-bold mb-1">{card.titleAr}</div>
                  <div className="flex items-center gap-2 text-yellow-400 text-xs">
                    <span>📥 {card.downloadsCount} تحميل</span>
                  </div>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                   style={{background: 'rgba(53,80,70,0.9)', backdropFilter: 'blur(4px)'}}>
                {card.occasionTitleAr}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/cards" className="btn-primary gap-3">
            <span>عرض جميع البطاقات</span>
            <span>🎴</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ========================================
// Main Page
// ========================================
export default function HomePage() {
  return (
    <main>
      {/* Header/Nav */}
      <header className="fixed top-0 right-0 left-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-horizontal.png"
              alt="جمعية تآزر لرعاية الأيتام بمحافظة الدرب"
              width={220}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/", label: "الرئيسية" },
              { href: "/cards", label: "البطاقات" },
              { href: "#occasions", label: "المناسبات" },
              { href: "#about", label: "عن الجمعية" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 hover:text-yellow-400 transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link href="/cards" className="btn-gold text-sm px-5 py-2.5 gap-2">
            <span>ابدأ الآن</span>
            <span>🎴</span>
          </Link>
        </div>
      </header>

      {/* Page sections */}
      <HeroSection />
      <OccasionsSection />
      <FeaturedCardsSection />
      <HowItWorksSection />
      <StatsSection />

      {/* Footer */}
      <footer className="py-12 text-center" style={{background: '#1a2e24'}}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="جمعية تآزر لرعاية الأيتام بمحافظة الدرب"
              width={160}
              height={160}
              className="h-32 w-auto object-contain"
            />
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} جمعية تآزر لرعاية الأيتام بمحافظة الدرب. جميع الحقوق محفوظة.
          </p>
          <div className="divider-gold mt-4" style={{width: '60px'}} />
          <p className="text-white/30 text-xs mt-3">
            منصة بطاقات التهنئة الإسلامية - مجانية للجميع
          </p>
        </div>
      </footer>
    </main>
  );
}
