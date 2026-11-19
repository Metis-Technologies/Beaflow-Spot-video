"""Effetti sonori dello spot: uno per ogni evento visivo di scena.js, allo stesso istante.
s = traccia degli effetti, a = strumenti/motore/audio.py.
Suoni pronti: a.tick(f) a.click() a.key() a.pop(f) a.big_pop() a.thud() a.ding(f) a.coin() a.buzz()
              a.whoosh(dur) a.riser(dur) a.impact() a.shimmer(f); per suoni nuovi: a.tone, a.noise, a.env, a.add.
Volumi bassi: 0,03–0,15 per i dettagli, 0,26–0,34 solo per i due colpi (svolta a 2,5 s e logo a 12,85 s)."""


def effetti(s, a):
    put = a.put
    # scena 1 (0–2,5): il problema
    put(s, a.whoosh(0.8), 0.1, 0.05)
    # svolta sul battito a 2,5 s
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    # scena 3 (5–7,5)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    # scena 4 (7,5–10)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    # scena 5 (10–12,5)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    # chiusura comune: implosione nel logo a 12,85 s, pressione del bottone a 14,18 s (non cambiare)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
