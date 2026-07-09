import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Send, Lock, Eye, EyeOff, Flame, Ghost, Heart, Laugh, Skull, X, LogOut, Users, MessageCircle } from "lucide-react";
import { supabase } from "./supabaseClient";

const REACTIONS = [
  { key: "fuego", icon: Flame, color: "#F0257C" },
  { key: "jaja", icon: Laugh, color: "#FFC93C" },
  { key: "wow", icon: Skull, color: "#3FA9F5" },
  { key: "amor", icon: Heart, color: "#F0257C" },
];

const CATEGORIES = ["Amor 💔", "Trabajo 💼", "Familia 👀", "Amistad 🙊", "Random 🎲"];

const ROTATIONS = ["-2.5deg", "1.5deg", "-1deg", "2deg", "-1.8deg", "1deg", "-2deg", "2.5deg"];

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return "justo ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

async function fetchPublicStories() {
  const { data, error } = await supabase
    .from("public_stories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error al cargar historias:", error.message);
    return [];
  }
  return data || [];
}

async function fetchAdminStories() {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error al cargar leads:", error.message);
    return [];
  }
  return data || [];
}

async function sendVerificationCode(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) {
    console.error("Error al enviar código:", error.message);
    throw error;
  }
}

async function verifyCode(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) {
    console.error("Error al verificar código:", error.message);
    throw error;
  }
  return data;
}

async function insertStory({ name, email, phone, category, text }) {
  const { data, error } = await supabase
    .from("stories")
    .insert([{ name, email, phone, category, text, reactions: {} }])
    .select();
  if (error) {
    console.error("Error al publicar:", error.message);
    throw error;
  }
  return data?.[0];
}

async function updateReaction(storyId, reactions) {
  const { error } = await supabase
    .from("stories")
    .update({ reactions })
    .eq("id", storyId);
  if (error) console.error("Error al reaccionar:", error.message);
}

function Blob({ className, style }) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(60px)",
        opacity: 0.5,
        ...style,
      }}
    />
  );
}

