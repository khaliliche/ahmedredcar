import { loginAction } from "@/app/admin/real/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        action={loginAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-black/10 p-8 shadow-lg"
      >
        <h1 className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
          Admin
        </h1>

        {params.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {params.error === "locked"
              ? "Trop de tentatives. Compte verrouille 15 minutes."
              : "Mot de passe incorrect."}
          </p>
        )}

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Mot de passe</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded-lg border border-black/15 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-[var(--color-red-primary)] px-4 py-2.5 font-semibold text-white"
        >
          Connexion
        </button>
      </form>
    </main>
  );
}

