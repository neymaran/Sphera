import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">Sphera</h1>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="voce@exemplo.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Senha
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          formAction={login}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 py-2 mb-2 transition-colors"
        >
          Entrar
        </button>
        <button
          formAction={signup}
          className="border border-foreground/20 rounded-md px-4 py-2 mb-2 hover:bg-zinc-100 transition-colors"
        >
          Criar Conta
        </button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-100 text-red-600 text-center rounded-md">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
