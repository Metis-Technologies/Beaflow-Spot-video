"""Effetti sonori dello spot 39 «Paga come vuole»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""
import numpy as np


def effetti(s, a):
    put, tone, noise, env, add = a.put, a.tone, a.noise, a.env, a.add
    key, click, pop, big_pop, tick, thud, ding, buzz = a.key, a.click, a.pop, a.big_pop, a.tick, a.thud, a.ding, a.buzz
    whoosh, riser, impact, shimmer, coin, SR, DUR = a.whoosh, a.riser, a.impact, a.shimmer, a.coin, a.SR, a.DUR
    def coin():                           # moneta: due toni metallici brevi
        return add(0.6 * tone(2637, 0.25, 0.06), 0.4 * tone(3951, 0.2, 0.04), 0.3 * tone(1760, 0.15, 0.03))
    put(s, whoosh(0.8), 0.1, 0.05)
    for i in range(5): put(s, coin(), 0.35 + i * 0.33, 0.03)                       # monete sparse
    put(s, pop(523.25), 0.55, 0.12)
    put(s, riser(0.45), 2.05, 0.1); put(s, impact(), 2.5, 0.26); put(s, whoosh(0.6), 2.3, 0.08)   # registro in ordine
    for r in range(8): put(s, tick(1000 + 60 * r), 2.8 + r * 0.1, 0.03)
    put(s, impact(), 5.0, 0.12); put(s, ding(1046.5), 5.6, 0.1)                    # pagamento online
    for k in range(8): put(s, coin(), 5.3 + k * 0.25, 0.035)
    put(s, whoosh(0.7), 7.3, 0.08); put(s, impact(), 7.5, 0.12)
    for k in range(3): put(s, click(), 7.75 + k * 0.12, 0.08)                      # tasti del POS
    put(s, ding(880), 8.1, 0.1)
    for k in range(6): put(s, coin(), 8.3 + k * 0.25, 0.035)
    put(s, whoosh(0.6), 9.7, 0.07); put(s, impact(), 10.0, 0.12)
    put(s, whoosh(0.4), 11.05, 0.08); put(s, thud(), 11.5, 0.22); put(s, ding(1318.5), 11.55, 0.1)   # il cassetto si chiude
    put(s, riser(0.7), 12.15, 0.12); put(s, impact(), 12.85, 0.34); put(s, shimmer(1318.5), 12.9, 0.1)
    put(s, click(), 14.18, 0.2)
