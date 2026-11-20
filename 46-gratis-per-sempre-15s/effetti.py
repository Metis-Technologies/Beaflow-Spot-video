"""Effetti sonori dello spot 46 «Gratis, per sempre»: uno per ogni evento visivo di scena.js.
s = traccia degli effetti, a = strumenti/motore/audio.py."""


def effetti(s, a):
    put = a.put
    put(s, a.whoosh(0.8), 0.1, 0.05); put(s, a.pop(880), 0.2, 0.08); put(s, a.coin(), 0.3, 0.08)   # «0 €» sul cartellino
    put(s, a.shimmer(1318.5), 0.9, 0.05)
    put(s, a.riser(0.45), 2.05, 0.1); put(s, a.impact(), 2.5, 0.26); put(s, a.whoosh(0.5), 2.45, 0.1)
    for i in range(18): put(s, a.tick(1400 - 20 * i), 2.7 + i * 0.13, 0.025)           # i rulli girano
    put(s, a.impact(), 5.0, 0.12); put(s, a.whoosh(0.5), 5.0, 0.06)
    put(s, a.click(), 5.3, 0.18); put(s, a.thud(), 5.32, 0.12); put(s, a.ding(1318.5), 5.38, 0.12)   # scatto su «0 €»
    put(s, a.whoosh(0.7), 7.3, 0.08); put(s, a.impact(), 7.5, 0.12)
    for i in range(6): put(s, a.pop(700 + 40 * i), 7.6 + i * 0.06, 0.04)               # la sede
    put(s, a.pop(988), 8.0, 0.06); put(s, a.pop(1046.5), 8.2, 0.06)                    # i due operatori
    put(s, a.whoosh(0.6), 9.7, 0.07); put(s, a.impact(), 10.0, 0.12)
    for k in range(7): put(s, a.tick(800 + 90 * k), 10.1 + k * 0.12, 0.04)             # i gradini salgono
    put(s, a.ding(1568), 11.0, 0.08)
    put(s, a.riser(0.7), 12.15, 0.12); put(s, a.impact(), 12.85, 0.34); put(s, a.shimmer(1318.5), 12.9, 0.1)
    put(s, a.click(), 14.18, 0.2)
