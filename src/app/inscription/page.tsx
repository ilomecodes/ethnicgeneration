"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function InscriptionPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères."); return; }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/compte");
    } else {
      setError(result.error ?? "Erreur lors de la création du compte.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f6f1e6" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-10 h-20 border-b" style={{ borderColor: "rgba(20,17,13,.1)" }}>
        <Link href="/" className="flex items-center gap-2 text-sm font-medium" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>
          <ArrowLeft size={15} strokeWidth={2} />
          Retour
        </Link>
        <span className="font-[family-name:var(--font-display)] italic text-xl" style={{ color: "#14110d" }}>
          Ethnicgeneration
        </span>
        <div className="w-20" />
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-light italic" style={{ color: "#14110d" }}>
              Créer un compte
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#b08a4a99" }}>
              Rejoignez la communauté Ethnicgeneration et suivez vos créations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#fee2e2", color: "#991b1b" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d" }}>
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amina Koné"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #e8d9bd", background: "#fff", color: "#14110d" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#b08a4a")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d9bd")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d" }}>
                Adresse e-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid #e8d9bd", background: "#fff", color: "#14110d" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#b08a4a")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d9bd")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d" }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-11"
                  style={{ border: "1.5px solid #e8d9bd", background: "#fff", color: "#14110d" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#b08a4a")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8d9bd")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#b08a4a99" }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <p className="text-xs" style={{ color: "#b08a4a99" }}>
              En créant un compte, vous acceptez nos{" "}
              <span className="underline cursor-pointer" style={{ color: "#b08a4a" }}>Conditions générales</span>{" "}
              et notre{" "}
              <span className="underline cursor-pointer" style={{ color: "#b08a4a" }}>Politique de confidentialité</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white mt-2 transition-opacity disabled:opacity-60"
              style={{ background: "#b08a4a" }}
            >
              {loading ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#b08a4a99" }}>
            Déjà un compte ?{" "}
            <Link href="/connexion" className="font-semibold" style={{ color: "#b08a4a" }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
