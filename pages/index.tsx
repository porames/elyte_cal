"use client"
import React from "react";
import Link from 'next/link';

/* ---------------------------------------------------------
   Fonts + tokens
--------------------------------------------------------- */
function Tokens() {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      .elyte-root {
        --ink: #10202E;
        --muted: #5C7080;
        --bg: #F6F7F9;
        --border: #E3E7EA;
        --teal: #0E7C7B;
        font-family: 'IBM Plex Sans', sans-serif;
        color: var(--ink);
        background: var(--bg);
      }
      .mono { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
      .tile {
        transition: transform .15s ease, box-shadow .15s ease;
      }
      .tile:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(16,32,46,0.18);
      }
      .tile:not(:disabled):active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(16,32,46,0.12);
      }
    `}</style>
    );
}

interface CategoryTileProps {
    href: string;
    title: string;
    gradient: string;
    disabled?: boolean;
}

function CategoryTile({ href, title, gradient, disabled }: CategoryTileProps) {
    const content = (
        <button
            disabled={disabled}
            className="tile rounded-xl py-5 px-4 flex items-center justify-start text-left w-full disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: gradient, border: 'none' }}
        >
            <span className="text-base font-medium text-white">{title}</span>
        </button>
    );

    if (disabled) return content;

    return (
        <Link href={href} className="block">
            {content}
        </Link>
    );
}

function Eyebrow({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "teal" }) {
    const colors: Record<"muted" | "teal", string> = {
        muted: "var(--muted)",
        teal: "var(--teal)",
    };
    return (
        <p
            className="text-xs font-semibold tracking-wide uppercase mb-1"
            style={{ color: colors[tone], letterSpacing: "0.06em" }}
        >
            {children}
        </p>
    );
}

export default function Home() {
    return (
        <div className="elyte-root min-h-screen w-full flex justify-center p-6">
            <Tokens />
            <div className="w-full max-w-md">
                <div>
                    <Eyebrow tone="teal">Porames PocketMed</Eyebrow>
                    <h1 className="text-2xl font-semibold mb-1">
                        Emergency Room Pocket References{" "}
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">
                            BETA
                        </span>
                    </h1>
                    <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                        References for your ER decisions
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <CategoryTile
                            href="/elyte"
                            title="Electrolytes"
                            gradient="linear-gradient(135deg, #2F9E68, #15734A)"
                        />
                        <CategoryTile
                            href="/stroke"
                            title="Stroke"
                            gradient="linear-gradient(135deg, #D8453A, #8E2A22)"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}