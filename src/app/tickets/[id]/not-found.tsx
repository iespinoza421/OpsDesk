import Link from "next/link";

export default function TicketNotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Ticket not found</h1>
                <p className="mt-2 text-slate-400">
                    The ticket you are looking for does not exist.
                </p>
                <Link
                    href="/"
                    className="mt-4 inline-block rounded bg-slate-800 px-4 py-2 hover:bg-slate-700"
                >
                    Back to dashboard
                </Link>
            </div>
        </main>
    );
}