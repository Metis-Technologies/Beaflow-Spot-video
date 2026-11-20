"""Effetti sonori dello spot 41 «Sai sempre cosa c'è»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.8), 0.1, 0.05)
    put(s, a.buzz(), 0.9, 0.06); put(s, a.buzz(), 1.6, 0.05)                          # il vuoto rosso
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    for k in range(4): put(s, a.pop(784 + 60 * k), 2.85 + k * 0.08, 0.05)              # lo scaffale si riempie
    put(s, a.shimmer(1318.5), 3.2, 0.06)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    for t in (5.45, 6.05, 6.65):                                                         # vendite: il flacone vola via
        put(s, a.coin(), t, 0.08); put(s, a.whoosh(0.4), t + 0.05, 0.04); put(s, a.tick(1200), t + 0.25, 0.05)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    for t in (7.75, 7.95, 8.15): put(s, a.tick(1100), t, 0.04)
    put(s, a.ding(1318.5), 8.4, 0.12); put(s, a.ding(1318.5), 8.75, 0.08); put(s, a.pop(880), 8.45, 0.07)   # scorta bassa
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for i in range(10): put(s, a.click(), 10.15 + i * 0.07, 0.04)                      # ricarica a cascata
    put(s, a.shimmer(1318.5), 10.9, 0.07)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