function DoodleStar({ style, color = "#1A1523", size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", ...style }}>
      <path d="M12 2.5 L14.4 9.2 L21.5 9.4 L15.8 13.7 L17.8 20.5 L12 16.5 L6.2 20.5 L8.2 13.7 L2.5 9.4 L9.6 9.2 Z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function DoodleHeart({ style, color = "#1A1523", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", ...style }}>
      <path d="M12 20.5c-.3 0-.6-.1-.8-.3C7.5 17 3 13 3 8.8 3 5.9 5.2 3.5 8 3.5c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.8 0 5 2.4 5 5.3 0 4.2-4.5 8.2-8.2 11.4-.2.2-.5.3-.8.3Z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function DoodleArrow({ style, color = "#1A1523", size = 44, flip = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      style={{ position: "absolute", transform: flip ? "scaleX(-1)" : "none", ...style }}>
      <path d="M32 8c-5 0-14 2-16 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M8 14l-2 6 6 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function DoodleScribble({ style, color = "#1A1523", size = 40 }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 40 16" fill="none" style={{ position: "absolute", ...style }}>
      <path d="M2 8c3-6 5-6 7 0s5 6 7 0 5-6 7 0 5 6 7 0" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function DoodleSpiral({ style, color = "#1A1523", size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: "absolute", ...style }}>
      <path d="M12 4c-4 0-7 3-7 7s2.5 6 6 6 5-2 5-4.5-1.5-4-3.5-4-3.5 1.5-3.5 3.5 1.5 3 3 3"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function DoodleTicks({ style, color = "#1A1523" }) {
  return (
    <svg width="26" height="34" viewBox="0 0 26 34" fill="none" style={{ position: "absolute", ...style }}>
      <path d="M3 3 L1 31 M9 5 L7 29 M15 3 L13 31 M21 5 L19 29" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
function TopBar({ view, setView }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 40,
      backdropFilter: "blur(14px)",
      background: "rgba(251, 243, 231, 0.88)",
      borderBottom: "2.5px solid #1A1523",
    }}>
      <div style={{
        maxWidth: 720, margin: "0 auto", padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div
          onClick={() => setView("feed")}
          style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
        >
          <div style={{
            position: "relative", background: "#fff",
            border: "2.5px solid #1A1523", borderRadius: "50% 50% 50% 8px",
            width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
            transform: "rotate(-8deg)", boxShadow: "2px 2px 0 #1A1523",
          }}>
            <Ghost size={19} color="#F0257C" strokeWidth={2.5} />
          </div>
          <span className="handwritten-title" style={{
            fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 30,
            color: "#1A1523", letterSpacing: "0.01em", transform: "rotate(-1deg)",
          }}>
            StoryTime
          </span>
        </div>
        <button
          onClick={() => setView("publish")}
          style={{
            fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13.5,
            background: "#F0257C", color: "#fff", border: "2.5px solid #1A1523",
            borderRadius: 999, padding: "8px 16px", cursor: "pointer",
            boxShadow: "3px 3px 0 #1A1523", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <Sparkles size={14} /> Cuéntalo
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div style={{
      position: "relative", overflow: "hidden", padding: "50px 20px 36px",
      maxWidth: 720, margin: "0 auto",
    }}>
      <DoodleStar style={{ top: 4, left: "8%" }} color="#1A1523" size={26} />
      <DoodleStar style={{ top: 18, left: "32%" }} color="#FFC93C" size={22} />
      <DoodleStar style={{ top: 30, right: "10%" }} color="#3FA9F5" size={20} />
      <DoodleHeart style={{ top: 60, left: "46%" }} color="#F0257C" size={22} />
      <DoodleArrow style={{ top: 8, right: "22%" }} color="#3FA9F5" size={40} />
      <DoodleSpiral style={{ bottom: 30, left: "4%" }} color="#F0257C" size={26} />
      <DoodleTicks style={{ top: 20, right: "4%" }} color="#F0257C" />
      <DoodleScribble style={{ bottom: 10, right: "18%" }} color="#1A1523" size={44} />

      <div style={{ position: "relative", textAlign: "center" }}>
        <span style={{
          display: "inline-block", fontFamily: "'Fredoka', sans-serif", fontWeight: 500,
          fontSize: 12.5, background: "#fff", border: "2px solid #1A1523", borderRadius: 999,
          padding: "5px 14px", marginBottom: 20, transform: "rotate(-2deg)",
          boxShadow: "2px 2px 0 #1A1523",
        }}>
          100% anónimo · nadie sabe quién lo escribió 👻
        </span>

        <h1 className="doodle-title" style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
          fontSize: "clamp(38px, 10vw, 60px)",
          lineHeight: 0.98, margin: "0 0 16px", letterSpacing: "-0.01em",
        }}>
          <span className="doodle-word" style={{ color: "#F0257C" }}>EL MURO</span>
          <br />
          <span style={{ color: "#1A1523" }}>donde se cuenta </span>
          <span className="doodle-underline-wrap" style={{ position: "relative", display: "inline-block" }}>
            <span style={{ color: "#3FA9F5" }}>todo</span>
            <svg width="100%" height="14" viewBox="0 0 120 14" preserveAspectRatio="none"
              style={{ position: "absolute", left: 0, bottom: -6, width: "100%" }}>
              <path d="M2 8c20-6 80-6 116 2" stroke="#1A1523" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </h1>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "#4A4358",
          maxWidth: 400, margin: "0 auto",
        }}>
          Lee las historias, chismes y confesiones de la comunidad. Nadie sabe quién las publica. Nadie sabrá que fuiste tú.
        </p>
      </div>
    </div>
  );
}
function StoryCard({ story, onReact, index }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const accents = ["#F0257C", "#3FA9F5", "#FFC93C"];
  const accent = accents[index % accents.length];
  return (
    <div
      style={{
        background: "#FFFDF8", border: "2.5px solid #1A1523", borderRadius: 14,
        padding: "20px 20px 16px", transform: `rotate(${rotation})`,
        boxShadow: "4px 4px 0 #1A1523", transition: "transform 0.15s ease",
        breakInside: "avoid", marginBottom: 22, position: "relative",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = `rotate(0deg) scale(1.015)`)}
      onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${rotation})`)}
    >
      <div style={{
        position: "absolute", top: -10, left: 18, width: 28, height: 14,
        background: "rgba(240,37,124,0.35)", transform: "rotate(-4deg)", borderRadius: 2,
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11,
          background: accent, color: "#fff", border: "1.5px solid #1A1523", borderRadius: 6,
          padding: "3px 8px",
        }}>
          {story.category}
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#B0A692" }}>
          {timeAgo(story.ts)}
        </span>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "#1A1523",
        lineHeight: 1.5, margin: "0 0 16px", whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>
        {story.text}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {REACTIONS.map((r) => {
          const Icon = r.icon;
          const count = story.reactions?.[r.key] || 0;
          return (
            <button
              key={r.key}
              onClick={() => onReact(story.id, r.key)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "#FBF3E7", border: "1.5px solid #1A1523", borderRadius: 999,
                padding: "5px 10px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                fontSize: 12, fontWeight: 600, color: "#1A1523",
              }}
            >
              <Icon size={13} color={r.color} strokeWidth={2.5} />
              {count > 0 ? count : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Feed({ stories, onReact, loading }) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, fontFamily: "'Inter', sans-serif", color: "#B0A692" }}>
        Cargando historias...
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "60px 20px", maxWidth: 420, margin: "0 auto",
      }}>
        <Ghost size={48} color="#3FA9F5" style={{ marginBottom: 12 }} />
        <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 19, color: "#1A1523", margin: "0 0 6px" }}>
          Aún no hay chismes...
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#B0A692" }}>
          Sé la primera persona en romper el hielo 👀
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 720, margin: "0 auto", padding: "0 20px 60px",
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18,
      alignItems: "start",
    }}>
      {stories.map((story, i) => (
        <StoryCard key={story.id} story={story} onReact={onReact} index={i} />
      ))}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label style={{
      display: "block", fontFamily: "'Inter', sans-serif", fontWeight: 600,
      fontSize: 12, color: "#1A1523", marginBottom: 5, marginTop: 12,
    }}>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14.5,
        border: "2px solid #1A1523", borderRadius: 10, padding: "11px 13px",
        outline: "none", background: "#fff", boxSizing: "border-box",
      }}
    />
  );
}
function PublishModal({ onClose, onPublish }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [error, setError] = useState("");
  const [codeError, setCodeError] = useState("");

  const canGoStep2 = name.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && phone.trim().length >= 7;

  const handleSendCode = async () => {
    setSendingCode(true);
    setCodeError("");
    try {
      await sendVerificationCode(email);
      setStep(2);
    } catch (e) {
      setError("No pudimos enviar el código. Revisa que el correo esté bien escrito.");
    }
    setSendingCode(false);
  };

  const handleVerifyCode = async () => {
    if (code.trim().length < 6) {
      setCodeError("El código tiene 6 dígitos");
      return;
    }
    setSendingCode(true);
    setCodeError("");
    try {
      await verifyCode(email, code.trim());
      setStep(3);
    } catch (e) {
      setCodeError("Código incorrecto o vencido. Intenta de nuevo.");
    }
    setSendingCode(false);
  };

  const handlePublish = async () => {
    if (text.trim().length < 8) {
      setError("Cuéntanos un poco más (mínimo 8 caracteres) ✍️");
      return;
    }
    setSubmitting(true);
    await onPublish({ name, email, phone, category, text });
    setSubmitting(false);
    setStep(4);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,21,35,0.55)", zIndex: 100,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div style={{
        background: "#FBF3E7", width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0",
        border: "2.5px solid #1A1523", borderBottom: "none", padding: "20px 22px 28px",
        maxHeight: "88vh", overflowY: "auto", position: "relative",
        animation: "slideUp 0.25s ease-out",
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, background: "#fff",
            border: "2px solid #1A1523", borderRadius: "50%", width: 30, height: 30,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>

        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, margin: "6px 0 4px" }}>
              Antes de publicar 🔒
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#4A4358", margin: "0 0 20px" }}>
              Tus datos son privados: nadie que lea la historia sabrá que fuiste tú. Verificamos tu correo para evitar spam.
            </p>
            <FieldLabel>Nombre</FieldLabel>
            <TextInput value={name} onChange={setName} placeholder="¿Cómo te llamas?" />
            <FieldLabel>Correo</FieldLabel>
            <TextInput value={email} onChange={setEmail} placeholder="tucorreo@gmail.com" type="email" />
            <FieldLabel>Celular</FieldLabel>
            <TextInput value={phone} onChange={setPhone} placeholder="55 1234 5678" type="tel" />
            {error && <p style={{ fontSize: 12, color: "#e74c3c", fontFamily: "'Inter', sans-serif", margin: "8px 0 0" }}>{error}</p>}
            <button
              disabled={!canGoStep2 || sendingCode}
              onClick={handleSendCode}
              style={{
                marginTop: 18, width: "100%", fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
                fontSize: 15, background: canGoStep2 ? "#3FA9F5" : "#D8CFE8", color: "#fff",
                border: "2px solid #1A1523", borderRadius: 12, padding: "13px", cursor: canGoStep2 ? "pointer" : "not-allowed",
                boxShadow: canGoStep2 ? "3px 3px 0 #1A1523" : "none",
              }}
            >
              {sendingCode ? "Enviando código..." : "Verificar correo →"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, margin: "6px 0 4px" }}>
              Revisa tu correo 📩
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#4A4358", margin: "0 0 20px" }}>
              Te enviamos un código de 6 dígitos a <strong>{email}</strong>. Escríbelo aquí para confirmar que el correo es tuyo.
            </p>
            <FieldLabel>Código de verificación</FieldLabel>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setCodeError(""); }}
              placeholder="123456"
              style={{
                width: "100%", fontFamily: "'Fredoka', sans-serif", fontSize: 24, fontWeight: 600,
                letterSpacing: "0.3em", textAlign: "center",
                border: "2px solid #1A1523", borderRadius: 10, padding: "13px",
                outline: "none", background: "#fff", boxSizing: "border-box",
              }}
            />
            {codeError && <p style={{ fontSize: 12, color: "#e74c3c", fontFamily: "'Inter', sans-serif", margin: "8px 0 0" }}>{codeError}</p>}
            <button
              disabled={sendingCode}
              onClick={handleVerifyCode}
              style={{
                marginTop: 18, width: "100%", fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
                fontSize: 15, background: "#3FA9F5", color: "#fff",
                border: "2px solid #1A1523", borderRadius: 12, padding: "13px", cursor: "pointer",
                boxShadow: "3px 3px 0 #1A1523",
              }}
            >
              {sendingCode ? "Verificando..." : "Confirmar código"}
            </button>
            <button
              onClick={handleSendCode}
              disabled={sendingCode}
              style={{
                marginTop: 10, width: "100%", fontFamily: "'Inter', sans-serif", fontWeight: 600,
                fontSize: 12.5, background: "none", color: "#4A4358",
                border: "none", padding: "6px", cursor: "pointer", textDecoration: "underline",
              }}
            >
              Reenviar código
            </button>
          </>
        )}
{step === 3 && (
          <>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, margin: "6px 0 4px" }}>
              Suéltalo todo 🙊
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#4A4358", margin: "0 0 16px" }}>
              Se publicará de forma anónima. Nadie verá tu nombre.
            </p>
            <FieldLabel>Categoría</FieldLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12.5,
                    padding: "7px 12px", borderRadius: 999, cursor: "pointer",
                    border: "2px solid #1A1523",
                    background: category === c ? "#FFC93C" : "#fff",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <FieldLabel>Tu historia</FieldLabel>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setError(""); }}
              placeholder="Escribe aquí... nadie sabrá que fuiste tú 👀"
              rows={5}
              maxLength={800}
              style={{
                width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14.5,
                border: "2px solid #1A1523", borderRadius: 12, padding: "12px 14px",
                resize: "none", outline: "none", background: "#fff", boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11.5, color: "#c0392b", fontFamily: "'Inter', sans-serif" }}>{error}</span>
              <span style={{ fontSize: 11.5, color: "#B0A692", fontFamily: "'Inter', sans-serif" }}>{text.length}/800</span>
              function AdminGate({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) {
      setErr("Correo o contraseña incorrectos");
    } else {
      onSuccess();
    }
  };

  return (
    <div style={{
      minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff", border: "2.5px solid #1A1523", borderRadius: 18,
        padding: 28, width: "100%", maxWidth: 340, boxShadow: "5px 5px 0 #1A1523",
        textAlign: "center",
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, background: "#1A1523",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
        }}>
          <Lock size={22} color="#FFC93C" />
        </div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, margin: "0 0 4px" }}>
          Panel privado
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#B0A692", marginBottom: 18 }}>
          Solo tú puedes ver esto
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          placeholder="Tu correo"
          style={{
            width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14,
            border: "2px solid #1A1523", borderRadius: 10,
            padding: "11px 13px", outline: "none", boxSizing: "border-box", marginBottom: 10,
          }}
        />
        <div style={{ position: "relative", marginBottom: 10 }}>
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Contraseña"
            style={{
              width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14,
              border: `2px solid ${err ? "#e74c3c" : "#1A1523"}`, borderRadius: 10,
              padding: "11px 40px 11px 13px", outline: "none", boxSizing: "border-box",
            }}
          />
          <button
            onClick={() => setShow(!show)}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: 2,
            }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {err && <p style={{ fontSize: 12, color: "#e74c3c", fontFamily: "'Inter', sans-serif", margin: "0 0 10px" }}>{err}</p>}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14,
            background: "#3FA9F5", color: "#fff", border: "2px solid #1A1523", borderRadius: 10,
            padding: "11px", cursor: "pointer", boxShadow: "3px 3px 0 #1A1523",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
              }
              function AdminPanel({ stories, onLogout, setView }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, margin: 0 }}>
          Tus leads 🔐
        </h2>
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif",
            fontWeight: 600, fontSize: 12.5, background: "#fff", border: "2px solid #1A1523",
            borderRadius: 999, padding: "7px 12px", cursor: "pointer",
          }}
        >
          <LogOut size={13} /> Salir
        </button>
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#B0A692", marginBottom: 20 }}>
        Datos privados de cada persona que publicó una historia. Esto no lo ve el público.
      </p>

      <div style={{
        display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap",
      }}>
        <StatChip icon={Users} label="Leads totales" value={stories.length} />
        <StatChip icon={MessageCircle} label="Historias" value={stories.length} />
      </div>

      {stories.length === 0 ? (
        <p style={{ fontFamily: "'Inter', sans-serif", color: "#B0A692", textAlign: "center", padding: 40 }}>
          Todavía no hay leads. Comparte el link en Instagram para empezar a recibir.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stories.map((s) => (
            <div key={s.id} style={{
              background: "#fff", border: "2px solid #1A1523", borderRadius: 12,
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14 }}>{s.name}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#B0A692" }}>{timeAgo(s.created_at)}</span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A4358", marginBottom: 8 }}>
                📧 {s.email} &nbsp;·&nbsp; 📱 {s.phone}
              </div>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1A1523",
                background: "#FBF3E7", borderRadius: 8, padding: "10px 12px",
              }}
                export default function StoryTimeApp() {
  const [view, setView] = useState("feed");
  const [publicStories, setPublicStories] = useState([]);
  const [adminStories, setAdminStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const loadPublicStories = useCallback(async () => {
    setLoading(true);
    const data = await fetchPublicStories();
    setPublicStories(data);
    setLoading(false);
  }, []);

  const loadAdminStories = useCallback(async () => {
    const data = await fetchAdminStories();
    setAdminStories(data);
  }, []);

  useEffect(() => {
    loadPublicStories();

    supabase.auth.getSession().then(({ data }) => {
      setAdminAuthed(!!data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminAuthed(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, [loadPublicStories]);

  useEffect(() => {
    if (adminAuthed) loadAdminStories();
  }, [adminAuthed, loadAdminStories]);

  const handlePublish = async ({ name, email, phone, category, text }) => {
    const newStory = await insertStory({ name, email, phone, category, text });
    if (newStory) {
      setPublicStories((prev) => [
        { id: newStory.id, created_at: newStory.created_at, category, text, reactions: {} },
        ...prev,
      ]);
    }
  };

  const handleReact = async (storyId, reactionKey) => {
    const target = publicStories.find((s) => s.id === storyId);
    if (!target) return;
    const updatedReactions = {
      ...target.reactions,
      [reactionKey]: (target.reactions?.[reactionKey] || 0) + 1,
    };
    setPublicStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, reactions: updatedReactions } : s))
    );
    await updateReaction(storyId, updatedReactions);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdminAuthed(false);
    setView("feed");
  };

  const feedStories = publicStories.map((s) => ({
    id: s.id, category: s.category, text: s.text, ts: s.created_at, reactions: s.reactions,
  }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FBF3E7",
      backgroundImage:
        "linear-gradient(rgba(26,21,35,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,21,35,0.06) 1px, transparent 1px)",
      backgroundSize: "26px 26px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        .doodle-title { -webkit-text-stroke: 2px #1A1523; paint-order: stroke fill; }
        @media (max-width: 480px) { .doodle-title { -webkit-text-stroke: 1.4px #1A1523; } }
      `}</style>

      <TopBar view={view} setView={setView} />

      {view === "feed" && (
        <>
          <Hero />
          <Feed stories={feedStories} onReact={handleReact} loading={loading} />
          <FooterAdminLink setView={setView} />
        </>
      )}

      {view === "admin" && checkingSession && (
        <div style={{ textAlign: "center", padding: 60, fontFamily: "'Inter', sans-serif", color: "#B0A692" }}>
          Verificando sesión...
        </div>
      )}
      {view === "admin" && !checkingSession && !adminAuthed && <AdminGate onSuccess={() => setAdminAuthed(true)} />}
      {view === "admin" && !checkingSession && adminAuthed && (
        <AdminPanel stories={adminStories} onLogout={handleLogout} setView={setView} />
      )}

      {view === "publish" && (
        <PublishModal onClose={() => setView("feed")} onPublish={handlePublish} />
      )}
    </div>
  );
}

function FooterAdminLink({ setView }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 20px 40px" }}>
      <button
        onClick={() => setView("admin")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#C4BBD4",
        }}
      >
        panel privado
      </button>
    </div>
  );
              }
