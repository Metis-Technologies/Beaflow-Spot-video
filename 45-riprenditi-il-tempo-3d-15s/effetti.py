"""Effetti sonori dello spot 45 «Riprenditi il tuo tempo»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.shimmer(1046.5), 0.1, 0.06); put(s, a.riser(1.6), 0.3, 0.04)               # la sabbia sale
    for i in range(6): put(s, a.tick(1200 + 40 * i), 0.4 + i * 0.28, 0.025)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    for k in range(8): put(s, a.click(), 2.95 + k * 0.22, 0.05)                         # le prenotazioni arrivano
    for k in range(3): put(s, a.pop(784 + 98 * k), 3.0 + k * 0.22, 0.06)
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    put(s, a.ding(1318.5), 5.3, 0.14); put(s, a.ding(1318.5), 5.65, 0.1); put(s, a.ding(1568), 6.2, 0.1)   # campanella
    put(s, a.pop(880), 5.6, 0.07)
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    put(s, a.whoosh(0.9), 7.65, 0.06); put(s, a.coin(), 7.8, 0.1)                       # la moneta vola
    put(s, a.click(), 8.45, 0.16); put(s, a.thud(), 8.47, 0.1); put(s, a.coin(), 8.5, 0.12)   # si incastra
    put(s, a.pop(880), 8.55, 0.06)
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    put(s, a.whoosh(1.0), 10.35, 0.06); put(s, a.thud(), 11.25, 0.14); put(s, a.click(), 11.27, 0.1)   # la porta si chiude
    put(s, a.shimmer(1046.5), 11.3, 0.07)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
