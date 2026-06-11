import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiUser, FiMail, FiBriefcase, FiSend,
  FiCheckCircle, FiAlertCircle, FiRefreshCw, FiArrowRight,
} from "react-icons/fi";
import useInView from "../hooks/useInView";
import SEO from "../components/SEO";
import styles from "./styles/ContactoPage.module.css";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

const TEMAS = [
  { value: "presupuesto", label: "Solicitar presupuesto" },
  { value: "cita",        label: "Reservar una cita" },
  { value: "seo",         label: "SEO" },
  { value: "automatizaciones", label: "Automatizaciones" },
  { value: "fotografia",  label: "Fotografía" },
  { value: "contenido",   label: "Contenido" },
];

const ALLOWED_TEMAS = new Set(TEMAS.map((t) => t.value));

/* ---- Validación ---- */
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
const NOMBRE_RE = /^[a-zA-ZÀ-ÿ\s'\-]+$/;

function validate({ nombre, email, empresa, tema }) {
  const errors = {};

  const n = nombre.trim();
  if (!n) errors.nombre = "El nombre es obligatorio";
  else if (n.length < 2) errors.nombre = "Mínimo 2 caracteres";
  else if (n.length > 100) errors.nombre = "Máximo 100 caracteres";
  else if (!NOMBRE_RE.test(n)) errors.nombre = "Solo letras, espacios y guiones";

  const e = email.trim().toLowerCase();
  if (!e) errors.email = "El email es obligatorio";
  else if (e.length > 254) errors.email = "Email demasiado largo";
  else if (!EMAIL_RE.test(e)) errors.email = "Formato de email incorrecto";

  const emp = empresa.trim();
  if (emp.length > 100) errors.empresa = "Máximo 100 caracteres";

  if (!tema) errors.tema = "Selecciona una opción";
  else if (!ALLOWED_TEMAS.has(tema)) errors.tema = "Opción no válida";

  return errors;
}

function sanitize(str) {
  return str.trim().replace(/[<>"'`]/g, "").slice(0, 500);
}

/* ---- Estado éxito ---- */
const SuccessState = ({ tema }) => {
  const msg = {
    presupuesto: "Recibirás un presupuesto personalizado en menos de 24h.",
    cita:        "Te confirmaremos la cita con todos los detalles por email.",
    seo:         "Te enviamos información detallada sobre nuestra estrategia SEO.",
    automatizaciones: "Te enviamos información sobre nuestros flujos de automatización.",
    fotografia:  "Te enviamos información sobre nuestras sesiones fotográficas.",
    contenido:   "Te enviamos información sobre nuestra estrategia de contenidos.",
  }[tema] ?? "Te contactaremos en breve con toda la información.";

  return (
    <div className={styles.successState}>
      <span className={styles.successIcon}>
        <FiCheckCircle size={52} />
      </span>
      <h2 className={styles.successHeadline}>¡Mensaje enviado!</h2>
      <p className={styles.successText}>{msg}</p>
      <Link to="/servicios" className={styles.successLink}>
        Ver nuestros servicios <FiArrowRight size={14} />
      </Link>
    </div>
  );
};

/* ---- Formulario ---- */
const ContactForm = () => {
  const [fields, setFields] = useState({ nombre: "", email: "", empresa: "", tema: "" });
  const [errors, setErrors] = useState({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const submitRef = useRef(false);

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const setTema = (value) =>
    setFields((prev) => ({ ...prev, tema: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitRef.current) return; // evita doble envío

    // Honeypot: bot detectado → silencio
    if (honeypot) {
      setStatus("success");
      return;
    }

    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (!WEBHOOK_URL) {
      setStatus("error");
      return;
    }

    submitRef.current = true;
    setStatus("loading");

    try {
      const payload = {
        nombre:   sanitize(fields.nombre),
        email:    fields.email.trim().toLowerCase(),
        empresa:  sanitize(fields.empresa),
        tema:     fields.tema,
      };

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
      submitRef.current = false;
    }
  };

  if (status === "success") return <SuccessState tema={fields.tema} />;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot oculto */}
      <div className={styles.honeypot} aria-hidden="true">
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex="-1"
        />
      </div>

      {/* Error global */}
      {status === "error" && (
        <div className={styles.errorBanner} role="alert">
          <span className={styles.errorBannerIcon}>
            <FiAlertCircle size={18} />
          </span>
          Algo ha fallado. Comprueba tu conexión e inténtalo de nuevo.
        </div>
      )}

      {/* Nombre */}
      <div className={`${styles.field} ${errors.nombre ? styles.fieldError : ""}`}>
        <span className={styles.fieldIcon}><FiUser size={16} /></span>
        <input
          id="nombre"
          type="text"
          className={styles.input}
          value={fields.nombre}
          onChange={set("nombre")}
          placeholder=" "
          maxLength={100}
          autoComplete="name"
        />
        <label htmlFor="nombre" className={styles.label}>Nombre</label>
        {errors.nombre && <span className={styles.errorMsg}>{errors.nombre}</span>}
      </div>

      {/* Email */}
      <div className={`${styles.field} ${errors.email ? styles.fieldError : ""}`}>
        <span className={styles.fieldIcon}><FiMail size={16} /></span>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={fields.email}
          onChange={set("email")}
          placeholder=" "
          maxLength={254}
          autoComplete="email"
          inputMode="email"
        />
        <label htmlFor="email" className={styles.label}>Email</label>
        {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
      </div>

      {/* Empresa */}
      <div className={`${styles.field} ${errors.empresa ? styles.fieldError : ""}`}>
        <span className={styles.fieldIcon}><FiBriefcase size={16} /></span>
        <input
          id="empresa"
          type="text"
          className={styles.input}
          value={fields.empresa}
          onChange={set("empresa")}
          placeholder=" "
          maxLength={100}
          autoComplete="organization"
        />
        <label htmlFor="empresa" className={styles.label}>
          Empresa
          <span className={styles.optionalTag}>(opcional)</span>
        </label>
        {errors.empresa && <span className={styles.errorMsg}>{errors.empresa}</span>}
      </div>

      {/* Tema */}
      <div className={`${styles.temaGroup} ${errors.tema ? styles.temaGroupError : ""}`}>
        <span className={styles.temaGroupLabel}>¿En qué podemos ayudarte?</span>
        <div className={styles.temaPills}>
          {TEMAS.map(({ value, label }) => (
            <label
              key={value}
              className={`${styles.temaPill} ${fields.tema === value ? styles.temaPillSelected : ""}`}
            >
              <input
                type="radio"
                name="tema"
                value={value}
                checked={fields.tema === value}
                onChange={() => setTema(value)}
              />
              <span className={styles.temaPillLabel}>{label}</span>
            </label>
          ))}
        </div>
        {errors.tema && <span className={styles.temaErrorMsg}>{errors.tema}</span>}
      </div>

      {/* Submit */}
      <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <FiRefreshCw size={16} className={styles.spinner} />
            Enviando…
          </>
        ) : (
          <>
            <FiSend size={16} />
            Enviar mensaje
          </>
        )}
      </button>
    </form>
  );
};

/* ---- Página ---- */
const ContactoPage = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [formRef, formInView] = useInView({ threshold: 0.05 });

  return (
    <main>
      <SEO
        title="Contacto — Solicita Presupuesto"
        description="Contacta con Swift Studio. Solicita presupuesto, reserva una cita o infórmate sobre nuestros servicios de marketing digital, fotografía y automatización. Respuesta en menos de 24h."
        canonical="/contacto"
      />
      {/* Hero */}
      <section className={styles.hero}>
        <div ref={heroRef} className={styles.heroContainer}>
          <span className={`${styles.heroLabel} ${styles.fadeIn} ${heroInView ? styles.visible : ""}`}>
            Contacto
          </span>
          <h1 className={`${styles.heroHeadline} ${styles.fadeIn} ${styles.delay1} ${heroInView ? styles.visible : ""}`}>
            ¿Empezamos algo?
          </h1>
          <p className={`${styles.heroSubheadline} ${styles.fadeIn} ${styles.delay2} ${heroInView ? styles.visible : ""}`}>
            Cuéntanos qué necesitas y te respondemos con una propuesta
            adaptada a tu negocio en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className={styles.formSection}>
        <div ref={formRef} className={styles.formContainer}>

          {/* Columna izquierda — proceso */}
          <div className={`${styles.infoCol} ${styles.fadeIn} ${formInView ? styles.visible : ""}`}>
            <h2 className={styles.infoHeadline}>
              Te respondemos en menos de 24h
            </h2>
            <p className={styles.infoText}>
              Sin formularios que se pierden en carpetas. Cada solicitud
              la recibimos en tiempo real y la gestionamos personalmente.
            </p>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>01</div>
                <div className={styles.stepText}>
                  <span className={styles.stepTitle}>Rellena el formulario</span>
                  Nombre, email y lo que necesitas — en menos de 2 minutos.
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>02</div>
                <div className={styles.stepText}>
                  <span className={styles.stepTitle}>Recibimos tu solicitud</span>
                  Llega directamente a nuestro equipo con todos los detalles.
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>03</div>
                <div className={styles.stepText}>
                  <span className={styles.stepTitle}>Te contactamos</span>
                  En menos de 24h tienes respuesta con una propuesta real.
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha — formulario */}
          <div className={`${styles.formCard} ${styles.fadeIn} ${styles.delay1} ${formInView ? styles.visible : ""}`}>
            <ContactForm />
          </div>

        </div>
      </section>
    </main>
  );
};

export default ContactoPage;
